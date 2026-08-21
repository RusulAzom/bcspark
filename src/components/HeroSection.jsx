"use client";
import Link from "next/link";
import {
  Zap, Target, Cpu, FileText, BarChart3, Newspaper,
  BookOpen, Calculator, Globe, Trophy, Map, ArrowRight, Languages, History, FolderOpen
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
  { id: 4, name: "মডেল টেস্ট", icon: <BarChart3 className="h-4.5 w-4.5" />, href: "/mock-test" },
  { id: 5, name: "জব সার্কুলার", icon: <Newspaper className="h-4.5 w-4.5" />, href: "/job-circular" },
  { id: 6, name: "Blog/ম্যাগাজিন", icon: <BookOpen className="h-4.5 w-4.5" />, href: "/blog" },
  { id: 7, name: "গণিত প্র্যাকটিস", icon: <Calculator className="h-4.5 w-4.5" />, href: "#" },
  { id: 8, name: "প্রশ্নব্যাংক", icon: <BookOpen className="h-4.5 w-4.5" />, href: "/question-bank" },
  { id: 9, name: "Vocabulary Story", icon: <Languages className="h-4.5 w-4.5" />, href: "/vocabulary/stories" },
  { id: 10, name: "Itihaj", icon: <History className="h-4.5 w-4.5" />, href: "/vocabulary/stories" },
  { id: 11, name: "Resource", icon: <FolderOpen className="h-4.5 w-4.5" />, href: "#" },
  { id: 12, name: "আন্তর্জাতিক বিষয়", icon: <Globe className="h-4.5 w-4.5" />, href: "#" },
  { id: 13, name: "লিডারবোর্ড", icon: <Trophy className="h-4.5 w-4.5" />, href: "#" },
  { id: 14, name: "সিলেবাস গাইড", icon: <Map className="h-4.5 w-4.5" />, href: "#" }

];

export default function HeroSection() {
  const [isPsychologyModalOpen, setIsPsychologyModalOpen] = useState(false);

  return (
    <div className="relative bg-gray-50 py-1">

      {/* আপনার মেইন আসল UI লেআউট */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 sm:py-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

          {/* Left Column: Top AI Tools Sidebar */}
          <div className="order-2 lg:order-1 lg:col-span-1 flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 mb-6">
                <Zap className="h-5 w-5 fill-amber-500 stroke-amber-500 animate-pulse" />
                <h2 className="text-lg font-extrabold text-primary">টপ Study টুলস</h2>
              </div>

              {/* Menu List */}
              <div className="grid grid-cols-2 grid-rows-7 grid-flow-col gap-1.5">
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
          <div className="order-1 lg:order-2 lg:col-span-2 flex flex-col gap-4">
            <HeroCarousel />
            <div className="hidden lg:grid grid-cols-2 gap-3 md:gap-4">
              <Link
                href="/question-bank"
                className="group relative flex flex-col items-center gap-3 rounded-3xl border border-gray-100 bg-gradient-to-r from-blue-700 to-indigo-700 px-3 py-4 text-center text-white shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:px-5 md:py-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 transition-colors group-hover:bg-white/20 md:h-12 md:w-12">
                  <BookOpen className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-sm font-extrabold leading-tight md:text-lg">Question Bank</h3>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
              </Link>
              <Link
                href="/central-model-tests"
                className="group relative flex flex-col items-center gap-3 rounded-3xl border border-gray-100 bg-gradient-to-r from-blue-700 to-indigo-700 px-3 py-4 text-center text-white shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:px-5 md:py-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 transition-colors group-hover:bg-white/20 md:h-12 md:w-12">
                  <BarChart3 className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-sm font-extrabold leading-tight md:text-lg">Mock Test</h3>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 md:h-5 md:w-5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* কুইক ক্যাটাগরি ক্লাউড ট্যাগ রো — হিরো স্লাইডারের নিচে */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href="#" className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs md:text-sm font-bold text-gray-700 shadow-sm hover:shadow hover:border-accent hover:text-accent transition-all active:scale-95">
            HSC
          </Link>
          <Link href="#" className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs md:text-sm font-bold text-gray-700 shadow-sm hover:shadow hover:border-accent hover:text-accent transition-all active:scale-95">
            Admission Test
          </Link>
          <Link href="#" className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs md:text-sm font-bold text-gray-700 shadow-sm hover:shadow hover:border-accent hover:text-accent transition-all active:scale-95">
            SSC
          </Link>
          <Link href="/psychology-test-bangla" className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1.5 text-xs md:text-sm font-bold text-white shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95 flex items-center gap-1">
            <span>🧠</span>
            <span>মানসিক স্বাস্থ্য পরীক্ষা</span>
          </Link>
          <Link href="/vocabulary/stories" className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs md:text-sm font-bold from-amber-400 to-yellow-600 text-gray-700 shadow-sm hover:shadow hover:border-accent hover:text-accent transition-all active:scale-95">
            Vocabulary Story
          </Link>
          <Link href="#" className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs md:text-sm font-bold text-gray-700 shadow-sm hover:shadow hover:border-accent hover:text-accent transition-all active:scale-95">
            Learn by Fun
          </Link>
          <Link href="/vocabulary" className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1.5 text-xs md:text-sm font-bold text-white shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95 flex items-center gap-1">
            <span>🔠</span>
            <span>ভোকাবুলারি ভাণ্ডার</span>
          </Link>
          <Link href="#" className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs md:text-sm font-bold text-gray-700 shadow-sm hover:shadow hover:border-accent hover:text-accent transition-all active:scale-95">
            School
          </Link>
          <Link href="#" className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs md:text-sm font-bold text-gray-700 shadow-sm hover:shadow hover:border-accent hover:text-accent transition-all active:scale-95">
            Madrasha
          </Link>
          <Link href="#" className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs md:text-sm font-bold text-gray-700 shadow-sm hover:shadow hover:border-accent hover:text-accent transition-all active:scale-95">
            Muslim Day
          </Link>
          <Link href="#" className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs md:text-sm font-bold text-gray-700 shadow-sm hover:shadow hover:border-accent hover:text-accent transition-all active:scale-95">
            Smart English Zone
          </Link>
          <Link href="#" className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs md:text-sm font-bold text-gray-700 shadow-sm hover:shadow hover:border-accent hover:text-accent transition-all active:scale-95">
            Parents Zone
          </Link>
          <Link href="#" className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs md:text-sm font-bold text-gray-700 shadow-sm hover:shadow hover:border-accent hover:text-accent transition-all active:scale-95">
            SparkEduKids
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