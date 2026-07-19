'use client';
import React, { useState } from 'react';

// ─── Mini Vocabulary Quiz Data ───
const vocabQuestions = [
  { word: 'ABHOR', meaning: 'To detest/hate', options: ['To Love', 'To detest/hate', 'To Ignore', 'To Praise'] },
  { word: 'BENEVOLENT', meaning: 'Kind/Generous', options: ['Cruel', 'Kind/Generous', 'Weak', 'Angry'] },
  { word: 'ELOQUENT', meaning: 'Fluent/Persuasive', options: ['Fluent/Persuasive', 'Silent', 'Confused', 'Rude'] },
  { word: 'RESILIENT', meaning: 'Able to recover quickly', options: ['Fragile', 'Able to recover quickly', 'Stubborn', 'Lazy'] },
];

// ─── Mini AtoZ Game Data ───
const gameLetters = [
  { letter: 'A', q: 'বাংলাদেশের জাতীয় সংসদের নাম কী?', a: 'জাতীয় সংসদ' },
  { letter: 'B', q: 'বাংলাদেশের জাতীয় পশু কী?', a: 'রয়েল বেঙ্গল টাইগার' },
  { letter: 'C', q: 'বাংলাদেশের জাতীয় ফল কী?', a: 'কাঁঠাল' },
  { letter: 'D', q: 'বাংলাদেশের জাতীয় খেলা কী?', a: 'কাবাডি' },
];

// ─── Weekly Schedule Data ───
const schedule = [
  { day: 'শনিবার', dayEn: 'Saturday', subject: 'সাধারণ জ্ঞান (GK)', topic: 'বাংলাদেশের ভৌগোলিক অবস্থান ও সীমানা বিরোধ', time: 'রাত ০৯:০০ টা', highlight: true },
  { day: 'সোমবার', dayEn: 'Monday', subject: 'বাংলা (Bangla)', topic: 'চর্যাপদ ও মধ্যযুগ সাহিত্য প্রকরণ', time: 'রাত ০৯:০০ টা', highlight: false },
  { day: 'বুধবার', dayEn: 'Wednesday', subject: 'English', topic: 'Parts of Speech & Idioms Masterclass', time: 'রাত ০৯:০০ টা', highlight: false },
  { day: 'শুক্রবার', dayEn: 'Friday', subject: 'Mega Weekly Mock', topic: 'সাপ্তাহিক ৩ লেকচারের ওপর কম্বাইন্ড ১০০ নম্বরের টেস্ট', time: 'সন্ধ্যা ০৭:৩০ টা', highlight: true },
];

// ─── Story Data ───
const stories = [
  {
    title: 'The Eloquent Speaker',
    excerpt: 'In a bustling town, there lived a man named Arif who was known for his eloquent speech. His words flowed like a gentle river, captivating everyone who listened...',
    words: ['Eloquent', 'Captivate', 'Profound'],
  },
  {
    title: 'The Resilient Farmer',
    excerpt: 'Despite the devastating floods that destroyed his crops, Rahman remained resilient. Each morning, he would wake up before dawn, determined to rebuild...',
    words: ['Resilient', 'Perseverance', 'Tenacious'],
  },
  {
    title: 'The Benevolent Merchant',
    excerpt: 'Hasan was a wealthy merchant, but unlike others, he was profoundly benevolent. He believed that true wealth lay not in gold, but in the hearts he touched...',
    words: ['Benevolent', 'Profound', 'Abundant'],
  },
];

