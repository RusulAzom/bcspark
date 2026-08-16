"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Home, Info, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Navbar />

      <main className="min-h-[70vh] flex items-center justify-center bg-white px-4 py-20">
        <div className="w-full max-w-xl text-center">

          {/* Icon Box */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-[#2563EB]" />
          </div>

          {/* Text */}
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-2">
            উফ! পাতাটা খুঁজে পাওয়া যায়নি
          </h2>
          <p className="text-[#64748B] mb-8 max-w-md mx-auto">
            {"আপনি যে লিংকটিতে ক্লিক করেছেন সেটি ভুল অথবা পাতাটি সরানো হয়েছে।"}
          </p>

          {/* Search - Fixed Icon Overlap */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="কি খুঁজছেন? BCS, Bank Job, NTRCA..."
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] text-[#1E293B] bg-white"
            />
          </div>

          {/* Buttons - Centered with gap */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              হোমে ফিরে যান
            </Link>
            <Link
              href="/about-us"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border border-[#2563EB] text-[#2563EB] font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Info className="w-4 h-4" />
              আমাদের সম্পর্কে
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}