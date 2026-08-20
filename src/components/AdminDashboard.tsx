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
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import AppSidebar from "@/components/AppSidebar";
import Topbar from "@/components/Topbar";
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

async function parseFile(file: File): Promise<Record<string, any>[]> {
  const text = await file.text();
  const data = JSON.parse(text);

  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object") {
    if ("job_blog_post" in data) {
      return [data.job_blog_post as Record<string, any>];
    }
    return [data as Record<string, any>];
  }

  throw new Error("Invalid JSON format");
}

function validateCircularRow(row: Record<string, any>): string | null {
  const required = ["title", "organization", "deadline", "slug"];
  for (const field of required) {
    if (!(field in row)) return field;
  }
  return null;
}

function mapCircularRow(row: Record<string, any>) {
  const title = row.title ?? "";
  const organization = row.summary?.organization_name ?? "";
  const deadline = row.summary?.application_deadline ?? "";
  const slug = title.toLowerCase().replace(/ /g, "-");
  return { ...row, title, organization, deadline, slug };
}

async function commitBatch(collectionName: string, docs: Record<string, any>[]) {
  const chunks: Record<string, any>[][] = [];
  for (let i = 0; i < docs.length; i += 500) {
    chunks.push(docs.slice(i, i + 500));
  }

  for (const chunk of chunks) {
    const batch = writeBatch(db);
    chunk.forEach((row) => {
      const ref = doc(collection(db, collectionName));
      batch.set(ref, {
        ...row,
        createdAt: serverTimestamp(),
      });
    });
    await batch.commit();
  }
}

export default function AdminDashboard() {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  const [circularFiles, setCircularFiles] = useState<File[]>([]);
  const [solutionFiles, setSolutionFiles] = useState<File[]>([]);
  const [circularLoading, setCircularLoading] = useState(false);
  const [solutionLoading, setSolutionLoading] = useState(false);
  const [circularProgress, setCircularProgress] = useState(0);
  const [solutionProgress, setSolutionProgress] = useState(0);
  const [recentSolutions, setRecentSolutions] = useState<Record<string, any>[]>([]);
  const [solutionsLoading, setSolutionsLoading] = useState(false);

  const circularInputRef = useRef<HTMLInputElement>(null);
  const solutionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    } else if (role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, loading, role, router]);

  useEffect(() => {
    const fetchRecent = async () => {
      setSolutionsLoading(true);
      try {
        const q = query(collection(db, "job_solutions"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setRecentSolutions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to fetch recent solutions", err);
      } finally {
        setSolutionsLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const handleCircularUpload = async () => {
    if (circularFiles.length === 0) {
      toast.error("Please select a file first");
      return;
    }
    setCircularLoading(true);
    setCircularProgress(0);
    try {
      const rows = await parseFile(circularFiles[0]);
      toast.success(`Found ${rows.length} items`);

      const mapped = rows.map(mapCircularRow);

      if (mapped.length > 0) {
        const missing = validateCircularRow(mapped[0]);
        if (missing) {
          toast.error(`Missing field: ${missing}. Check example`);
          setCircularLoading(false);
          return;
        }
      }

      await commitBatch("circulars", mapped);
      toast.success(`${mapped.length} documents uploaded`);
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
      const text = await solutionFiles[0].text();
      const data = JSON.parse(text);

      if (!data || typeof data !== "object" || !data.examInfo) {
        toast.error("Invalid JSON format");
        setSolutionLoading(false);
        return;
      }

      const examInfo = data.examInfo as Record<string, any>;
      const finalDoc = {
        jobTitle: examInfo.examName || "",
        examTaker: examInfo.examTaker || "",
        examDate: examInfo.examDate || "",
        year: examInfo.examDate?.split(".").pop() || "",
        totalQuestions: examInfo.totalQuestions || data.questions?.length || 0,
        questions: data.questions || [],
        createdAt: serverTimestamp(),
      };

      if (!finalDoc.jobTitle || !finalDoc.questions.length) {
        toast.error("Invalid JSON format");
        setSolutionLoading(false);
        return;
      }

      await addDoc(collection(db, "job_solutions"), finalDoc);
      toast.success(`1 exam uploaded with ${finalDoc.totalQuestions} questions`);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem={activeItem}
        onNavigate={setActiveItem}
        role={role}
      />
      <div className="lg:ml-[260px]">
        <Topbar title="Admin Dashboard" onMenuClick={() => setSidebarOpen(true)} backHref="/" />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Bulk Job Upload</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">Upload multiple jobs via JSON</p>

              <input
                ref={circularInputRef}
                type="file"
                accept=".json"
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
                  : "Upload"}
              </button>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Recent Job Solution</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">Upload job solutions via JSON</p>

              <input
                ref={solutionInputRef}
                type="file"
                accept=".json"
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
                  : "Upload"}
              </button>
            </div>
          </div>

          {/* Recent Job Solutions */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Job Solutions</h2>
            {solutionsLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : recentSolutions.length === 0 ? (
              <p className="text-sm text-gray-500">No job solutions uploaded yet.</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {recentSolutions.map((doc) => {
                  const displayTitle = doc.jobTitle || doc.examInfo?.examName || "No Title";
                  const displayOrg = doc.examTaker || doc.examInfo?.examTaker || "Organization Not Listed";
                  const displayDate = doc.examDate || doc.examInfo?.examDate || "";
                  const displayTotal = doc.totalQuestions || doc.questions?.length || 0;

                  return (
                    <div key={doc.id} className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <BookOpen className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{displayTitle}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{displayOrg}</p>
                      <p className="text-xs text-gray-500">
                        মোট প্রশ্ন: {displayTotal} | তারিখ: {displayDate}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
