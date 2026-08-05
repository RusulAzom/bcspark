'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import {
  getTimeLimit,
  getPassMark,
  calculateExamResults,
  formatTimer,
  formatDateTime,
} from '@/lib/examHelpers';
import { getLeaderboard, getParticipantCount } from '@/lib/participantCount';
import { getQuestionBankConfig } from '@/data/questionBankConfig';

export default function BCSExamEngine({
  questions,
  examInfo = {},
  timeLimit = 0,
  examType = 'BCS',
}) {
  const router = useRouter();
  const config = getQuestionBankConfig(examInfo.examType || examType);

  const passMark = useMemo(
    () => getPassMark(examInfo.totalQuestions || questions.length),
    [examInfo.totalQuestions, questions.length]
  );

  const [userName, setUserName] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [time, setTime] = useState(timeLimit);
  const [timeTaken, setTimeTaken] = useState(0);
  const [submittedByTime, setSubmittedByTime] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [showPreExamPopup, setShowPreExamPopup] = useState(true);
  const [started, setStarted] = useState(false);

  const resultRef = useRef(null);
  const reviewRef = useRef(null);

  const totalQuestions = questions.length;
  const finalScore = useMemo(
    () => correctCount - wrongCount * (config.negativePerWrong || 0.25),
    [correctCount, wrongCount, config.negativePerWrong]
  );

  const scorePercentage =
    totalQuestions > 0 ? (finalScore / totalQuestions) * 100 : 0;
  const passed = scorePercentage >= (config.passMarkPct || 0.7) * 100;
  const correctPct =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const wrongPct =
    totalQuestions > 0 ? Math.round((wrongCount / totalQuestions) * 100) : 0;

  const leaderboard = useMemo(() => {
    if (!submitted) return null;
    return getLeaderboard(finalScore, totalQuestions, examInfo.examType || examType);
  }, [submitted, finalScore, totalQuestions, examInfo.examType, examType]);

  const participantCount = useMemo(
    () => getParticipantCount(examInfo.examType || examType),
    [examInfo.examType, examType]
  );

  useEffect(() => {
    const savedSetup = sessionStorage.getItem('quickPracticeSetup');
    if (savedSetup) {
      try {
        const setup = JSON.parse(savedSetup);
        if (setup.name) setUserName(setup.name);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (!started || submitted) return;

    if (time <= 0) {
      setSubmitted(true);
      setSubmittedByTime(true);
      setShowResultPopup(true);
      return;
    }

    const timer = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [time, started, submitted]);

  useEffect(() => {
    if (submitted) {
      setTimeTaken(timeLimit - time);
      let correct = 0;
      let wrong = 0;

      Object.entries(answers).forEach(([questionIndex, selectedOption]) => {
        const question = questions[questionIndex];
        if (Number(selectedOption) === question.ans) {
          correct++;
        } else {
          wrong++;
        }
      });

      setCorrectCount(correct);
      setWrongCount(wrong);
      setSkippedCount(totalQuestions - Object.keys(answers).length);
    }
  }, [submitted, time, timeLimit, answers, questions, totalQuestions]);

  const handleSelect = (qIndex, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
  };

  const downloadJPEG = async () => {
    if (!resultRef.current) return;

    const canvas = await html2canvas(resultRef.current, {
      scale: 2,
      width: 1080,
      height: 1350,
      backgroundColor: '#ffffff',
      windowWidth: 1080,
      useCORS: true,
      onclone: (clonedDoc) => {
        clonedDoc.body.style.background = '#ffffff';
        clonedDoc.body.style.width = '1080px';

        const resultSheet = clonedDoc.getElementById('resultSheet');
        if (resultSheet) {
          resultSheet.style.width = '1080px';
          resultSheet.style.maxWidth = 'none';
        }

        const allElements = clonedDoc.querySelectorAll('*');
        allElements.forEach((el) => {
          const style = window.getComputedStyle(el);
          if (style.backgroundColor.includes('lab') || style.backgroundColor.includes('oklch')) {
            el.style.backgroundColor = '#ffffff';
          }
          if (style.color.includes('lab') || style.color.includes('oklch')) {
            el.style.color = '#000';
          }
          if (style.borderColor.includes('lab') || style.borderColor.includes('oklch')) {
            el.style.borderColor = '#d1d5db';
          }
        });
      },
    });

    const dataURL = canvas.toDataURL('image/jpeg', 0.92);
    const link = document.createElement('a');
    link.download = `BCSpark-${finalScore.toFixed(2)}-${totalQuestions}.jpg`;
    link.href = dataURL;
    link.click();
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResultPopup(true);
  };

  const handleStartExam = () => {
    if (!userName.trim()) return;

    sessionStorage.setItem(
      'quickPracticeSetup',
      JSON.stringify({
        name: userName,
        subject: examInfo.examName,
        topic: examInfo.examCategory,
        skipSetup: true,
      })
    );

    setShowPreExamPopup(false);
    setStarted(true);
  };

  const getResultMessage = (name, score, totalQuestions) => {
    const percentage = (score / totalQuestions) * 100;

    if (percentage >= 95)
      return [
        `🔥 ${name}! আগুন লাগায় দিলা!`,
        'অসাধারণ! তোমাকে দিয়ে হবে, থেমে থাকা যাবে না!',
        'এভাবেই চালিয়ে যাও! 🚀',
      ];

    if (percentage >= 80)
      return [
        `💪 ${name}! দারুণ করেছো!`,
        'আর একটু চর্চা করলে টপার!',
        'চালিয়ে যাও 📚 এগিয়ে যাও স্বপনের পথে',
      ];

    if (percentage >= 60)
      return [
        `😎 ${name}! বিশেষ বিবেচনায় পাশ!`,
        'আরেকটু মনোযোগ দিলে আরও ভালো হবে।',
        'হাল ছেড়ো না, মেধা আছে কিন্তু পড়ে না 💯',
      ];

    if (percentage >= 35)
      return [
        `🙂 ${name} ফেল্টুস!`,
        'ভালো করে পড়, নিয়মিত প্র্যাকটিস করো।',
        'লেগে থাকলে তুমি নিশ্চয়ই পারবে! 💪',
      ];

    return [
      `⚠️ সর্বনাশ, ${name} ফেল্টুস!`,
      'লেখাপড়া বাদ দিয়া বিয়ের প্ল্যান নাকি?',
      'এভাবে চললে কপালে দুঃখ আছে ...... ভালো করে পড় 💪',
    ];
  };

  const scrollToReview = () => {
    setShowResultPopup(false);
    setTimeout(() => {
      reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  if (!started) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div
              className="px-6 py-5 text-white text-center"
              style={{
                background: 'linear-gradient(135deg, #E95420 0%, #F9A825 100%)',
              }}
            >
              <h3 className="text-xl font-extrabold leading-snug">
                {examInfo.examName || 'Exam'}
              </h3>
              <p className="text-sm opacity-90 mt-1">
                {examInfo.examType || examType} • {examInfo.examCategory || 'General'}
              </p>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block font-semibold mb-2">পরীক্ষার্থীর নাম</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="আপনার নাম লিখুন"
                  className="w-full border-2 rounded-lg px-4 py-3"
                />
              </div>

              <div className="border-t pt-4">
                <p className="font-bold text-gray-700 mb-3">পরীক্ষার নিয়মাবলী:</p>
                <ul className="space-y-2 text-sm text-gray-800">
                  <li className="flex items-start gap-2">
                    <span>📋</span>
                    <span>পরীক্ষার নাম: <strong>{examInfo.examName || 'N/A'}</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>📅</span>
                    <span>তারিখ: <strong>{examInfo.examDate || 'N/A'}</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>❓</span>
                    <span>
                      মোট প্রশ্ন: <strong>{totalQuestions}টি</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>⏱️</span>
                    <span>
                      সময়:{' '}
                      <strong>
                        {examInfo.totalQuestions >= 200
                          ? '80 মিনিট'
                          : examInfo.totalQuestions >= 100
                            ? '40 মিনিট'
                            : '2 ঘণ্টা'}
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>🎯</span>
                    <span>
                      পাস মার্ক:{' '}
                      <strong>
                        {passMark} ({((config.passMarkPct || 0.7) * 100).toFixed(0)}%)
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>⚠️</span>
                    <span>
                      নেগেটিভ মার্কিং: প্রতিটি ২ ভুলের জন্য{' '}
                      <strong>{(config.negativePerWrong || 0.25) * 2} নম্বর</strong> কাটা যাবে!
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="px-6 pb-6 flex flex-col gap-3">
              <button
                onClick={handleStartExam}
                disabled={!userName.trim()}
                className={`w-full py-3 rounded-lg font-bold text-white transition ${
                  userName.trim()
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                🚀 পরীক্ষা শুরু করো
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6 pb-4">
          <div
            className={`fixed top-20 right-4 z-50 text-xl font-mono px-4 py-2 rounded-lg font-bold shadow-lg ${
              time <= 10 ? 'bg-red-200 text-red-900 animate-pulse' : 'bg-red-100 text-red-900'
            }`}
          >
            ⏱️ {formatTimer(time)}
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">
          {examInfo.examName || 'Question Bank Exam'}
        </h1>

        {!submitted && (
          <div className="grid md:grid-cols-2 gap-6">
            {questions.map((q, i) => {
              const correctOptionIndex = q.ans;
              const selectedOptionIndex = answers[i];

              return (
                <div
                  key={`${q.source?.[0] || 'src'}-${q.id}-${i}`}
                  className="bg-white p-4 rounded-xl shadow border"
                >
                  <p className="font-semibold text-2xl mb-2">
                    Q{i + 1}: {q.q}
                  </p>
                  <p className="mb-4 text-base italic opacity-30">{q.source?.[0] || ''}</p>

                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, idx) => {
                      const isSelected = selectedOptionIndex === idx;
                      const isCorrect = submitted && idx === correctOptionIndex;
                      const isWrong = submitted && isSelected && idx !== correctOptionIndex;

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelect(i, idx)}
                          disabled={submitted}
                          className={`p-3 rounded-full border-2 text-center transition-all font-medium disabled:cursor-not-allowed ${
                            isCorrect
                              ? 'bg-green-200 border-green-600 text-green-900'
                              : ''
                          } ${
                            isWrong ? 'bg-red-200 border-red-600 text-red-900' : ''
                          } ${
                            isSelected && !submitted
                              ? 'bg-blue-200 border-blue-600'
                              : 'bg-white border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="mt-8 w-full bg-blue-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-blue-700"
          >
            Submit করো
          </button>
        ) : (
          <div
            ref={resultRef}
            id="resultSheet"
            className="w-full max-w-[1080px] mx-auto mt-8 bg-white p-1 rounded-xl shadow relative overflow-hidden"
          >
            <img
              src="/logo/logo.png"
              alt="watermark"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-7 w-300 pointer-events-none select-none"
            />

            <div
              className="mt-6 p-2 mb-4 rounded-2xl text-white shadow-2xl relative z-10"
              style={{
                background: 'linear-gradient(135deg, #E95420 0%, #F9A825 60%, #e956208e 50%)',
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="text-left space-y-3">
                  <div className="space-y-2">
                    {getResultMessage(userName, finalScore, totalQuestions).map(
                      (line, index) => (
                        <p
                          key={index}
                          className={`font-bold ${index === 0 ? 'text-2xl' : 'text-lg opacity-90'}`}
                        >
                          {line}
                        </p>
                      )
                    )}
                  </div>

                  <h4 className="text-xl mt-2">
                    {submittedByTime ? '⏰ টাইম শেষ!' : `⏰সময় নিয়েছো: ${timeTaken} সেকেন্ড`}
                  </h4>
                  <p className="flex gap-6 text-xl">
                    <span>✅ সঠিক: {correctCount}</span>
                    <span>❌ ভুল: {wrongCount}</span>
                    <span>⏭️ স্কিপ: {skippedCount}</span>
                  </p>
                  <h3 className="text-2xl font-bold">
                    আমোলনামা: {finalScore.toFixed(2)} / {totalQuestions}
                  </h3>
                </div>

                <div className="text-center md:text-right border-l-0 md:border-l md:border-white/20 md:pl-6">
                  <h2 className="text-3xl font-extrabold mb-2 tracking-wide">
                    {examInfo.examName || 'EXAM'}
                  </h2>
                  <img
                    src="/logo/logo.png"
                    alt="BCSpark Logo"
                    className="w-30 h-30 mx-auto md:ml-auto md:mr-0 bg-none p-0 rounded-xl shadow-lg"
                  />
                  <p className="text-sm opacity-80 mb-4">Powered by BCSpark</p>
                  <p className="text-[10px] opacity-60 border-t border-white/20 pt-2 mt-2">
                    Subjects: {examInfo.examType || examType} / {examInfo.examCategory || 'General'}
                  </p>
                </div>
              </div>
            </div>

            <div ref={reviewRef} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 relative z-10">
              {questions.map((q, i) => (
                <div
                  key={`${q.source?.[0] || 'src'}-${q.id}-${i}`}
                  className="border rounded-lg p-2 bg-gray-30"
                >
                  <p className="font-semibold text-xs mb-1">
                    প্রশ্ন {i + 1}: {q.q}
                  </p>
                  <p className="text-[9px] italic opacity-20 mb-1">{q.source?.[0] || ''}</p>

                  {answers[i] === undefined ? (
                    <>
                      <p className="text-[11px] text-red-600 font-semibold">
                        ✗ Your Ans: Skipped
                      </p>
                      <p className="text-[11px] text-green-600 font-semibold">
                        ✓ Correct Ans: {q.options[q.ans]}
                      </p>
                    </>
                  ) : answers[i] === q.ans ? (
                    <p className="text-[11px] text-green-600 font-semibold">
                      ✓ Your Ans: {q.options[q.ans]}
                    </p>
                  ) : (
                    <>
                      <p className="text-[11px] text-red-600 font-semibold">
                        ✗ Your Ans: {q.options[answers[i]]}
                      </p>
                      <p className="text-[11px] text-green-600 font-semibold">
                        ✓ Correct Ans: {q.options[q.ans]}
                      </p>
                    </>
                  )}
                  <p className="text-[9px] text-gray-500 mt-0.5">explain: {q.explain}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4 relative z-10">
              <button
                onClick={downloadJPEG}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
              >
                📥 উত্তরপত্র ডাউনলোড করো
              </button>

              <button
                onClick={() => {
                  sessionStorage.setItem('quickPracticeRetry', 'true');
                  router.push('/question-bank');
                }}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
              >
                🔄 Question Bank
              </button>
            </div>

            <div className="mt-6 pt-4 border-t text-center relative z-10">
              <p className="text-xs text-gray-400">
                Generated by BCSpark.bd | Question Bank Tool
              </p>
            </div>
          </div>
        )}
      </div>

      {submitted && showResultPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <div className="w-full max-w-md my-8 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div
              className="px-6 py-5 text-white text-center"
              style={{
                background: passed
                  ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)'
                  : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              }}
            >
              <h3 className="text-xl font-extrabold leading-snug">
                {passed ? '🎉 অভিনন্দন! আপনি পাস করেছেন' : '⚡ অল্পের জন্য মিস! আবার চেষ্টা করুন'}
              </h3>
            </div>

            <div className="px-6 py-4 text-sm text-gray-800 space-y-1">
              <p>
                <span className="text-gray-500">Category:</span>{' '}
                <strong>
                  {examInfo.examType || examType} / {examInfo.examCategory || 'General'}
                </strong>
              </p>
              <p>
                <span className="text-gray-500">Date & Time:</span>{' '}
                <strong>{formatDateTime()}</strong>
              </p>

              <div className="my-2 border-t pt-2 space-y-1">
                <p>
                  <span className="text-gray-500">Your Score:</span>{' '}
                  <strong>
                    {finalScore.toFixed(2)} / {totalQuestions}
                  </strong>
                </p>
                <p>
                  <span className="text-gray-500">Correct Answers:</span>{' '}
                  <strong className="text-green-600">
                    {correctCount} ({correctPct}%)
                  </strong>
                </p>
                <p>
                  <span className="text-gray-500">Wrong Answers:</span>{' '}
                  <strong className="text-red-600">
                    {wrongCount} ({wrongPct}%)
                  </strong>
                </p>
                <p>
                  <span className="text-gray-500">Skipped Questions:</span>{' '}
                    <strong>{skippedCount}</strong>
                  </p>
                <p>
                  <span className="text-gray-500">Pass Mark:</span>{' '}
                    <strong>{passMark} (70%)</strong>
                  </p>
                <p>
                  <span className="text-gray-500">Time Expended:</span>{' '}
                    <strong>{formatTimer(timeTaken)}</strong>
                  </p>
              </div>

              {leaderboard && (
                <div className="my-2 border-t pt-2 space-y-1 bg-blue-50 p-3 rounded-lg">
                  <p className="font-bold text-blue-800">📊 Leaderboard Demo</p>
                  <p>
                    <span className="text-gray-500">Your Rank:</span>{' '}
                    <strong>
                      {leaderboard.rank} / {leaderboard.total}
                    </strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Percentile:</span>{' '}
                    <strong>{leaderboard.percentile.toFixed(1)}%</strong>
                  </p>
                  <p className="text-xs text-gray-500">
                    Based on {participantCount} simulated participants
                  </p>
                </div>
              )}
            </div>

            <div className="mx-6 mb-4 rounded-xl p-3 bg-orange-50 border border-orange-200 text-xs text-gray-700 leading-relaxed">
              <p className="font-semibold text-orange-700 mb-1">আপনি কি জানেন...?</p>
              <p>
                BCSpark-এর স্পেশাল কনটেস্টে অংশ নিলে গুরুত্বপূর্ণ MCQ পড়াশোনার পাশাপাশি প্রতিদিন থাকছে একাধিক পুরস্কার জেতার সম্ভাবনা!
                {' '}
                <a
                  href="https://bcspark.bd/contest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-semibold"
                >
                  Registration করুন
                </a>
                ।
              </p>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={scrollToReview}
                className="w-full py-3 rounded-lg font-bold text-white transition hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #E95420 0%, #F9A825 100%)',
                }}
              >
                Answer Review & Download 🔍
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
