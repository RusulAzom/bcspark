// src/app/actions/trackView.ts
// Server action that records a blog article view in Firestore, safely and with
// 30-minute visitor deduplication via a first-party cookie.
//
// CRITICAL ARCHITECTURE NOTE
// --------------------------
// This is the ONLY place in the blog that performs a Firestore WRITE for view
// counting, and it is invoked from the client (`ArticleViewTracker`) — never
// from the page render path. Every DB mutation below is wrapped in its own
// try/catch so a failed/timed-out write can never crash the SSR pipeline or
// bubble up as a 500 on Vercel.
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// 30 minutes
const DEDUP_MS = 30 * 60 * 1000;
const DEDUP_SECONDS = 30 * 60;

/**
 * Atomic view increment — ISOLATED DB MUTATION.
 * Never getDoc-then-update(+1) (races). Never throws: any failure is logged and
 * reported as `false` so the caller (and the page) is never affected.
 */
async function incrementPostViews(postId: string): Promise<boolean> {
  try {
    const postRef = doc(db, "blogs", postId);
    await updateDoc(postRef, { views: increment(1) });
    return true;
  } catch (error) {
    // Do not throw here! A failed/timeout write must never break the article.
    console.error("Failed to update view count on Vercel:", error);
    return false;
  }
}

/** Read the dedup cookie. Never throws. */
async function hasRecentViewCookie(slug: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const prevRaw = cookieStore.get(`viewed_article_${slug}`)?.value;
    if (!prevRaw) return false;
    const prevTime = parseInt(prevRaw, 10);
    return !Number.isNaN(prevTime) && Date.now() - prevTime < DEDUP_MS;
  } catch (error) {
    // If the cookie system is unavailable, skip dedup rather than crash.
    console.error("View dedup cookie read failed:", error);
    return false;
  }
}

/** Persist the dedup cookie. Never throws. */
async function setViewedCookie(slug: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set(`viewed_article_${slug}`, String(Date.now()), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: DEDUP_SECONDS,
      path: "/",
    });
  } catch (error) {
    console.error("View dedup cookie write failed:", error);
  }
}

/** Refresh cached pages. Never throws. */
async function revalidateViewPaths(slug: string): Promise<void> {
  try {
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/blog");
    revalidatePath("/");
  } catch (error) {
    console.error("revalidatePath after view tracking failed:", error);
  }
}

export async function trackArticleView(slug: string) {
  try {
    if (!slug || typeof slug !== "string") {
      return { success: false, counted: false };
    }

    // 1. Validate the slug resolves to a real, published blog post. We never
    //    trust the client for the count — only the slug.
    let postId: string | null = null;
    try {
      const q = query(collection(db, "blogs"), where("slug", "==", slug));
      const snap = await getDocs(q);
      postId = snap.empty ? null : snap.docs[0].id;
    } catch (error) {
      console.error("View tracking: slug lookup failed:", error);
      return { success: false, counted: false };
    }

    if (!postId) {
      return { success: false, counted: false, error: "not_found" };
    }

    // 2. Deduplicate: same visitor + same article within 30 minutes → count 0.
    if (await hasRecentViewCookie(slug)) {
      return { success: true, counted: false };
    }

    // 3. Safe, isolated, atomic increment (cannot throw).
    const counted = await incrementPostViews(postId);

    // 4. + 5. Best-effort bookkeeping — both are individually fail-safe.
    await setViewedCookie(slug);
    await revalidateViewPaths(slug);

    return { success: true, counted };
  } catch (error) {
    // Tracking must never break reading — fail silently.
    console.error("trackArticleView error:", error);
    return { success: false, counted: false };
  }
}