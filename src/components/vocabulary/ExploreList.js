'use client';

import { useState } from 'react';

export default function ExploreList({ questions }) {
  const [search, setSearch] = useState('');

  const filtered = questions.filter((item) => {
    const q = item.q.toLowerCase();
    const opts = item.options.join(' ').toLowerCase();
    const term = search.toLowerCase();
    return q.includes(term) || opts.includes(term);
  });

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search vocabulary words..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#0F1629]/80 border border-[#1E3A5F]/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#1E53C5]/50 focus:ring-2 focus:ring-[#1E53C5]/20 transition-all duration-300"
        />
      </div>

      {/* Vocabulary List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const englishWord = item.q.split(' ')[0];
          return (
            <div
              key={item.id}
              className="group bg-[#0F1629]/60 border border-[#1E3A5F]/50 rounded-xl p-5 hover:border-[#1E53C5]/30 hover:bg-[#0F1629]/80 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium text-[#1E53C5] bg-[#1E53C5]/10 px-2.5 py-0.5 rounded-full">
                      #{item.id}
                    </span>
                    <h3 className="text-lg font-semibold text-white">
                      {englishWord}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-2">
                    {item.q}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-[#0B1B4F]/80 text-[#F9B816] px-2.5 py-1 rounded-lg">
                      ✓ {item.options[item.ans]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {item.explain}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center text-slate-500 py-8">
            No vocabulary items found matching "{search}"
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="text-center text-xs text-slate-600">
        Showing {filtered.length} of {questions.length} vocabulary items
      </div>
    </div>
  );
}