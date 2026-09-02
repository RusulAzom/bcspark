// src/app/blog/[slug]/error.tsx
// Segment-level error boundary: any unexpected rendering error on an article
// shows this friendly UI instead of the raw "This page couldn't load" 500.
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Blog article rendering error:", error);
  }, [error]);

  return (
    <>
      <Navbar />
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 px-4 font-sans">
        <h1 className="text-2xl font-bold text-gray-900">কিছু একটা সমস্যা হয়েছে</h1>
        <p className="mt-2 text-gray-600 text-center">
          ব্লগটি লোড করতে সমস্যা হচ্ছে। কয়েক সেকেন্ড পর আবার চেষ্টা করুন।
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow"
          >
            <RefreshCw className="h-4 w-4" />
            আবার চেষ্টা করুন
          </button>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 transition-colors hover:bg-gray-100 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            সব ব্লগে ফিরে যান
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
