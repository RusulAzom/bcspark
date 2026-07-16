"use client";

import { useState, useEffect } from "react";
import { 
  Cake, CheckSquare, Play, Zap, Clock, CheckCircle2, 
  TrendingUp, Flame, AlertCircle, RefreshCw, BookOpen
} from "lucide-react";

export default function InfoRow() {
  // Mock Model Test Form State
  const [exam, setExam] = useState("BCS");
  const [phase, setPhase] = useState("Preli");
  const [subject, setSubject] = useState("বাংলা");
  const [questions, setQuestions] = useState("২০টি");
  const [duration, setDuration] = useState("২০ মিনিট");
  const [testStarted, setTestStarted] = useState(false);

  // Productivity widgets states
  const [pomoTime, setPomoTime] = useState(1500);
  const [pomoRunning, setPomoRunning] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, text: "বাংলা সাহিত্য রিভিশন", done: true },
    { id: 2, text: "ম্যাথ প্র্যাকটিস (শতকরা)", done: false },
    { id: 3, text: "ডেইলি কুইজ সাবমিশন", done: false }
  ]);
  const [streak, setStreak] = useState(7);
  const [goalPercent, setGoalPercent] = useState(65);

  useEffect(() => {
    let timer = null;
    if (pomoRunning && pomoTime > 0) {
      timer = setInterval(() => {
        setPomoTime((prev) => prev - 1);
      }, 1000);
    } else if (pomoTime === 0) {
      setPomoRunning(false);
      alert("অভিনন্দন! আপনার ২৫ মিনিটের স্টাডি সেশন সম্পন্ন হয়েছে।");
      setPomoTime(1500);
    }
    return () => clearInterval(timer);
  }, [pomoRunning, pomoTime]);

  const togglePomo = () => setPomoRunning(!pomoRunning);
  const resetPomo = () => {
    setPomoRunning(false);
    setPomoTime(1500);
  };

  const formatPomoTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleStartTest = (e) => {
    e.preventDefault();
    setTestStarted(true);
    setTimeout(() => {
      setTestStarted(false);
      alert(`পরীক্ষা শুরু হচ্ছে...\nপরীক্ষা: ${exam}\nধাপ: ${phase}\nবিষয়: ${subject}\nপ্রশ্ন: ${questions}\nসময়: ${duration}`);
    }, 800);
  };

  // আজকের দিনে ডাটা
  const historicalEvents = [
    {
      year: "২০২৫",
      title: "জুলাই শহীদ দিবস",
      desc: "২০২৪ সালের জুলাই আন্দোলনের শহীদদের স্মরণে ২০২৫ সাল থেকে প্রতিবছর ১৬ জুলাই দিবসটি পালন করা হয়।"
    },
    {
      year: "২০১৬",
      title: "হোলি আর্টিসান ক্যাফে হামলা",
      desc: "বাংলাদেশের ইতিহাসের সবচেয়ে মারাত্মক ও ভয়াবহ সন্ত্রাসী হামলা। ১২ ঘণ্টার জিম্মি দশা ও আন্তর্জাতিক নাগরিকদের প্রাণহানি।"
    },
    {
      year: "২০২৪",
      title: "আবু সাঈদ (শহীদুন্নাহার)",
      desc: "বেগম রোকেয়া বিশ্ববিদ্যালয়ের ইংরেজি বিভাগের বীর ছাত্র, যিনি ১৬ জুলাই ২০২৪-এ জুলাই গণআন্দোলনের প্রথম শহীদদের একজন হিসেবে আত্মত্যাগ করেন।"
    }
  ];

  const famousPersonalities = [
    {
      year: "১৮৯৬",
      name: "ত্রিগভে লি (Trygve Lie)",
      desc: "জাতিসংঘের প্রথম মহাসচিব (সেবাকাল: ১৯৪৬-১৯৫২)।"
    },
    {
      year: "১৮৭২",
      name: "রোনাল্ড আমুন্ডসেন",
      desc: "বিশ্ববিখ্যাত নরওয়েজিয়ান অভিযাত্রী; প্রথম সফলভাবে দক্ষিণ মেরু (South Pole) জয় করেন।"
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1: প্রোডাক্টিভিটি টুলস */}
        <div className="flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow min-h-[460px]">
          <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary leading-tight">প্রোডাক্টিভিটি টুলস</h3>
                <p className="text-xs text-gray-500">মনোযোগ ও অগ্রগতি ট্র্যাক করুন</p>
              </div>
            </div>

            {/* Grid Widgets */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Pomodoro Card */}
              <div className="flex flex-col justify-between rounded-2xl bg-rose-50/50 border border-rose-100/30 p-3.5 hover:bg-rose-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800">পোমোডোরো টাইমার</span>
                  <Clock className="h-3.5 w-3.5 text-rose-500" />
                </div>
                <div className="mt-3">
                  <p className="text-lg font-extrabold text-rose-900 leading-none mb-1">
                    {formatPomoTime(pomoTime)}
                  </p>
                  <p className="text-[10px] text-rose-700 leading-tight">২৫ মি. ফোকাস + ৫ মি. বিরতি</p>
                </div>
                <div className="flex gap-1.5 mt-2.5">
                  <button 
                    onClick={togglePomo}
                    className="flex-1 rounded-md bg-rose-600 px-1.5 py-1 text-[10px] font-bold text-white transition-colors hover:bg-rose-700"
                  >
                    {pomoRunning ? "থামুন" : "শুরু"}
                  </button>
                  <button 
                    onClick={resetPomo}
                    className="rounded-md bg-rose-200 px-1.5 py-1 text-[10px] font-bold text-rose-800 transition-colors hover:bg-rose-300"
                  >
                    রিসেট
                  </button>
                </div>
              </div>

              {/* Task Tracker Card */}
              <div className="flex flex-col justify-between rounded-2xl bg-emerald-50/40 border border-emerald-100/30 p-3.5 hover:bg-emerald-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800">টাস্ক ট্র্যাকার</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                
                <div className="mt-2.5 space-y-1.5 max-h-[70px] overflow-y-auto">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-1.5 cursor-pointer"
                    >
                      <input 
                        type="checkbox" 
                        checked={task.done} 
                        readOnly 
                        className="h-3 w-3 rounded text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className={`text-[10px] truncate leading-none ${task.done ? "line-through text-gray-400" : "text-emerald-950 font-medium"}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  <p className="text-[9px] text-emerald-700 font-semibold leading-tight">আজকের পড়ার তালিকা</p>
                </div>
              </div>

              {/* Streak Tracker Card */}
              <div className="flex flex-col justify-between rounded-2xl bg-amber-50/40 border border-amber-100/30 p-3.5 hover:bg-amber-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800">স্ট্রিক ট্র্যাকার</span>
                  <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <p className="text-2xl font-extrabold text-amber-900 leading-none">
                    {streak}
                  </p>
                  <span className="text-xs font-bold text-amber-800">দিন</span>
                  <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-pulse ml-auto" />
                </div>
                <p className="text-[10px] text-amber-700 leading-normal mt-2.5">টানা কতদিন পড়ছেন দেখুন</p>
              </div>

              {/* Daily Goal Card */}
              <div className="flex flex-col justify-between rounded-2xl bg-indigo-50/40 border border-indigo-100/30 p-3.5 hover:bg-indigo-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-800">ডেইলি গোল</span>
                  <Flame className="h-3.5 w-3.5 text-indigo-500" />
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-bold text-indigo-900 mb-1">
                    <span>অগ্রগতি</span>
                    <span>{goalPercent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-indigo-100 overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${goalPercent}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2.5">
                  <span className="text-[9px] text-indigo-700 leading-none font-semibold">লক্ষ্য অর্জন</span>
                  <button 
                    onClick={() => setGoalPercent(prev => Math.min(prev + 5, 100))}
                    className="rounded-md bg-indigo-200 hover:bg-indigo-300 px-1 py-0.5 text-[9px] font-bold text-indigo-800 transition-colors"
                  >
                    +৫%
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-5 text-[10px] text-center text-gray-400 font-medium">
            অগ্রগতি প্রতিদিন মধ্যরাতে রিসেট হবে
          </div>

          <button className="w-full mt-6 rounded-xl border border-blue-100 py-3 text-center text-sm font-semibold text-primary transition-all hover:bg-blue-50/40">
            আরও দেখো &rarr;
          </button>
        </div>

        {/* Column 2: মক মডেল টেস্ট */}
        <div className="flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow min-h-[460px]">
          <form onSubmit={handleStartTest} className="flex flex-col h-full justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary leading-tight">মক মডেল টেস্ট</h3>
                  <p className="text-xs text-gray-500">পরীক্ষা নির্বাচন করুন</p>
                </div>
              </div>

              {/* Form Controls */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">পরীক্ষা</label>
                  <select 
                    value={exam} 
                    onChange={(e) => setExam(e.target.value)}
                    className="w-full rounded-xl bg-[#f0f4f8] py-2 px-3.5 text-sm font-medium text-primary outline-none focus:ring-1 focus:ring-primary/20 border-none"
                  >
                    <option>BCS</option>
                    <option>প্রাথমিক সহকারী শিক্ষক</option>
                    <option>ব্যাংক জব</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">ধাপ</label>
                  <select 
                    value={phase} 
                    onChange={(e) => setPhase(e.target.value)}
                    className="w-full rounded-xl bg-[#f0f4f8] py-2 px-3.5 text-sm font-medium text-primary outline-none focus:ring-1 focus:ring-primary/20 border-none"
                  >
                    <option>Preli</option>
                    <option>Written</option>
                    <option>Viva</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">বিষয়</label>
                  <select 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl bg-[#f0f4f8] py-2 px-3.5 text-sm font-medium text-primary outline-none focus:ring-1 focus:ring-primary/20 border-none"
                  >
                    <option>বাংলা</option>
                    <option>ইংরেজি</option>
                    <option>গণিত</option>
                    <option>সাধারণ জ্ঞান</option>
                    <option>বিজ্ঞান ও প্রযুক্তি</option>
                  </select>
                </div>

                {/* 2-Column Selectors */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">প্রশ্ন</label>
                    <select 
                      value={questions} 
                      onChange={(e) => setQuestions(e.target.value)}
                      className="w-full rounded-xl bg-[#f0f4f8] py-2 px-3.5 text-sm font-medium text-primary outline-none focus:ring-1 focus:ring-primary/20 border-none"
                    >
                      <option>১০টি</option>
                      <option>২০টি</option>
                      <option>৩০টি</option>
                      <option>৫০টি</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">সময়</label>
                    <select 
                      value={duration} 
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full rounded-xl bg-[#f0f4f8] py-2 px-3.5 text-sm font-medium text-primary outline-none focus:ring-1 focus:ring-primary/20 border-none"
                    >
                      <option>১০ মিনিট</option>
                      <option>২০ মিনিট</option>
                      <option>৩০ মিনিট</option>
                      <option>৫০ মিনিট</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Action */}
            <button 
              type="submit" 
              disabled={testStarted}
              className="w-full mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition-all hover:bg-opacity-90 disabled:bg-slate-400 active:scale-98"
            >
              {testStarted ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4 fill-white" />
              )}
              <span>টেস্ট শুরু করো</span>
            </button>
          </form>
        </div>

        {/* Column 3: আজকের দিনে — ঐতিহাসিক ঘটনা ও বিখ্যাত ব্যক্তিত্ব */}
        <div className="flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow min-h-[460px]">
          <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary leading-tight">আজকের দিনে</h3>
                <p className="text-xs text-gray-500">১৬ জুলাই: ঐতিহাসিক ঘটনা ও গুরুত্বপূর্ণ সাধারণ জ্ঞান</p>
              </div>
            </div>

            {/* ঐতিহাসিক ঘটনা */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">ঐতিহাসিক ঘটনা</span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">July 16</span>
              </div>
              <div className="space-y-2 max-h-[140px] overflow-y-auto scrollbar-hide">
                <div className="flex items-start gap-2 rounded-xl bg-gray-50/80 p-2.5">
                  <span className="shrink-0 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-extrabold text-white">২০২৫</span>
                  <p className="text-[11px] leading-relaxed text-gray-700"><strong>জুলাই শহীদ দিবস:</strong> ২০২৪ সালের জুলাই আন্দোলনের শহীদদের স্মরণে ২০২৫ সাল থেকে প্রতিবছর ১৬ জুলাই দিবসটি পালন করা হয়।</p>
                </div>
                <div className="flex items-start gap-2 rounded-xl bg-gray-50/80 p-2.5">
                  <span className="shrink-0 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-extrabold text-white">২০১৬</span>
                  <p className="text-[11px] leading-relaxed text-gray-700"><strong>হোলি আর্টিসান ক্যাফে হামলা:</strong> বাংলাদেশের ইতিহাসের সবচেয়ে মারাত্মক ও ভয়াবহ সন্ত্রাসী হামলা।</p>
                </div>
                <div className="flex items-start gap-2 rounded-xl bg-gray-50/80 p-2.5">
                  <span className="shrink-0 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-extrabold text-white">২০২৪</span>
                  <p className="text-[11px] leading-relaxed text-gray-700"><strong>আবু সাঈদ (শহীদুন্নাহার):</strong> বেগম রোকেয়া বিশ্ববিদ্যালয়ের ইংরেজি বিভাগের বীর ছাত্র, যিনি ১৬ জুলাই ২০২৪-এ জুলাই গণআন্দোলনের প্রথম শহীদদের একজন হিসেবে আত্মত্যাগ করেন।</p>
                </div>
              </div>
            </div>

            {/* বিখ্যাত ব্যক্তিত্ব */}
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">বিখ্যাত ব্যক্তিত্ব</span>
              </div>
              <div className="space-y-2 max-h-[140px] overflow-y-auto scrollbar-hide">
                <div className="flex items-start gap-2 rounded-xl bg-gray-50/80 p-2.5">
                  <span className="shrink-0 rounded-full bg-indigo-600 px-2 py-0.5 text-[9px] font-extrabold text-white">১৮৯৬</span>
                  <div>
                    <p className="text-[11px] font-bold text-gray-800">ত্রিগভে লি (Trygve Lie)</p>
                    <p className="text-[10px] leading-relaxed text-gray-600">জাতিসংঘের প্রথম মহাসচিব (সেবাকাল: ১৯৪৬-১৯৫২)।</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-xl bg-gray-50/80 p-2.5">
                  <span className="shrink-0 rounded-full bg-indigo-600 px-2 py-0.5 text-[9px] font-extrabold text-white">১৮৭২</span>
                  <div>
                    <p className="text-[11px] font-bold text-gray-800">রোনাল্ড আমুন্ডসেন</p>
                    <p className="text-[10px] leading-relaxed text-gray-600">বিশ্ববিখ্যাত নরওয়েজিয়ান অভিযাত্রী; প্রথম সফলভাবে দক্ষিণ মেরু (South Pole) জয় করেন।</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 rounded-xl border border-blue-100 py-3 text-center text-sm font-semibold text-primary transition-all hover:bg-blue-50/40">
            আরও দেখো &rarr;
          </button>
        </div>

      </div>
    </section>
  );
}