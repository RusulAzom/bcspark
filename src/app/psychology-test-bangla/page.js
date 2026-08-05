// src/app/psychology-test-bangla/page.js
"use client";
import React, { useState } from "react";
import { psychologyCategories, psychologyTests } from "../frontApp/psychologyData";
// add imports 
import AdBanner728 from '@/components/add/adstra/AdBanner728';
import AdBanner300 from '@/components/add/adstra/AdBanner300';
import NativeBanner from '@/components/add/adstra/NativeBanner';
import SocialBar from '@/components/add/adstra/SocialBar';

import PsychologyModal from "@/components/PsychologyModal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PsychologyTestBanglaPage() {
  const [modalState, setModalState] = useState({ open: false, testId: null });

  const openTest = (testId) => {
    setModalState({ open: true, testId });
  };

  const closeTest = () => {
    setModalState({ open: false, testId: null });
  };

  // নির্দিষ্ট ক্যাটাগরির অধীনে থাকা টেস্টগুলো বের করা
  const getTestsForCategory = (catId) => {
    return Object.values(psychologyTests).filter((t) => t.parentId === catId);
  };

  // প্রথম ৪টি পপুলার টেস্ট বের করা (যেকোনো ক্যাটাগরি থেকে)
  const allTests = Object.values(psychologyTests);
  const popularTests = allTests.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Sticky Navigation Bar */}
      <Navbar />

      <main className="flex-1">
        {/* হিরো সেকশন */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 text-white py-16 md:py-20">
          <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-10"></div>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block bg-white/15 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                🧠 Scientific Mental Health Assessment
              </span>
              {/* 🎯 Social Bar Ad Script */}
              {/* <SocialBar /> */}
              <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
                মানসিক স্বাস্থ্য পরীক্ষা —{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                  Psychology Test Bangla
                </span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
                BCSpark-এ বিনামূল্যে করুন আপনার অনলাইন মানসিক চিকিৎসা ও টেস্ট।
                উদ্বেগ ও দুশ্চিন্তা পরীক্ষা, ডিপ্রেশন টেস্ট বাংলা, সম্পর্কের টানাপোড়েন ও মানসিক চাপ,
                পড়াশোনায় ক্লান্তি ও বার্নআউট — সব ধরণের বৈজ্ঞানিক সাইকোলজি টেস্ট এক জায়গায়।
                GAD-7, BAI, HAM-A, RAS সহ আন্তর্জাতিকভাবে স্বীকৃত সব পরীক্ষা এখন বাংলায়।
              </p>
              {/* সিটিএ বাটন — হিরো থেকে টেস্ট সেকশনে স্ক্রল */}
              <button
                onClick={() => document.getElementById('all-tests-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-8 inline-block bg-white text-indigo-900 font-bold text-lg px-8 py-4 rounded-xl shadow-2xl hover:shadow-white/30 hover:scale-105 transition-all duration-300 active:scale-[0.98]"
              >
                এখনই টেস্ট শুরু করুন ⚡
              </button>
              {/* adds 728 */}
              {/* <AdBanner728 /> */}

            </div>
          </div>
        </section>

        {/* মূল কনটেন্ট — টু-কলাম লেআউট */}
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
          {/* ===== লেফট কলাম (75%) ===== */}
          <div className="flex-1 lg:w-3/4 space-y-12">
            {/* <section id="all-tests-section">
              <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-2">
                📋 সকল মানসিক স্বাস্থ্য পরীক্ষা
              </h2>
              <p className="text-gray-500 mb-8">
                নিচের যেকোনো পরীক্ষা নির্বাচন করে শুরু করুন — সম্পূর্ণ বিনামূল্যে ও গোপনীয়।
              </p>
            </section> */}

            {/* ডায়নামিক ক্যাটাগরি লুপ */}
            {psychologyCategories.map((category) => {
              const testsInCat = getTestsForCategory(category.id);
              if (testsInCat.length === 0) return null;

              return (
                <section key={category.id}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-5 text-center sm:text-left">
                    <div className="hidden sm:block h-1 flex-1 bg-gradient-to-r from-blue-200 to-transparent rounded-full"></div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                      {category.nameBN}
                    </h3>
                    <span className="text-sm text-gray-400 font-medium">({category.nameEN})</span>
                    <div className="hidden sm:block h-1 flex-1 bg-gradient-to-l from-blue-200 to-transparent rounded-full"></div>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 text-center">{category.description}</p>

                  {/* টেস্ট কার্ড গ্রিড */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testsInCat.map((test) => (
                      <div
                        key={test.id}
                        className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 flex flex-col"
                      >
                        {/* আইকন */}
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform">
                          🧠
                        </div>
                        {/* টেস্টের নাম */}
                        <h4 className="text-lg font-bold text-gray-800 mb-2 leading-snug">
                          {test.name}
                        </h4>
                        {/* বিবরণ */}
                        <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">
                          {test.description}
                        </p>
                        {/* মেটা তথ্য */}
                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                          <span>📝 {test.totalQuestions}টি প্রশ্ন</span>
                          <span>⏱️ {test.totalQuestions * 1} মিনিট</span>
                        </div>
                        {/* স্টার্ট বাটন */}
                        <button
                          onClick={() => openTest(test.id)}
                          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition active:scale-[0.98] shadow-lg shadow-emerald-600/20"
                        >
                          টেস্ট শুরু করুন ⚡
                        </button>
                      </div>
                    ))}
                  </div>
                  {/* adds 728 */}
                  {/* <AdBanner728 /> */}
                </section>
              );
            })}
            {/* 🎯 tEst কন্টেন্টের নিচে Native Banner */}
            {/* <NativeBanner /> */}
          </div>

          {/* ===== রাইট সাইডবার (25%) ===== */}
          <aside className="lg:w-1/4 space-y-6">
            {/* জনপ্রিয় টেস্ট */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                🔥 জনপ্রিয় Psychology Test
              </h3>
              {/* adds 300 */}
              {/* <AdBanner300 /> */}
              <ul className="space-y-2">
                {popularTests.map((test) => (
                  <li key={test.id}>
                    <button
                      onClick={() => openTest(test.id)}
                      className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-gray-700 text-sm font-medium transition flex items-center gap-2"
                    >
                      <span className="text-blue-500">➤</span>
                      <span>{test.name.length > 40 ? test.name.slice(0, 40) + "…" : test.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* সম্পর্কিত আর্টিকেল */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                📖 মানসিক স্বাস্থ্য গাইড
              </h3>
              {/* adds 300 */}
              {/* <AdBanner300 /> */}
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="block p-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 transition">
                    <span className="font-semibold">উদ্বেগ কমানোর ৫টি কার্যকরী উপায়</span>
                    <p className="text-xs text-amber-600 mt-0.5">বাংলায় বিজ্ঞানসম্মত টিপস</p>
                  </a>
                </li>
                <li>
                  <a href="#" className="block p-3 rounded-xl bg-green-50 hover:bg-green-100 text-green-800 transition">
                    <span className="font-semibold">পরীক্ষার আগে মানসিক চাপ কমানো</span>
                    <p className="text-xs text-green-600 mt-0.5">ছাত্রদের জন্য গাইড</p>
                  </a>
                </li>
                <li>
                  <a href="#" className="block p-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 transition">
                    <span className="font-semibold">সম্পর্কের টানাপোড়েন: করণীয়</span>
                    <p className="text-xs text-purple-600 mt-0.5">পরিবার ও সঙ্গীর জন্য</p>
                  </a>
                </li>
                <li>
                  <a href="#" className="block p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 transition">
                    <span className="font-semibold">বার্নআউট থেকে মুক্তির উপায়</span>
                    <p className="text-xs text-blue-600 mt-0.5">পড়াশোনায় ক্লান্তি দূর করুন</p>
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* ফুটার */}
      <Footer />

      {/* মডাল — initialTestId সহ ওপেন হবে */}
      {modalState.open && (
        <PsychologyModal
          onClose={closeTest}
          initialTestId={modalState.testId}
        />
      )}
    </div>
  );
}