export default function A2ZDemoPage() {
  // ─── States ───
  const [vocabIndex, setVocabIndex] = useState(0);
  const [vocabScore, setVocabScore] = useState(null);
  const [vocabCorrectCount, setVocabCorrectCount] = useState(0);
  const [vocabWrongCount, setVocabWrongCount] = useState(0);
  const [vocabAnswered, setVocabAnswered] = useState(false);
  const [vocabDone, setVocabDone] = useState(false);

  const [gameIndex, setGameIndex] = useState(0);
  const [gameRevealed, setGameRevealed] = useState(false);
  const [gameDone, setGameDone] = useState(false);

  const [storyIndex, setStoryIndex] = useState(0);

  // ─── Vocab Handlers ───
  const handleVocabAnswer = (selected) => {
    if (vocabAnswered) return;
    const correct = vocabQuestions[vocabIndex].meaning;
    if (selected === correct) {
      setVocabScore('correct');
      setVocabCorrectCount((p) => p + 1);
    } else {
      setVocabScore('wrong');
      setVocabWrongCount((p) => p + 1);
    }
    setVocabAnswered(true);
  };

  const nextVocab = () => {
    if (vocabIndex < vocabQuestions.length - 1) {
      setVocabIndex((p) => p + 1);
      setVocabScore(null);
      setVocabAnswered(false);
    } else {
      setVocabDone(true);
    }
  };

  const resetVocab = () => {
    setVocabIndex(0);
    setVocabScore(null);
    setVocabCorrectCount(0);
    setVocabWrongCount(0);
    setVocabAnswered(false);
    setVocabDone(false);
  };

  // ─── Game Handlers ───
  const revealAnswer = () => setGameRevealed(true);

  const nextGame = () => {
    if (gameIndex < gameLetters.length - 1) {
      setGameIndex((p) => p + 1);
      setGameRevealed(false);
    } else {
      setGameDone(true);
    }
  };

  const resetGame = () => {
    setGameIndex(0);
    setGameRevealed(false);
    setGameDone(false);
  };

  // ─── Current Vocab ───
  const currentVocab = vocabQuestions[vocabIndex];
  const totalNegative = (vocabWrongCount * 0.5).toFixed(1);
  const netScore = vocabCorrectCount - vocabWrongCount * 0.5;

  // ─── Current Game ───
  const currentGame = gameLetters[gameIndex];

  // ─── Current Story ───
  const currentStory = stories[storyIndex];

  return (
    <div className="min-h-screen bg-[#FDF8E7] font-sans selection:bg-[#FDED3E] selection:text-[#1E3A8A]">
      {/* ════════════════════════════════════════════════════ */}
      {/* MOBILE SPLIT SCREEN: 50vh Hero + 50vh GK Card       */}
      {/* Desktop: Normal expanded header                     */}
      {/* ════════════════════════════════════════════════════ */}
      <div className="md:hidden flex flex-col h-screen overflow-hidden">
        {/* ── Top 50vh: Compressed Hero Branding ── */}
        <div className="h-[50vh] bg-gradient-to-br from-[#FDED3E] via-[#FDD835] to-[#FBC02D] flex flex-col justify-center px-4 overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E53935] via-[#FDED3E] to-[#E53935]" />

          <div className="text-center space-y-1.5 max-w-sm mx-auto w-full">
            {/* Badge */}
            <span className="inline-flex items-center gap-1 bg-[#1E3A8A] text-white text-[8px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm mb-2">
              <span className="w-1 h-1 bg-[#FDED3E] rounded-full animate-pulse" />
              Demo Portal
            </span>

            {/* Title */}
            <h1 className="text-xl font-black tracking-tight text-[#1E3A8A] leading-tight">
              BCS <span className="text-[#E53935]">A to Z</span>
            </h1>

            {/* Director */}
            <p className="text-xs font-bold text-[#1E3A8A]/70">
              পরিচালক:{' '}
              <span className="text-[#E53935] bg-white/50 px-1.5 py-0.5 rounded inline-block">
                পলাশ সাধু স্যার
              </span>
            </p>
            <p className="text-[9px] text-[#1E3A8A]/50">(Palash Sadhu Sir)</p>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 my-1.5">
              <div className="h-px w-8 bg-[#E53935]/30 rounded-full" />
              <div className="w-1.5 h-1.5 bg-[#E53935] rotate-45" />
              <div className="h-px w-8 bg-[#E53935]/30 rounded-full" />
            </div>

            {/* Promo Text */}
            <p className="text-[10px] text-[#1E3A8A]/60 leading-snug line-clamp-3 font-medium">
              বিসিএস প্রিলিমিনারি ও শিক্ষক নিবন্ধন পরীক্ষার শতভাগ সফল প্রস্তুতির জন্য একটি নির্ভরযোগ্য প্ল্যাটফর্ম। আধুনিক অনলাইন কুইজ এবং ট্র্যাকিং সিস্টেমের মাধ্যমে মেধা যাচাই করুন।
            </p>

            {/* Mini CTA */}
            {/* <a
              href="http://localhost:3000/t20/gk/a2z"
              className="inline-flex items-center gap-1 bg-[#E53935] hover:bg-[#C62828] text-white text-[10px] font-bold px-4 py-1.5 rounded-lg shadow-sm shadow-[#E53935]/30 mt-1.5 transition-all duration-200"
            >
              🚀 Play Now
            </a> */}
          </div>
        </div>

        {/* ── Bottom 50vh: GK Quiz Card ── */}
        <div className="h-[50vh] bg-[#FDF8E7] flex items-center px-4">
          <div className="group relative bg-white rounded-xl shadow-lg shadow-[#E53935]/5 border-2 border-[#E53935] flex flex-col w-full max-w-sm mx-auto p-4">
            {/* Active Badge */}
            <div className="absolute -top-2.5 right-3 z-10">
              <span className="bg-[#E53935] text-white text-[8px] uppercase font-bold px-2 py-0.5 rounded-full shadow-lg shadow-[#E53935]/30 inline-flex items-center gap-1">
                <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                Active
              </span>
            </div>

            {/* Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E53935] via-[#FDED3E] to-[#E53935] rounded-t-xl" />

            <div className="relative z-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E53935]/5 border border-[#E53935]/10 flex items-center justify-center text-base flex-shrink-0">
                  📚
                </div>
                <h3 className="text-sm font-black text-[#1E3A8A]">GK Lecture 1 Quiz</h3>
              </div>
              <div className="bg-[#FDF8E7] rounded-lg p-2.5 border border-[#FDED3E]/50 mt-2.5 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#1E3A8A]/60">📝 Questions</span>
                  <span className="font-bold text-[#1E3A8A]">20</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#1E3A8A]/60">⏱️ Time</span>
                  <span className="font-bold text-[#1E3A8A]">10 Min</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#1E3A8A]/60">💯 Marks</span>
                  <span className="font-bold text-[#1E3A8A]">20</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#1E3A8A]/60">❌ Negative</span>
                  <span className="font-bold text-[#E53935]">0.5 per wrong</span>
                </div>
              </div>
            </div>

            <div className="mt-2.5">
              <a
                href="http://localhost:3000/t20/gk/a2z"
                className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#E53935] to-[#C62828] text-white font-bold py-2.5 rounded-lg text-xs hover:from-[#C62828] hover:to-[#B71C1C] transition-all duration-200 shadow-md shadow-[#E53935]/20"
              >
                Start Exam 🚀
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* DESKTOP HERO HEADER (md+)                   */}
      {/* ════════════════════════════════════════════ */}
      <header className="hidden md:block sticky top-0 z-50 bg-gradient-to-r from-[#FDED3E] via-[#FDD835] to-[#FBC02D] shadow-md border-b-2 border-[#E53935]/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1E3A8A] flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-sm">
                A2Z
              </div>
              <div>
                <h1 className="text-xl font-black text-[#1E3A8A] leading-tight">
                  BCS <span className="text-[#E53935]">A to Z</span>
                </h1>
                <p className="text-xs text-[#1E3A8A]/60 leading-tight">
                  পরিচালক: পলাশ সাধু স্যার
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 bg-[#1E3A8A] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                <span className="w-1.5 h-1.5 bg-[#FDED3E] rounded-full animate-pulse" />
                Demo Portal
              </span>
              <a
                href="http://localhost:3000/t20/gk/a2z"
                className="inline-flex items-center gap-1.5 bg-[#E53935] hover:bg-[#C62828] text-white text-xs font-bold px-5 py-2 rounded-lg shadow-sm shadow-[#E53935]/30 hover:shadow-md transition-all duration-200"
              >
                🚀 Start Demo
              </a>
            </div>
          </div>

          <div className="pb-6 pt-1">
            <div className="flex items-center justify-center gap-3 my-3">
              <div className="h-0.5 w-16 bg-[#E53935]/30 rounded-full" />
              <div className="w-2 h-2 bg-[#E53935] rotate-45" />
              <div className="h-0.5 w-16 bg-[#E53935]/30 rounded-full" />
            </div>
            <p className="text-center text-sm text-[#1E3A8A]/70 max-w-3xl mx-auto leading-relaxed font-medium">
              বিসিএস প্রিলিমিনারি ও শিক্ষক নিবন্ধন পরীক্ষার শতভাগ সফল প্রস্তুতির জন্য একটি নির্ভরযোগ্য প্ল্যাটফর্ম।
              আমাদের আধুনিক অনলাইন কুইজ এবং ট্র্যাকিং সিস্টেমের মাধ্যমে আপনার মেধা যাচাই করুন
              এবং হাজারো পরীক্ষার্থীর মাঝে নিজের অবস্থান সুদৃঢ় করুন।
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <a
                href="http://localhost:3000/t20/gk/a2z"
                className="inline-flex items-center gap-2 bg-[#E53935] hover:bg-[#C62828] text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-[#E53935]/30 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 text-sm"
              >
                🚀 Start Free Demo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <button className="inline-flex items-center gap-2 bg-white/80 hover:bg-white text-[#1E3A8A] font-bold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-[#1E3A8A]/10 text-sm">
                📞 Contact Us
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════ */}
      {/* SCROLLABLE CONTENT (Below the fold on mobile) */}
      {/* ════════════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-10 space-y-10 md:space-y-16">

        {/* ─── QUIZ CARDS SECTION (Desktop: all 4 cards) ─── */}
        <section>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-3 md:mb-6">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 bg-[#1E3A8A]/5 border border-[#1E3A8A]/10 rounded-full px-2.5 py-0.5 md:px-4 md:py-1 mb-1">
                <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#E53935] rounded-full" />
                <span className="text-[9px] md:text-xs font-semibold text-[#1E3A8A] uppercase tracking-wider">Live Quiz Portal</span>
              </div>
              <h2 className="text-sm md:text-2xl lg:text-3xl font-black text-[#1E3A8A] leading-tight">অনলাইন লাইভ কুইজ পোর্টাল</h2>
              <p className="text-[10px] md:text-sm text-[#1E3A8A]/50 mt-0.5 hidden sm:block">ক্লিক করে আপনার কাঙ্ক্ষিত মক টেস্টে অংশ নিন</p>
            </div>
            <span className="inline-flex items-center gap-1 bg-[#E53935]/5 border border-[#E53935]/15 text-[#E53935] text-[9px] md:text-xs font-bold px-2 md:px-4 py-1 md:py-2 rounded-lg flex-shrink-0">
              <span className="w-1.5 h-1.5 bg-[#E53935] rounded-full" />
              <span className="hidden xs:inline">Total</span> 4
            </span>
          </div>

          {/* Cards Grid — mobile: locked cards only (GK was in split-screen), desktop: all 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {/* ── GK CARD — hidden on mobile (shown in split screen), visible on sm+ ── */}
            <div className="hidden sm:group sm:flex relative bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md md:shadow-lg shadow-[#E53935]/5 border-2 border-[#E53935] hover:shadow-xl hover:shadow-[#E53935]/10 hover:-translate-y-1 transition-all duration-300 flex-col">
              <div className="absolute -top-2.5 md:-top-3 right-3 md:right-4 z-10">
                <span className="bg-[#E53935] text-white text-[8px] md:text-[10px] uppercase font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-lg shadow-[#E53935]/30 inline-flex items-center gap-1">
                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full animate-pulse" />
                  Active
                </span>
              </div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E53935] via-[#FDED3E] to-[#E53935] rounded-t-xl md:rounded-t-2xl" />
              <div className="relative z-0">
                <div className="flex items-center gap-2 md:block">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-[#E53935]/5 border border-[#E53935]/10 flex items-center justify-center text-base md:text-2xl flex-shrink-0">
                    📚
                  </div>
                  <h3 className="text-sm md:text-lg font-black text-[#1E3A8A] md:mt-3">GK Lecture 1 Quiz</h3>
                </div>
                <div className="bg-[#FDF8E7] rounded-lg md:rounded-xl p-2.5 md:p-3.5 border border-[#FDED3E]/50 mt-3 space-y-1 md:space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] md:text-xs">
                    <span className="text-[#1E3A8A]/60">📝 Questions</span>
                    <span className="font-bold text-[#1E3A8A]">20</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] md:text-xs">
                    <span className="text-[#1E3A8A]/60">⏱️ Time</span>
                    <span className="font-bold text-[#1E3A8A]">10 Min</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] md:text-xs">
                    <span className="text-[#1E3A8A]/60">💯 Marks</span>
                    <span className="font-bold text-[#1E3A8A]">20</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] md:text-xs">
                    <span className="text-[#1E3A8A]/60">❌ Negative</span>
                    <span className="font-bold text-[#E53935]">0.5</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 md:mt-5">
                <a
                  href="/t20/gk/all"
                  className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#E53935] to-[#C62828] text-white font-bold py-2.5 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm hover:from-[#C62828] hover:to-[#B71C1C] transition-all duration-200 shadow-md shadow-[#E53935]/20"
                >
                  Start Quiz Now 🚀
                </a>
              </div>
            </div>

            {/* ── LOCKED BANGLA CARD ── */}
            <div className="relative bg-white/60 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-200 opacity-70 grayscale flex flex-col backdrop-blur-sm">
              <div className="absolute inset-0 bg-white/20 rounded-xl md:rounded-2xl pointer-events-none" />
              <div className="flex items-center gap-2 md:block">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-base md:text-2xl flex-shrink-0">
                  🗣️
                </div>
                <h3 className="text-sm md:text-lg font-black text-slate-400 md:mt-3">Bangla Lecture 1</h3>
              </div>
              <div className="bg-slate-50 rounded-lg md:rounded-xl p-2.5 md:p-3.5 border border-slate-100 mt-3 space-y-1 md:space-y-1.5">
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-slate-400">📝 Questions</span>
                  <span className="font-bold text-slate-400">20</span>
                </div>
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-slate-400">⏱️ Time</span>
                  <span className="font-bold text-slate-400">10 Min</span>
                </div>
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-slate-400">💯 Marks</span>
                  <span className="font-bold text-slate-400">20</span>
                </div>
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-slate-400">❌ Negative</span>
                  <span className="font-bold text-slate-400">0.5</span>
                </div>
              </div>
              <div className="mt-3 md:mt-5">
                <button disabled className="w-full bg-slate-200 text-slate-400 font-bold py-2.5 md:py-3 rounded-lg md:rounded-xl text-xs cursor-not-allowed flex items-center justify-center gap-1.5">
                  🔒 Locked
                </button>
              </div>
            </div>

            {/* ── LOCKED ENGLISH CARD ── */}
            <div className="relative bg-white/60 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-200 opacity-70 grayscale flex flex-col backdrop-blur-sm">
              <div className="absolute inset-0 bg-white/20 rounded-xl md:rounded-2xl pointer-events-none" />
              <div className="flex items-center gap-2 md:block">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-base md:text-2xl flex-shrink-0">
                  📖
                </div>
                <h3 className="text-sm md:text-lg font-black text-slate-400 md:mt-3">English Lecture 1</h3>
              </div>
              <div className="bg-slate-50 rounded-lg md:rounded-xl p-2.5 md:p-3.5 border border-slate-100 mt-3 space-y-1 md:space-y-1.5">
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-slate-400">📝 Questions</span>
                  <span className="font-bold text-slate-400">20</span>
                </div>
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-slate-400">⏱️ Time</span>
                  <span className="font-bold text-slate-400">10 Min</span>
                </div>
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-slate-400">💯 Marks</span>
                  <span className="font-bold text-slate-400">20</span>
                </div>
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-slate-400">❌ Negative</span>
                  <span className="font-bold text-slate-400">0.5</span>
                </div>
              </div>
              <div className="mt-3 md:mt-5">
                <button disabled className="w-full bg-slate-200 text-slate-400 font-bold py-2.5 md:py-3 rounded-lg md:rounded-xl text-xs cursor-not-allowed flex items-center justify-center gap-1.5">
                  🔒 Locked
                </button>
              </div>
            </div>

            {/* ── LOCKED MATH CARD ── */}
            <div className="relative bg-white/60 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-200 opacity-70 grayscale flex flex-col backdrop-blur-sm">
              <div className="absolute inset-0 bg-white/20 rounded-xl md:rounded-2xl pointer-events-none" />
              <div className="flex items-center gap-2 md:block">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-base md:text-2xl flex-shrink-0">
                  🔢
                </div>
                <h3 className="text-sm md:text-lg font-black text-slate-400 md:mt-3">Math Lecture 1</h3>
              </div>
              <div className="bg-slate-50 rounded-lg md:rounded-xl p-2.5 md:p-3.5 border border-slate-100 mt-3 space-y-1 md:space-y-1.5">
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-slate-400">📝 Questions</span>
                  <span className="font-bold text-slate-400">20</span>
                </div>
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-slate-400">⏱️ Time</span>
                  <span className="font-bold text-slate-400">10 Min</span>
                </div>
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-slate-400">💯 Marks</span>
                  <span className="font-bold text-slate-400">20</span>
                </div>
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-slate-400">❌ Negative</span>
                  <span className="font-bold text-slate-400">0.5</span>
                </div>
              </div>
              <div className="mt-3 md:mt-5">
                <button disabled className="w-full bg-slate-200 text-slate-400 font-bold py-2.5 md:py-3 rounded-lg md:rounded-xl text-xs cursor-not-allowed flex items-center justify-center gap-1.5">
                  🔒 Locked
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── WEEKLY EXAM SCHEDULE ─── */}
        <section>
          <div className="flex items-center gap-2 mb-3 md:mb-6">
            <div className="w-1 h-6 md:h-8 bg-[#E53935] rounded-full" />
            <div className="min-w-0">
              <h2 className="text-sm md:text-2xl lg:text-3xl font-black text-[#1E3A8A] leading-tight">📅 সাপ্তাহিক রুটিন</h2>
              <p className="text-[10px] md:text-sm text-[#1E3A8A]/50 hidden sm:block">নিয়মিত প্র্যাকটিস ট্র্যাক বজায় রাখার জন্য সাপ্তাহিক কর্মপরিকল্পনা</p>
            </div>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg shadow-[#1E3A8A]/5 border border-[#FDED3E]/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1E3A8A]">
                    <th className="p-2 md:p-4 text-white font-bold text-[10px] md:text-sm">বার</th>
                    <th className="p-2 md:p-4 text-white font-bold text-[10px] md:text-sm">বিষয়</th>
                    <th className="p-2 md:p-4 text-white font-bold text-[10px] md:text-sm hidden md:table-cell">টপিক</th>
                    <th className="p-2 md:p-4 text-white font-bold text-[10px] md:text-sm">সময়</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FDED3E]/20">
                  {schedule.map((row, i) => (
                    <tr
                      key={i}
                      className={`transition-colors ${
                        row.highlight
                          ? 'bg-[#FDED3E]/20 hover:bg-[#FDED3E]/30'
                          : 'hover:bg-[#FDF8E7]'
                      }`}
                    >
                      <td className="p-2 md:p-4">
                        <span className={`font-bold text-[10px] md:text-sm ${row.highlight ? 'text-[#E53935]' : 'text-[#1E3A8A]/70'}`}>
                          {row.day}
                        </span>
                        <span className="text-[8px] md:text-[10px] text-[#1E3A8A]/40 block">{row.dayEn}</span>
                      </td>
                      <td className="p-2 md:p-4">
                        <span className={`font-bold text-[10px] md:text-sm ${row.highlight ? 'text-[#1E3A8A]' : 'text-[#1E3A8A]/80'}`}>
                          {row.subject}
                        </span>
                      </td>
                      <td className="p-2 md:p-4 text-[9px] md:text-xs text-[#1E3A8A]/60 hidden md:table-cell max-w-xs">
                        {row.topic}
                      </td>
                      <td className="p-2 md:p-4">
                        <span className={`inline-block text-[8px] md:text-xs font-bold px-1.5 md:px-3 py-1 md:py-1.5 rounded-lg whitespace-nowrap ${
                          row.highlight
                            ? 'bg-[#E53935]/10 text-[#E53935]'
                            : 'bg-[#1E3A8A]/5 text-[#1E3A8A]/70'
                        }`}>
                          {row.time}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─── GAMIFICATION SHOWCASE ─── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#1E3A8A] to-[#0D47A1] rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl shadow-[#1E3A8A]/20">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#FDED3E]/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#E53935]/5 rounded-full blur-3xl" />
          <div className="absolute right-0 top-0 opacity-[0.03] pointer-events-none text-[120px] md:text-[300px] font-black leading-none select-none">
            A2Z
          </div>

          <div className="relative p-4 md:p-12">
            <div className="max-w-3xl mb-6 md:mb-10">
              <span className="inline-flex items-center gap-1.5 bg-[#FDED3E] text-[#1E3A8A] text-[9px] md:text-xs font-bold px-2.5 md:px-4 py-1 md:py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                ✨ Exclusive Learning Features
              </span>
              <h2 className="text-base md:text-4xl font-black mt-2 md:mt-4 text-[#FDED3E] leading-tight">
                পলাশ সাধু স্যার Game Zone
              </h2>
              <p className="text-[#FDED3E]/60 mt-2 md:mt-3 text-[11px] md:text-base leading-relaxed">
                শিক্ষার্থীদের পড়ার একঘেয়েমি দূর করতে আমরা যুক্ত করছি
                এই ইন্টারেক্টিভ গেম এবং স্টোরি ফিচারগুলো, যা Study এনগেজমেন্ট বহুগুণ বাড়িয়ে দেবে:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

              {/* ─── 1. VOCABULARY QUICK TEST ─── */}
              <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-[#FDED3E]/30 hover:bg-white/[0.07] transition-all duration-300 flex flex-col">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-[#FDED3E]/10 border border-[#FDED3E]/20 flex items-center justify-center text-base md:text-xl flex-shrink-0">🧠</div>
                  <div>
                    <h3 className="text-xs md:text-base font-bold text-white">১. Vocabulary Quick Test</h3>
                    <p className="text-[8px] md:text-[10px] text-white/40">ইনস্ট্যান্ট স্কোর ও নেগেটিভ ট্র্যাকিং</p>
                  </div>
                </div>
                <p className="text-[10px] md:text-xs text-white/50 mb-3 md:mb-4 leading-relaxed">
                  শিক্ষার্থীরা স্ক্রিনে আসা ভোকাবুলারির সঠিক অর্থ ট্যাপ করে ইনস্ট্যান্ট স্কোর ও নেগেটিভ মার্কিং দেখতে পাবে।
                </p>
                {!vocabDone ? (
                  <div className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/5 space-y-2 md:space-y-3 flex-1">
                    <div className="flex items-center justify-between text-[8px] md:text-[10px] text-white/40">
                      <span>Q{vocabIndex + 1}/{vocabQuestions.length}</span>
                      <span>✔{vocabCorrectCount} ✘{vocabWrongCount}</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FDED3E] rounded-full transition-all duration-300" style={{ width: `${((vocabIndex + 1) / vocabQuestions.length) * 100}%` }} />
                    </div>
                    <p className="text-xs md:text-sm font-bold text-center text-white">"{currentVocab.word}"</p>
                    <p className="text-[8px] md:text-[10px] text-white/40 text-center -mt-1">Meaning?</p>
                    <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                      {currentVocab.options.map((opt, i) => {
                        const isCorrect = opt === currentVocab.meaning;
                        return (
                          <button key={i} onClick={() => handleVocabAnswer(opt)} disabled={vocabAnswered}
                            className={`text-[9px] md:text-xs py-1.5 md:py-2 px-1.5 md:px-2 rounded-lg font-medium transition-all duration-200 ${
                              vocabAnswered ? (isCorrect ? 'bg-green-500/30 border border-green-400/40 text-green-300' : 'bg-white/5 text-white/30') : 'bg-white/10 hover:bg-white/20 text-white/80'
                            }`}
                          >{opt}</button>
                        );
                      })}
                    </div>
                    {vocabScore === 'correct' && <div className="bg-green-500/20 border border-green-400/30 text-green-300 text-[9px] md:text-xs font-bold text-center py-1.5 md:py-2 rounded-lg">✔ Correct! (+1)</div>}
                    {vocabScore === 'wrong' && <div className="bg-red-500/20 border border-red-400/30 text-red-300 text-[9px] md:text-xs font-bold text-center py-1.5 md:py-2 rounded-lg">❌ Wrong! (-0.5) — {currentVocab.meaning}</div>}
                    {vocabAnswered && (
                      <button onClick={nextVocab} className="w-full bg-[#FDED3E] hover:bg-[#FDD835] text-[#1E3A8A] font-bold py-1.5 md:py-2 rounded-lg text-[9px] md:text-xs transition-all duration-200">
                        {vocabIndex < vocabQuestions.length - 1 ? 'Next →' : 'See Results'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/5 space-y-2 md:space-y-3 flex-1 flex flex-col items-center justify-center text-center">
                    <div className="text-2xl md:text-3xl mb-1 md:mb-2">🎉</div>
                    <p className="text-white font-bold text-xs md:text-sm">Complete!</p>
                    <div className="flex gap-3 md:gap-4 text-[10px] md:text-xs">
                      <span className="text-green-400">✔ {vocabCorrectCount}</span>
                      <span className="text-red-400">✘ {vocabWrongCount}</span>
                    </div>
                    <div className="bg-white/10 rounded-lg px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs">
                      <span className="text-white/60">Net: </span>
                      <span className={`font-bold ${netScore >= 0 ? 'text-green-400' : 'text-red-400'}`}>{netScore.toFixed(1)}/{vocabQuestions.length}</span>
                      <span className="text-white/40 ml-1 md:ml-2">(-{totalNegative})</span>
                    </div>
                    <button onClick={resetVocab} className="bg-[#FDED3E] hover:bg-[#FDD835] text-[#1E3A8A] font-bold py-1.5 md:py-2 px-4 md:px-6 rounded-lg text-[9px] md:text-xs transition-all duration-200">🔄 Try Again</button>
                  </div>
                )}
              </div>

              {/* ─── 2. VOCABULARY STORY ─── */}
              <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-[#FDED3E]/30 hover:bg-white/[0.07] transition-all duration-300 flex flex-col">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-[#FDED3E]/10 border border-[#FDED3E]/20 flex items-center justify-center text-base md:text-xl flex-shrink-0">📖</div>
                  <div>
                    <h3 className="text-xs md:text-base font-bold text-white">২. Vocabulary Storytelling</h3>
                    <p className="text-[8px] md:text-[10px] text-white/40">গল্পে গল্পে BCS ভোকাবুলারি</p>
                  </div>
                </div>
                <p className="text-[10px] md:text-xs text-white/50 mb-3 md:mb-4 leading-relaxed">কঠিন ইংরেজি শব্দ মনে রাখার জন্য ছোট গল্পের মাধ্যমে ভিজ্যুয়াল লার্নিং মডিউল।</p>
                <div className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <span className="text-[8px] md:text-[10px] text-white/40">Story {storyIndex + 1}/{stories.length}</span>
                    <div className="flex gap-1">
                      {stories.map((_, i) => (
                        <button key={i} onClick={() => setStoryIndex(i)}
                          className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${i === storyIndex ? 'bg-[#FDED3E] w-3 md:w-4' : 'bg-white/20 hover:bg-white/40'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="text-xs md:text-sm font-bold text-white mb-1 md:mb-2">{currentStory.title}</h4>
                  <p className="text-[9px] md:text-[11px] text-white/60 leading-relaxed flex-1">{currentStory.excerpt}</p>
                  <div className="flex flex-wrap gap-1 md:gap-1.5 mt-2 md:mt-3 pt-2 md:pt-3 border-t border-white/10">
                    {currentStory.words.map((w, i) => (
                      <span key={i} className="text-[8px] md:text-[10px] bg-[#FDED3E]/10 text-[#FDED3E] px-1.5 md:px-2 py-0.5 rounded-md border border-[#FDED3E]/20">{w}</span>
                    ))}
                  </div>
                  <div className="mt-2 md:mt-3 bg-[#FDED3E]/5 border border-[#FDED3E]/10 rounded-lg p-2 md:p-2.5 text-center">
                    <p className="text-[8px] md:text-[10px] text-[#FDED3E]/70 italic">"গল্পে গল্পে সহজে BCS ভোকাবুলারি আয়ত্ত করুন"</p>
                  </div>
                </div>
              </div>

              {/* ─── 3. AtoZ GAME ─── */}
              <div className="bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-[#FDED3E]/30 hover:bg-white/[0.07] transition-all duration-300 flex flex-col">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-[#FDED3E]/10 border border-[#FDED3E]/20 flex items-center justify-center text-base md:text-xl flex-shrink-0">🎮</div>
                  <div>
                    <h3 className="text-xs md:text-base font-bold text-white">৩. AtoZ Game</h3>
                    <p className="text-[8px] md:text-[10px] text-white/40">খেলতে খেলতে শেখা</p>
                  </div>
                </div>
                <p className="text-[10px] md:text-xs text-white/50 mb-3 md:mb-4 leading-relaxed">A-Z বর্ণ দিয়ে শুরু হওয়া বিসিএস প্রশ্নের দ্রুত ফায়ার চেইন রাউন্ড গেম।</p>
                {!gameDone ? (
                  <div className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/5 space-y-2 md:space-y-3 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-[8px] md:text-[10px] text-white/40">
                      <span>Letter {gameIndex + 1}/{gameLetters.length}</span>
                      <span className="text-base md:text-lg font-black text-[#FDED3E]">{currentGame.letter}</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FDED3E] rounded-full transition-all duration-300" style={{ width: `${((gameIndex + 1) / gameLetters.length) * 100}%` }} />
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 md:space-y-3">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#FDED3E]/10 border-2 border-[#FDED3E]/30 flex items-center justify-center">
                        <span className="text-2xl md:text-3xl font-black text-[#FDED3E]">{currentGame.letter}</span>
                      </div>
                      <p className="text-[11px] md:text-sm font-bold text-white">{currentGame.q}</p>
                      {!gameRevealed ? (
                        <button onClick={revealAnswer} className="bg-[#FDED3E] hover:bg-[#FDD835] text-[#1E3A8A] font-bold py-1.5 md:py-2 px-4 md:px-6 rounded-lg text-[9px] md:text-xs transition-all duration-200">👁️ Show Answer</button>
                      ) : (
                        <div className="bg-green-500/20 border border-green-400/30 text-green-300 text-[9px] md:text-xs font-bold py-1.5 md:py-2 px-3 md:px-4 rounded-lg w-full">✅ {currentGame.a}</div>
                      )}
                    </div>
                    {gameRevealed && (
                      <button onClick={nextGame} className="w-full bg-[#FDED3E] hover:bg-[#FDD835] text-[#1E3A8A] font-bold py-1.5 md:py-2 rounded-lg text-[9px] md:text-xs transition-all duration-200">
                        {gameIndex < gameLetters.length - 1 ? 'Next Letter →' : 'See Results'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/5 space-y-2 md:space-y-3 flex-1 flex flex-col items-center justify-center text-center">
                    <div className="text-2xl md:text-3xl mb-1 md:mb-2">🏆</div>
                    <p className="text-white font-bold text-xs md:text-sm">Game Complete!</p>
                    <p className="text-[8px] md:text-[10px] text-white/40">{gameLetters.length} letters explored</p>
                    <button onClick={resetGame} className="bg-[#FDED3E] hover:bg-[#FDD835] text-[#1E3A8A] font-bold py-1.5 md:py-2 px-4 md:px-6 rounded-lg text-[9px] md:text-xs transition-all duration-200">🔄 Play Again</button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* ════════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ════════════════════════════════════════════ */}
      <footer className="bg-[#1E3A8A] border-t-4 border-[#FDED3E]">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
            <div className="text-center md:text-left">
              <p className="text-[#FDED3E] font-bold text-[10px] md:text-sm">BCS A to Z — পলাশ সাধু স্যার</p>
              <p className="text-white/40 text-[8px] md:text-[10px] mt-0.5">Powered by BCS Spark Engine</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-white/50 text-[8px] md:text-[10px]">© {new Date().getFullYear()} BCS Spark Engine. Specially Designed for BCS A to Z.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}