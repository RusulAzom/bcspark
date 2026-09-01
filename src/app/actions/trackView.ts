// src/app/actions/trackView.ts
// Server action that records a blog article view in Firestore, safely and with
// 30-minute visitor deduplication via a first-party cookie.
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

export async function trackArticleView(slug: string) {
  try {
    if (!slug || typeof slug !== "string") {
      return { success: false, counted: false };
    }

    // 1. Validate the slug resolves to a real, published blog post. We never
    //    trust the client for the count — only the slug.
    const q = query(collection(db, "blogs"), where("slug", "==", slug));
    const snap = await getDocs(q);
    if (snap.empty) {
      return { success: false, counted: false, error: "not_found" };
    }
    const postDoc = snap.docs[0];

    // 2. Deduplicate: same visitor + same article within 30 minutes → count 0.
    const cookieStore = await cookies();
    const cookieName = `viewed_article_${slug}`;
    const prevRaw = cookieStore.get(cookieName)?.value;
    if (prevRaw) {
      const prevTime = parseInt(prevRaw, 10);
      if (!Number.isNaN(prevTime) && Date.now() - prevTime < DEDUP_MS) {
        return { success: true, counted: false };
      }
    }

    // 3. Atomic increment — never getDoc-then-update (+1), which can race.
    const postRef = doc(db, "blogs", postDoc.id);
    await updateDoc(postRef, { views: increment(1) });

    // 4. Set the dedup cookie (overwrites any older one).
    cookieStore.set(cookieName, String(Date.now()), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: DEDUP_SECONDS,
      path: "/",
    });

    // 5. Let the fresh count show on the article page, listing, and home page.
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/blog");
    revalidatePath("/");

    return { success: true, counted: true };
  } catch (err) {
    // Tracking must never break reading — fail silently.
    console.error("trackArticleView error:", err);
    return { success: false, counted: false };
  }
}