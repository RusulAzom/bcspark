'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BCSExamEngine from '@/components/BCSExamEngine';
import { getQuestionBankConfig } from '@/data/questionBankConfig';
import { getTimeLimit, getRandomItems } from '@/lib/examHelpers';

export default function BCSExamPage() {
  const params = useParams();
  const type = params?.type;
  const exam = params?.exam;
  const [questions, setQuestions] = useState([]);
  const [examInfo, setExamInfo] = useState(null);
  const [timeLimit, setTimeLimit] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!type || !exam) return;

    fetch(`/api/question-bank/exam?type=${encodeURIComponent(type)}&exam=${encodeURIComponent(exam)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setLoading(false);
          return;
        }

        const info = data.examInfo || {};
        const config = getQuestionBankConfig(info.examType || type);
        const calculatedTimeLimit = getTimeLimit(
          info.totalQuestions || 100,
          info.timeLimitMinutes
        );
        const questionLimit = config.questionLimit || 20;
        const shuffled = getRandomItems(data.questions || [], questionLimit);

        setExamInfo(info);
        setQuestions(shuffled);
        setTimeLimit(calculatedTimeLimit);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load exam:', err);
        setLoading(false);
      });
  }, [type, exam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-bold animate-pulse">Loading exam...</div>
      </div>
    );
  }

  if (!examInfo || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-bold">Exam not found or no questions available.</div>
      </div>
    );
  }

  return (
    <BCSExamEngine
      questions={questions}
      examInfo={examInfo}
      timeLimit={timeLimit}
      examType={type}
    />
  );
}
