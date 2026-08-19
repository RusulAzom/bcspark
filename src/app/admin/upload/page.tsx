"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { addJobSolution } from "@/lib/firebase-actions";
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

  const [solutionFiles, setSolutionFiles] = useState<File[]>([]);
  const [solutionLoading, setSolutionLoading] = useState(false);
  const [solutionProgress, setSolutionProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSolutionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSolutionFiles(Array.from(e.target.files));
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

  const handleSolutionUpload = async () => {
    if (solutionFiles.length === 0)
      return alert("কোনো ফাইল সিলেক্ট করেন নাই");

    setSolutionLoading(true);
    setSolutionProgress(0);

    for (let i = 0; i < solutionFiles.length; i++) {
      const file = solutionFiles[i];

      try {
        const fileText = await file.text();
        const jsonData = JSON.parse(fileText);

        const result = await addJobSolution(jsonData);

        if (!result.success) {
          throw new Error(
            result.error instanceof Error
              ? result.error.message
              : "Unknown error"
          );
        }

        setSolutionProgress(((i + 1) / solutionFiles.length) * 100);
      } catch (err) {
        console.error(`${file.name} upload failed`, err);
        alert(`${file.name} এ error হইছে`);
      }
    }

    setSolutionLoading(false);
    alert(`${solutionFiles.length} টা ফাইল সফলভাবে upload হইছে!`);
    setSolutionFiles([]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Upload</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Bulk Job Upload (Circulars) */}
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Bulk Job Upload</h2>

          <input
            type="file"
            multiple
            accept=".json"
            onChange={handleFileChange}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {files.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {files.length} টা ফাইল সিলেক্ট করা হইছে
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? <Loader2 className="animate-spin" /> : <FileUp />}
            {loading
              ? `Uploading... ${progress.toFixed(0)}%`
              : "Upload All Jobs"}
          </button>
        </div>

        {/* Recent Job Solution Upload */}
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Job Solution</h2>

          <input
            type="file"
            multiple
            accept=".json"
            onChange={handleSolutionFileChange}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          {solutionFiles.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {solutionFiles.length} টা ফাইল সিলেক্ট করা হইছে
            </p>
          )}

          <button
            onClick={handleSolutionUpload}
            disabled={solutionLoading}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {solutionLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <FileUp />
            )}
            {solutionLoading
              ? `Uploading... ${solutionProgress.toFixed(0)}%`
              : "Upload Job Solutions"}
          </button>
        </div>
      </div>
    </div>
  );
}