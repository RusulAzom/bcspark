"use client";
import Link from "next/link";
import {
  Zap, Target, Cpu, FileText, BarChart3, Newspaper,
  BookOpen, Calculator, Globe, Trophy, Map, ArrowRight
} from "lucide-react";
import React, { useState } from 'react';
import HeroCarousel from "./HeroCarousel";
// psychology modal popup 
import PsychologyModal from './PsychologyModal';

// 40+ tools list 
const topTools = [
  { id: 1, name: "T20 কুইজ", icon: <Target className="h-4.5 w-4.5" />, href: "/t20" }, // চালু 
  { id: 2, name: "সাইকোলজি টেস্ট", icon: <Cpu className="h-4.5 w-4.5" />, href: "/psychology-test-bangla" }, // চালু 
  { id: 3, name: "MCQ প্র্যাকটিস", icon: <FileText className="h-4.5 w-4.5" />, href: "#" },
  { id: 4, name: "মডেল টেস্ট", icon: <BarChart3 className="h-4.5 w-4.5" />, href: "#" },
  { id: 5, name: "BCS নিউজ", icon: <Newspaper className="h-4.5 w-4.5" />, href: "#" },
  { id: 6, name: "বাংলা সাহিত্য", icon: <BookOpen className="h-4.5 w-4.5" />, href: "#" },
  { id: 7, name: "গণিত প্র্যাকটিস", icon: <Calculator className="h-4.5 w-4.5" />, href: "#" },
  { id: 8, name: "আন্তর্জাতিক বিষয়", icon: <Globe className="h-4.5 w-4.5" />, href: "#" },
  { id: 9, name: "লিডারবোর্ড", icon: <Trophy className="h-4.5 w-4.5" />, href: "#" },
  { id: 10, name: "সিলেবাস গাইড", icon: <Map className="h-4.5 w-4.5" />, href: "#" }
];

export default function HeroSection() {
  const [isPsychologyModalOpen, setIsPsychologyModalOpen] = useState(false);

  return (
    <div className="relative bg-gray-50 py-4">
      
      {/* আপনার মেইন আসল UI লেআউট */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

          {/* Left Column: Top AI Tools Sidebar */}
          <div className="order-2 lg:order-1 lg:col-span-1 flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 mb-6">
                <Zap className="h-5 w-5 fill-amber-500 stroke-amber-500 animate-pulse" />
                <h2 className="text-lg font-extrabold text-primary">টপ AI টুলস</h2>
              </div>

              {/* Menu List */}
              <div className="grid grid-cols-2 grid-rows-5 grid-flow-col gap-1.5">
                {topTools.map((tool) => {
                  // সাইকোলজি টেস্ট বাটন — এখন পেজে রিডাইরেক্ট হবে
                  if (tool.id === 2) {
      return (
        <Link
          key={tool.id}
          href={tool.href}
          className="flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-blue-50/50 hover:text-primary group text-left w-full"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0f4f8] text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            {tool.icon}
          </div>
          <span>{tool.name}</span> 
        </Link>
      );
                  }

                  // অন্যান্য নরমাল বাটনগুলোর জন্য লিংক রেন্ডারিং
                  return (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className="flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-blue-50/50 hover:text-primary group"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0f4f8] text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                        {tool.icon}
                      </div>
                      <span>{tool.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer Navigation Link */}
            <Link
              href="/tools"
              className="mt-6 flex items-center gap-1.5 px-3.5 text-sm font-extrabold text-primary transition-all hover:text-accent group"
            >
              <span>সকল 40+ টুলস</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right Column: Hero Carousel */}
          <div className="order-1 lg:order-2 lg:col-span-2">
            <HeroCarousel />
          </div>

        </div>
      </section>

      {/* কুইক ক্যাটাগরি বাটন রো — হিরো স্লাইডারের নিচে */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide gap-3 justify-center lg:justify-center">
          <Link href="#" className="shrink-0 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:shadow-md hover:border-accent hover:text-accent transition-all active:scale-95">
            HSC
          </Link>
          <Link href="#" className="shrink-0 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:shadow-md hover:border-accent hover:text-accent transition-all active:scale-95">
            Admission Test
          </Link>
          <Link href="#" className="shrink-0 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:shadow-md hover:border-accent hover:text-accent transition-all active:scale-95">
            SSC
          </Link>
          <Link href="/psychology-test-bangla" className="shrink-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95 flex items-center gap-2">
            <span>🧠</span>
            <span>মানসিক স্বাস্থ্য পরীক্ষা</span>
          </Link>
        </div>
      </section>

      {/* সাইকোলজি টেস্ট মডাল (পপআপ) */}
      {isPsychologyModalOpen && (
        <PsychologyModal
          onClose={() => setIsPsychologyModalOpen(false)}
        />
      )}

    </div>
  );
}