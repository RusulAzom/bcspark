"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FileUp, Loader2 } from "lucide-react";

function generateSlug(title: string): string {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 80);
}

export default function BulkUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return alert("কোনো ফাইল সিলেক্ট করেন নাই");
    
    setLoading(true);
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const fileText = await file.text();
        const jsonData = JSON.parse(fileText);
        const title = jsonData.title || jsonData.job_blog_post?.title || "";
        const slug = generateSlug(title);

        await addDoc(collection(db, "circulars"), {
          ...jsonData,
          created_at: serverTimestamp(),
          file_name: file.name,
          slug,
        });

        setProgress(((i + 1) / files.length) * 100);
        
      } catch (err) {
        console.error(`${file.name} upload failed`, err);
        alert(`${file.name} এ error হইছে`);
      }
    }

    setLoading(false);
    alert(`${files.length} টা ফাইল সফলভাবে upload হইছে!`);
    setFiles([]);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Bulk Job Upload</h1>
      
      <input
        type="file"
        multiple
        accept=".json"
        onChange={handleFileChange}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {files.length > 0 && (
        <p className="mt-2 text-sm text-gray-600">{files.length} টা ফাইল সিলেক্ট করা হইছে</p>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading? <Loader2 className="animate-spin" /> : <FileUp />}
        {loading? `Uploading... ${progress.toFixed(0)}%` : "Upload All Jobs"}
      </button>
    </div>
  );
}