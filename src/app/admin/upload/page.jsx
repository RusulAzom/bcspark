"use client"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export default function UploadPage() {
  const [loading, setLoading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true)
    const text = await file.text();
    const jsonData = JSON.parse(text);

    try {
      // tomar JSON er moddhe job_blog_post ase tai oita nibo
      await addDoc(collection(db, "circulars"), {
       ...jsonData.job_blog_post,
        createdAt: serverTimestamp()
      });
      alert("✅ Firebase e upload hoye geche!");
    } catch (error) {
      alert("❌ Error: " + error);
    }
    setLoading(false)
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">JSON File Upload koro</h1>
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        disabled={loading}
        className="border p-2 rounded"
      />
      {loading && <p>Upload hocche...</p>}
    </div>
  )
}