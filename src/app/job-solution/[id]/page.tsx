export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Metadata } from "next";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  FileQuestion,
  Award,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase";

type JobSolution = {
  id: string;
  [key: string]: any;
};

function toPlainData(data: any): Record<string, any> {
  const result: Record<string, any> = {};
  if (!data) return result;
  for (const key of Object.keys(data)) {
    const value = data[key];
    if (value && typeof value === "object" && "toMillis" in value && typeof value.toMillis === "function") {
      result[key] = new Date(value.toMillis()).toISOString();
    } else {
      result[key] = value;
    }
  }
  return result;
}

function formatDate(value?: string | null): string {
  if (!value) return "N/A";
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
  return String(value);
}

async function fetchSolution(id: string) {
  if (!id || !db) return null;
  try {
    const docRef = doc(db, "job_solutions", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return toPlainData(docSnap.data()) as JobSolution;
  } catch (error) {
    console.error("Error fetching job solution from Firestore:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const data = await fetchSolution(id);
    if (!data) {
      return {
        title: "Job Solution Not Found | BCS Spark",
      };
    }

    const examInfo = data.examInfo ?? {};
    const title = data.title ?? examInfo.examName ?? data.exam_title ?? "Job Solution";
    const organization = data.organization ?? examInfo.examTaker ?? "";
    const postName = examInfo.postName ?? data.post_name ?? "";

    const seoTitle = `${title} - ${organization} Job Solution 2026 | BCS Spark`;
    const description =
      `Recent job solution for ${title}${postName ? ` (${postName})` : ""} at ${organization || "various organizations"}. ` +
      `Practice questions with answers at BCS Spark.`;

    return {
      title: seoTitle,
      description,
      openGraph: {
        title: seoTitle,
        description,
        type: "website",
      },
    };
  } catch (error) {
    console.error("Error generating metadata for job solution:", error);
    return {
      title: "Job Solution | BCS Spark",
    };
  }
}

export default async function JobSolutionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await fetchSolution(id);

    if (!data) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
          <h1 className="text-2xl font-bold text-slate-900">Job Solution not found</h1>
          <p className="mt-2 text-slate-600">
            The job solution you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/job-solution"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Job Solutions
          </Link>
        </div>
      );
    }

    const examInfo = data.examInfo ?? {};
    const title = data.title ?? examInfo.examName ?? data.exam_title ?? "Job Solution";
    const organization = data.organization ?? examInfo.examTaker ?? "Organization Not Listed";
    const postName = examInfo.postName ?? data.post_name ?? "";
    const examDate = examInfo.examDate ?? data.exam_date ?? null;
    const totalQuestions = examInfo.totalQuestions ?? data.total_questions ?? "";
    const durationMinutes = examInfo.durationMinutes ?? data.time_allowed ?? "";
    const fullMarks = examInfo.totalMarks ?? data.full_marks ?? "";
    const questions = Array.isArray(data.questions) ? data.questions : [];

    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Back Link */}
            <Link
              href="/job-solution"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Job Solutions
            </Link>

            {/* Card 1: Header */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {title}
              </h1>
              <div className="mt-2 flex items-center text-base font-medium text-slate-700">
                <Building2 className="mr-2 h-4 w-4 text-blue-600" />
                {organization}
              </div>
              {postName && (
                <p className="mt-2 text-base text-slate-600">
                  পদ: {postName}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {examDate && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                    <Calendar className="h-4 w-4" />
                    Exam Date: {formatDate(String(examDate))}
                  </span>
                )}
                {totalQuestions && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    <FileQuestion className="h-4 w-4" />
                    প্রশ্ন: {totalQuestions}
                  </span>
                )}
                {durationMinutes && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                    <Clock className="h-4 w-4" />
                    সময়: {durationMinutes}
                  </span>
                )}
                {fullMarks && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                    <Award className="h-4 w-4" />
                    পূর্ণমান: {fullMarks}
                  </span>
                )}
              </div>
            </div>

            {/* Card 2: Questions & Solutions */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-slate-900">
                প্রশ্ন ও সমাধান ({questions.length})
              </h2>

              {questions.length === 0 ? (
                <p className="text-slate-600">No questions available for this solution.</p>
              ) : (
                <div className="space-y-6">
                  {questions.map((q, index) => {
                    const qData = q ?? {};
                    const questionText = qData.question ?? qData.q ?? "";
                    const options = Array.isArray(qData.options) ? qData.options : [];
                    const answerRaw = qData.answer ?? qData.ans;
                    const explain = qData.explain ?? "";
                    const subject = qData.subject ?? "";

                    let correctOptionIndex: number | null = null;
                    if (typeof answerRaw === "number") {
                      correctOptionIndex = answerRaw;
                    } else if (typeof answerRaw === "string") {
                      // Match "ক", "খ", "গ", "ঘ" or "1", "2", "3", "4" or option text
                      const banglaMap: Record<string, number> = { "ক": 0, "খ": 1, "গ": 2, "ঘ": 3, "ঙ": 4 };
                      if (answerRaw in banglaMap) {
                        correctOptionIndex = banglaMap[answerRaw];
                      } else {
                        const numeric = parseInt(answerRaw, 10);
                        if (!isNaN(numeric) && numeric >= 1 && numeric <= options.length) {
                          correctOptionIndex = numeric - 1;
                        } else {
                          const idx = options.findIndex(
                            (opt: string) => String(opt).trim() === String(answerRaw).trim()
                          );
                          if (idx !== -1) correctOptionIndex = idx;
                        }
                      }
                    }

                    return (
                      <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        {/* Question */}
                        <div className="flex items-start gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            {subject && (
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
                                {subject}
                              </p>
                            )}
                            <p className="text-base font-medium text-slate-900">
                              {questionText}
                            </p>
                          </div>
                        </div>

                        {/* Options */}
                        {options.length > 0 && (
                          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {options.map((option: string, optIndex: number) => {
                              const isCorrect = correctOptionIndex === optIndex;
                              return (
                                <div
                                  key={optIndex}
                                  className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                                    isCorrect
                                      ? "border-green-300 bg-green-50 text-green-900 font-medium"
                                      : "border-slate-200 bg-white text-slate-700"
                                  }`}
                                >
                                  {isCorrect ? (
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                                  ) : (
                                    <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300" />
                                  )}
                                  <span>{option}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Answer badge */}
                        {correctOptionIndex !== null && options[correctOptionIndex] !== undefined && (
                          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                            <CheckCircle2 className="h-4 w-4" />
                            সঠিক উত্তর: {options[correctOptionIndex]}
                          </div>
                        )}

                        {/* Explanation */}
                        {explain && (
                          <div className="mt-3 rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700">
                            <span className="font-semibold text-slate-900">ব্যাখ্যা: </span>
                            {explain}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  } catch (error) {
    console.error("Error rendering job solution details:", error);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
        <p className="mt-2 text-slate-600">
          Unable to load job solution details. Please try again later.
        </p>
        <Link
          href="/job-solution"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Job Solutions
        </Link>
      </div>
    );
  }
}