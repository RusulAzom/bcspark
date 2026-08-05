'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function QuestionBankList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(9);
  const loadMoreCount = 9;

  const EXAM_TYPE_MAP = {
    'All': 'All',
    'BCS': 'BCS10to',
    'NTRCA': 'NTRCA',
    'সমাজসেবা': 'সমাজসেবা',
    'ব্যাংক': 'ব্যাংক',
    '১২ থেকে ২০ গ্রেড': '১২-২০-গ্রেড',
    'বিশ্ববিদ্যালয়': 'বিশ্ববিদ্যালয়',
    'মেডিকেল': 'মেডিকেল',
    'HSC': 'HSC',
    'SSC': 'SSC',
  };

  const EXAM_TYPES = Object.keys(EXAM_TYPE_MAP);

  const getDisplayType = (type) => {
    const entry = Object.entries(EXAM_TYPE_MAP).find(([, v]) => v === type);
    return entry ? entry[0] : type;
  };

  useEffect(() => {
    fetch('/api/question-bank/list')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExams(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredExams = exams.filter((exam) => {
    const actualType = EXAM_TYPE_MAP[selectedType] || selectedType;
    const matchesType = selectedType === 'All' || exam.examType === actualType;
    const matchesSearch =
      !searchQuery ||
      exam.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.examCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const visibleExams = filteredExams.slice(0, visibleCount);
  const hasMore = visibleCount < filteredExams.length;

  useEffect(() => {
    setVisibleCount(9);
  }, [selectedType, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-bold animate-pulse">Loading question bank...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-[#1a365d]">BCS Question Bank | বিসিএস সহ অন্যান্য পরীক্ষার প্রশ্নব্যাংক</h1>
            <p className="text-gray-600">এখানে নিয়মিত BCS সহ অন্যান্য পরীক্ষার নতুন পুরাতন প্রশ্ন আপডেট করা হয়।</p>
          </div>

          <div className="mb-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="পরীক্ষার নাম লিখুন ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 rounded-lg pl-12 pr-4 py-3"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {EXAM_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedType === type
                      ? 'bg-[#1a365d] text-white'
                      : 'bg-white border-2 border-gray-300 hover:border-[#1a365d] hover:text-[#1a365d]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {filteredExams.length === 0 ? (
            <div className="text-center text-gray-500 py-10">No exams found.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleExams.map((exam) => (
                <div
                  key={exam.slug}
                  className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold bg-[#1a365d]/10 text-[#1a365d] px-2 py-1 rounded">
                      {getDisplayType(exam.examType)}
                    </span>
                    <span className="text-xs text-gray-500">{exam.examCategory}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2">{exam.examName}</h2>
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p>Date: {exam.examDate || 'N/A'}</p>
                    <p>Questions: {exam.totalQuestions}</p>
                    <p>Marks: {exam.totalMarks}</p>
                  </div>
                  <Link
                    href={`/question-bank/${exam.slug}`}
                    className="block w-full bg-[#f97316] text-white text-center py-3 rounded-lg font-bold hover:bg-[#ea580c] transition"
                    style={{
                      boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)'
                    }}
                  >
                    Start Exam
                  </Link>
                </div>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount((c) => c + loadMoreCount)}
                className="px-6 py-3 rounded-lg font-semibold bg-[#1a365d] text-white hover:bg-[#15294d] transition"
                style={{
                  boxShadow: '0 4px 14px rgba(26, 54, 93, 0.3)'
                }}
              >
                আরও দেখুন
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
