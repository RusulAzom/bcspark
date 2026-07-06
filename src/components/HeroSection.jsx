"use client";

import Link from "next/link";
import { 
  Zap, Target, Cpu, FileText, BarChart3, Newspaper, 
  BookOpen, Calculator, Globe, Trophy, Map, ArrowRight 
} from "lucide-react";
import HeroCarousel from "./HeroCarousel";

const topTools = [
  { id: 1, name: "দৈনিক কুইজ", icon: <Target className="h-4.5 w-4.5" /> },
  { id: 2, name: "AI টিউটর", icon: <Cpu className="h-4.5 w-4.5" /> },
  { id: 3, name: "MCQ প্র্যাকটিস", icon: <FileText className="h-4.5 w-4.5" /> },
  { id: 4, name: "মডেল টেস্ট", icon: <BarChart3 className="h-4.5 w-4.5" /> },
  { id: 5, name: "BCS নিউজ", icon: <Newspaper className="h-4.5 w-4.5" /> },
  { id: 6, name: "বাংলা সাহিত্য", icon: <BookOpen className="h-4.5 w-4.5" /> },
  { id: 7, name: "গণিত প্র্যাকটিস", icon: <Calculator className="h-4.5 w-4.5" /> },
  { id: 8, name: "আন্তর্জাতিক বিষয়", icon: <Globe className="h-4.5 w-4.5" /> },
  { id: 9, name: "লিডারবোর্ড", icon: <Trophy className="h-4.5 w-4.5" /> },
  { id: 10, name: "সিলেবাস গাইড", icon: <Map className="h-4.5 w-4.5" /> }
];

export default function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Top AI Tools Sidebar */}
        <div className="lg:col-span-1 flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <Zap className="h-5 w-5 fill-amber-500 stroke-amber-500 animate-pulse" />
              <h2 className="text-lg font-extrabold text-primary">টপ AI টুলস</h2>
            </div>

            {/* Menu List */}
            <div className="space-y-1.5">
              {topTools.map((tool) => (
                <Link 
                  key={tool.id} 
                  href={`/tools/${tool.id}`}
                  className="flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-blue-50/50 hover:text-primary group"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0f4f8] text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    {tool.icon}
                  </div>
                  <span>{tool.name}</span>
                </Link>
              ))}
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
        <div className="lg:col-span-2">
          <HeroCarousel />
        </div>

      </div>
    </section>
  );
}
