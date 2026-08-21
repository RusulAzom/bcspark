// src/lib/firebase-storage.ts
// Shared helper for uploading blog media (cover images + inline editor images)
// to Firebase Storage and returning a download URL.
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

/**
 * Uploads a file to Firebase Storage and resolves with its public download URL.
 *
 * @param file   The file (image) to upload.
 * @param folder Storage folder path, defaults to "blog_covers".
 * @returns      Download URL of the uploaded file.
 */
export async function uploadFileAndGetUrl(
  file: File,
  folder = "blog_covers"
): Promise<string> {
  if (!storage) {
    throw new Error(
      "Firebase Storage is not initialized. Check your environment variables."
    );
  }

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storageRef = ref(storage, `${folder}/${timestamp}_${safeName}`);

  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);

  return downloadUrl;
}
