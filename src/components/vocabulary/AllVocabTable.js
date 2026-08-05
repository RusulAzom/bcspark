'use client';

import { useState, useMemo } from 'react';

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

export default function AllVocabTable({ questions }) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const filtered = useMemo(() => {
    if (!search.trim()) return questions;
    const term = search.toLowerCase();
    return questions.filter(
      (item) =>
        item.q.toLowerCase().includes(term) ||
        item.options.some((o) => o.toLowerCase().includes(term)) ||
        item.explain.toLowerCase().includes(term)
    );
  }, [questions, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * perPage;
  const currentItems = filtered.slice(startIndex, startIndex + perPage);

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const extractFromExplain = (explain, keyword) => {
    const match = explain.match(new RegExp(`${keyword}\\s*\\(([^)]+)\\)`));
    if (match) return match[1];
    return '—';
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Search & Per-Page Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
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
            placeholder="Search by word, meaning, or explanation..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#1E53C5]/50 focus:ring-2 focus:ring-[#1E53C5]/10 transition-all duration-200 text-sm shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Per page:</span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-slate-200 rounded-lg text-slate-600 text-sm px-3 py-2 focus:outline-none focus:border-[#1E53C5]/50 focus:ring-2 focus:ring-[#1E53C5]/10 shadow-sm"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-600">
              <th className="px-4 py-3.5 text-left font-semibold text-xs uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3.5 text-left font-semibold text-xs uppercase tracking-wider">
                Word
              </th>
              <th className="px-4 py-3.5 text-left font-semibold text-xs uppercase tracking-wider">
                Bengali Meaning
              </th>
              <th className="px-4 py-3.5 text-left font-semibold text-xs uppercase tracking-wider hidden md:table-cell">
                Synonyms
              </th>
              <th className="px-4 py-3.5 text-left font-semibold text-xs uppercase tracking-wider hidden md:table-cell">
                Antonyms
              </th>
              <th className="px-4 py-3.5 text-center font-semibold text-xs uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentItems.map((item, idx) => {
              const word = item.q.split(' ')[0];
              const meaning = item.options[item.ans];
              const synonyms = extractFromExplain(item.explain, 'Synonyms?');
              const antonyms = extractFromExplain(item.explain, 'Antonyms?');

              return (
                <tr
                  key={item.id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} hover:bg-slate-100 transition-colors`}
                >
                  <td className="px-4 py-3.5 text-slate-400 font-mono text-xs">
                    {startIndex + idx + 1}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-[#0B1B4F]">
                      {word}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {meaning}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs hidden md:table-cell">
                    {synonyms}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs hidden md:table-cell">
                    {antonyms}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-[#1E53C5]/10 text-[#1E53C5] border border-[#1E53C5]/20 hover:bg-[#1E53C5]/20 transition-all font-medium"
                      title="Quick Test"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h9a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 5l2 2 4-4"
                        />
                      </svg>
                      Quick Test
                    </button>
                  </td>
                </tr>
              );
            })}
            {currentItems.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-slate-400"
                >
                  No vocabulary items found matching "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-400">
          Showing {startIndex + 1}–{Math.min(startIndex + perPage, filtered.length)} of{' '}
          {filtered.length} items
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(safePage - 1)}
            disabled={safePage <= 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              safePage > 1
                ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-[#1E53C5]/30 shadow-sm'
                : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
            }`}
          >
            ← Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (safePage <= 3) {
                pageNum = i + 1;
              } else if (safePage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = safePage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    safePage === pageNum
                      ? 'bg-gradient-to-r from-[#F35E1B] to-[#F9B816] text-white font-bold shadow-sm'
                      : 'bg-white text-slate-500 border border-slate-200 hover:border-[#1E53C5]/30 hover:text-[#1E53C5]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => handlePageChange(safePage + 1)}
            disabled={safePage >= totalPages}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              safePage < totalPages
                ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-[#1E53C5]/30 shadow-sm'
                : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}