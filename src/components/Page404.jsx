"use client";

import { useState } from "react";

export default function Page404() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
      {/* Illustration: Empty notebook with 404 */}
      <div className="mb-8">
        <div className="w-64 h-64 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <span className="text-5xl font-extrabold">404</span>
        </div>
        <div className="w-40 h-28 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
          <span className="text-xl">📓</span>
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-white mb-4">
        এই পাতাটা এখনো লেখা হয়নি
      </h1>

      {/* Subheading */}
      <p className="text-lg text-slate-400 mb-8 max-w-md text-center">
        কিন্তু আপনি যা খুঁজছেন সেটা এখানে পেতে পারেন
      </p>

      {/* Search input + buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="খুঁজুন..."
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'16\\' height=\\'16\\' viewBox=\\'0 0 24 24\\' fill=\\'currentColor\\'%3E%3Cpath d=\\'M15.5 14h-.79l-.28-.27-.78-.78l-.96.96l.95.95L19 8l-1.3-1.3L5.47 15.47 4.85 16.8l1.5 1.5 1.35-1.35z\\'/%3E%3C/svg%3E')" }
            className="pl-12"
            aria-label="Search"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            aria-label="Search"
          >
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path className="stroke-2" d="M21 21l-2.77-2.77m-6.95 6.95l-2.77-2.77m5.66-5.66l-2.77-2.77m-6.95 6.95l-2.77-2.77m5.66-5.66l-2.77-2.77m-6.95 6.95l-2.77-2.77m5.66-5.66l-2.77-2.77m-6.95 6.95l-2.77-2.77m5.66-5.66l-2.77-2.77m-6.95 6.95l-2.77-2.77m5.66-5.66l-2.77-2.77m-6.95 6.95l-2.77-2.77" />
            </svg>
          </button>
        </div>

        <div className="w-full sm:w-auto">
          <button
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
          >
            🏠 হোম
          </button>
          <button
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 text-slate-300 font-medium hover:bg-white/20 transition-colors mt-3 sm:mt-0"
          >
            ℹ️ আমাদের সম্পর্কে
          </button>
        </div>
      </div>

      {/* Popular links pills */}
      <div className="mt-8 flex flex-col sm:flex-row gap-2">
        <Link href="/bcs" className="flex items-center gap-2 rounded-full bg-indigo-600/10 px-4 py-2.5 text-indigo-400 text-sm font-medium transition-colors hover:bg-indigo-600/15">
          <span>BCS</span>
        </Link>
        <Link href="/bank-job" className="flex items-center gap-2 rounded-full bg-indigo-600/10 px-4 py-2.5 text-indigo-400 text-sm font-medium transition-colors hover:bg-indigo-600/15">
          <span>Bank Job</span>
        </Link>
        <Link href="/ntrca" className="flex items-center gap-2 rounded-full bg-indigo-600/10 px-4 py-2.5 text-indigo-400 text-sm font-medium transition-colors hover:bg-indigo-600/15">
          <span>NTRCA</span>
        </Link>
      </div>
    </div>
  );
}