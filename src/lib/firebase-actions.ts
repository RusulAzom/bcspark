"use server"
import { db } from "./firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export async function addJobCircular(data: any) {
  try {
    const docRef = await addDoc(collection(db, "circulars"), {
      ...data.job_blog_post,
      createdAt: serverTimestamp(),
      slug: data.job_blog_post.title.replace(/ /g, "-").substring(0, 50) // url er jonno
    });
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    return { success: false, error: e };
  }
}