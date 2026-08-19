"use server"
import { db } from "./firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

function generateSlug(title: string): string {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 80);
}

export async function addJobCircular(data: any) {
  try {
    const title = data.job_blog_post?.title ?? data.title ?? "";
    const slug = generateSlug(title);

    const docRef = await addDoc(collection(db, "circulars"), {
      ...data.job_blog_post,
      createdAt: serverTimestamp(),
      slug,
    });
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, error: e };
  }
}

export async function addJobSolution(data: any) {
  try {
    const title =
      data.examInfo?.examName ??
      data.examInfo?.postName ??
      data.title ??
      "Job Solution";
    const slug = generateSlug(title);

    const docRef = await addDoc(collection(db, "job_solutions"), {
      ...data,
      title,
      createdAt: serverTimestamp(),
      slug,
    });
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, error: e };
  }
}
