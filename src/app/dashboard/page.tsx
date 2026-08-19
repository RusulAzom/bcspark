"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { FileText, BookOpen, Loader2 } from "lucide-react";
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import * as XLSX from "xlsx";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function generateSlug(title: string): string {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .substring(0, 80);
}

function readWorkbook(file: File): Promise<Record<string, any>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

export default function DashboardPage() {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const [circularFiles, setCircularFiles] = useState<File[]>([]);
  const [solutionFiles, setSolutionFiles] = useState<File[]>([]);
  const [circularLoading, setCircularLoading] = useState(false);
  const [solutionLoading, setSolutionLoading] = useState(false);
  const [circularProgress, setCircularProgress] = useState(0);
  const [solutionProgress, setSolutionProgress] = useState(0);

  const circularInputRef = useRef<HTMLInputElement>(null);
  const solutionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleCircularUpload = async () => {
    if (circularFiles.length === 0) {
      toast.error("Please select a file first");
      return;
    }
    setCircularLoading(true);
    setCircularProgress(0);
    try {
      const rows = await readWorkbook(circularFiles[0]);
      const batch = writeBatch(db);
      rows.forEach((row) => {
        const title = row.title || row.job_blog_post?.title || "";
        const slug = generateSlug(title);
        const ref = doc(collection(db, "circulars"));
        batch.set(ref, {
          ...row,
          createdAt: serverTimestamp(),
          slug,
        });
      });
      await batch.commit();
      toast.success(`${rows.length} job circulars uploaded successfully`);
      setCircularFiles([]);
      setCircularProgress(0);
      if (circularInputRef.current) circularInputRef.current.value = "";
    } catch (err) {
      console.error("Bulk upload failed", err);
      toast.error("Bulk upload failed. Please try again.");
    } finally {
      setCircularLoading(false);
    }
  };

  const handleSolutionUpload = async () => {
    if (solutionFiles.length === 0) {
      toast.error("Please select a file first");
      return;
    }
    setSolutionLoading(true);
    setSolutionProgress(0);
    try {
      const rows = await readWorkbook(solutionFiles[0]);
      const batch = writeBatch(db);
      rows.forEach((row) => {
        const title =
          row.examInfo?.examName ??
          row.exam_title ??
          row.examInfo?.postName ??
          row.post_name ??
          row.title ??
          "Job Solution";
        const organization =
          row.examInfo?.examTaker ??
          row.organization ??
          row.examInfo?.organization ??
          "";
        const slug = generateSlug(title);
        const ref = doc(collection(db, "job_solutions"));
        batch.set(ref, {
          ...row,
          title,
          organization,
          createdAt: serverTimestamp(),
          slug,
        });
      });
      await batch.commit();
      toast.success(`${rows.length} job solutions uploaded successfully`);
      setSolutionFiles([]);
      setSolutionProgress(0);
      if (solutionInputRef.current) solutionInputRef.current.value = "";
    } catch (err) {
      console.error("Solution upload failed", err);
      toast.error("Solution upload failed. Please try again.");
    } finally {
      setSolutionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (role !== "admin") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-brand-bg">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You do not have permission to view this page.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-brand-bg py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome, {user.displayName || user.email}
          </h1>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Bulk Job Upload */}
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Bulk Job Upload
                </h2>
              </div>

              <input
                ref={circularInputRef}
                type="file"
                accept=".xlsx,.csv"
                onChange={(e) => {
                  if (e.target.files) {
                    setCircularFiles(Array.from(e.target.files));
                  }
                }}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
              />

              {circularFiles.length > 0 && (
                <p className="mt-2 text-sm text-gray-600 mb-4">
                  {circularFiles.length} file(s) selected
                </p>
              )}

              <button
                onClick={handleCircularUpload}
                disabled={circularLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {circularLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <FileText className="h-5 w-5" />
                )}
                {circularLoading
                  ? `Uploading... ${circularProgress.toFixed(0)}%`
                  : "Upload All Jobs"}
              </button>
            </div>

            {/* Recent Job Solution Upload */}
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Job Solution
                </h2>
              </div>

              <input
                ref={solutionInputRef}
                type="file"
                accept=".xlsx,.csv"
                onChange={(e) => {
                  if (e.target.files) {
                    setSolutionFiles(Array.from(e.target.files));
                  }
                }}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 mb-4"
              />

              {solutionFiles.length > 0 && (
                <p className="mt-2 text-sm text-gray-600 mb-4">
                  {solutionFiles.length} file(s) selected
                </p>
              )}

              <button
                onClick={handleSolutionUpload}
                disabled={solutionLoading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
              >
                {solutionLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <BookOpen className="h-5 w-5" />
                )}
                {solutionLoading
                  ? `Uploading... ${solutionProgress.toFixed(0)}%`
                  : "Upload Job Solutions"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
