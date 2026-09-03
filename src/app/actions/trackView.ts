// src/app/actions/trackView.ts
// VIEW COUNTER TEMPORARILY DISABLED (stabilize SSR on Vercel)
//
// `trackArticleView` is currently a no-op: it touches neither Firebase/Firestore
// nor cookies, so calling it has zero DB/latency overhead and can never fail.
// The full, working implementation (atomic `increment(1)` + 30-minute cookie
// deduplication + revalidation) is preserved below, commented out, so the
// feature can be re-enabled by restoring the imports and the function body.
"use server";

// --- Disabled implementation (restore to re-enable view counting) ------------
// import { cookies } from "next/headers";
// import { revalidatePath } from "next/cache";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   doc,
//   updateDoc,
//   increment,
// } from "firebase/firestore";
// import { db } from "@/lib/firebase";
//
// // 30 minutes
// const DEDUP_MS = 30 * 60 * 1000;
// const DEDUP_SECONDS = 30 * 60;
//
// /**
//  * Atomic view increment — ISOLATED DB MUTATION. Never throws.
//  */
// async function incrementPostViews(postId: string): Promise<boolean> {
//   try {
//     const postRef = doc(db, "blogs", postId);
//     await updateDoc(postRef, { views: increment(1) });
//     return true;
//   } catch (error) {
//     console.error("Failed to update view count on Vercel:", error);
//     return false;
//   }
// }
//
// /** Read the dedup cookie. Never throws. */
// async function hasRecentViewCookie(slug: string): Promise<boolean> {
//   try {
//     const cookieStore = await cookies();
//     const prevRaw = cookieStore.get(`viewed_article_${slug}`)?.value;
//     if (!prevRaw) return false;
//     const prevTime = parseInt(prevRaw, 10);
//     return !Number.isNaN(prevTime) && Date.now() - prevTime < DEDUP_MS;
//   } catch (error) {
//     console.error("View dedup cookie read failed:", error);
//     return false;
//   }
// }
//
// /** Persist the dedup cookie. Never throws. */
// async function setViewedCookie(slug: string): Promise<void> {
//   try {
//     const cookieStore = await cookies();
//     cookieStore.set(`viewed_article_${slug}`, String(Date.now()), {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: process.env.NODE_ENV === "production",
//       maxAge: DEDUP_SECONDS,
//       path: "/",
//     });
//   } catch (error) {
//     console.error("View dedup cookie write failed:", error);
//   }
// }
//
// /** Refresh cached pages. Never throws. */
// async function revalidateViewPaths(slug: string): Promise<void> {
//   try {
//     revalidatePath(`/blog/${slug}`);
//     revalidatePath("/blog");
//     revalidatePath("/");
//   } catch (error) {
//     console.error("revalidatePath after view tracking failed:", error);
//   }
// }

/**
 * No-op stub — kept so `ArticleViewTracker` can still import it without error.
 * Does NOT touch Firebase/Firestore and does NOT set cookies.
 */
export async function trackArticleView(_slug: string) {
  return { success: true, counted: false } as const;
}