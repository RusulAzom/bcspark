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

  const examTypes = ['All', ...new Set(exams.map((e) => e.examType))];

  const filteredExams = exams.filter((exam) => {
    const matchesType = selectedType === 'All' || exam.examType === selectedType;
    const matchesSearch =
      !searchQuery ||
      exam.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.examCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

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
            <h1 className="text-3xl font-bold mb-2">BCS Question Bank | বিসিএস প্রশ্ন ব্যাংক</h1>
            <p className="text-gray-600">Select an exam to start practicing</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 rounded-lg px-4 py-3"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {examTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border-2 border-gray-300 hover:border-blue-400'
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
              {filteredExams.map((exam) => (
                <div
                  key={exam.slug}
                  className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {exam.examType}
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
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-bold hover:bg-blue-700"
                  >
                    Start Exam
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
