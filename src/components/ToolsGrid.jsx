"use client";

import { 
  Target, Brain, FileText, BarChart3, Newspaper, 
  BookOpen, BookOpenCheck, Calculator, Globe, Trophy, Map, 
  Lightbulb, MessageSquare, Award, Bookmark, LineChart, 
  PenTool, Headphones, Video, GraduationCap, Calendar 
} from "lucide-react";
import Link from "next/link";

const toolsList = [
  { id: 1, title: "দৈনিক কুইজ", desc: "প্রতিদিন নতুন প্রশ্ন অনুশীলন", icon: <Target className="h-5 w-5" />, isPro: false },
  { id: 2, title: "AI টিউটর", desc: "ব্যক্তিগত AI শিক্ষক", icon: <Brain className="h-5 w-5" />, isPro: true },
  { id: 3, title: "MCQ প্র্যাকটিস", desc: "বিষয়ভিত্তিক MCQ ব্যাংক", icon: <FileText className="h-5 w-5" />, isPro: false },
  { id: 4, title: "Central মডেল টেস্ট", desc: "পূর্ণ মডেল পরীক্ষা দিন", icon: <BarChart3 className="h-5 w-5" />, isPro: false, href: "/central-model-tests" },
  { id: 5, title: "BCS নিউজ", desc: "সর্বশেষ BCS আপডেট", icon: <Newspaper className="h-5 w-5" />, isPro: false },
  { id: 6, title: "প্রশ্ন ব্যাংক", desc: "BCS ও সরকারি চাকরির প্রশ্ন ব্যাংক", icon: <BookOpen className="h-5 w-5" />, isPro: false, href: "/question-bank" },
  { id: 7, title: "গণিত প্র্যাকটিস", desc: "গণিতের পূর্ণ প্রস্তুতি", icon: <Calculator className="h-5 w-5" />, isPro: true },
  { id: 8, title: "আন্তর্জাতিক বিষয়", desc: "বিশ্ব রাজনীতি ও ভূগোল", icon: <Globe className="h-5 w-5" />, isPro: false },
  { id: 9, title: "লিডারবোর্ড", desc: "শীর্ষ পরীক্ষার্থীদের র‍্যাঙ্কিং", icon: <Trophy className="h-5 w-5" />, isPro: false },
  { id: 10, title: "সিলেবাস গাইড", desc: "BCS সিলেবাসের পূর্ণ ম্যাপ", icon: <Map className="h-5 w-5" />, isPro: false },
  { id: 11, title: "স্মার্ট নোটস", desc: "AI-জেনারেটেড নোটস", icon: <Lightbulb className="h-5 w-5" />, isPro: true },
  { id: 12, title: "কমিউনিটি ফোরাম", desc: "পরীক্ষার্থীদের সাথে আলোচনা", icon: <MessageSquare className="h-5 w-5" />, isPro: false },
  { id: 13, title: "সার্টিফিকেট", desc: "কোর্স সম্পন্নের সার্টিফিকেট", icon: <Award className="h-5 w-5" />, isPro: true },
  { id: 14, title: "বুকমার্ক", desc: "গুরুত্বপূর্ণ প্রশ্ন সংরক্ষণ", icon: <Bookmark className="h-5 w-5" />, isPro: false },
  { id: 15, title: "পারফরম্যান্স ট্র্যাকার", desc: "আপনার অগ্রগতি দেখুন", icon: <LineChart className="h-5 w-5" />, isPro: false },
  { id: 16, title: "রিটেন প্র্যাকটিস", desc: "লিখিত পরীক্ষার প্রস্তুতি", icon: <PenTool className="h-5 w-5" />, isPro: true },
  { id: 17, title: "অডিও লেকচার", desc: "বিশেষজ্ঞদের অডিও ক্লাস", icon: <Headphones className="h-5 w-5" />, isPro: true },
  { id: 18, title: "ভিডিও ক্লাস", desc: "লাইভ ও রেকর্ডেড ক্লাস", icon: <Video className="h-5 w-5" />, isPro: true },
  { id: 19, title: "পূর্ববর্তী প্রশ্ন", desc: "গত ৪০ বছরের প্রশ্নপত্র", icon: <GraduationCap className="h-5 w-5" />, isPro: false },
  { id: 20, title: "স্টাডি প্ল্যান", desc: "কাস্টম স্টাডি রুটিন তৈরি", icon: <Calendar className="h-5 w-5" />, isPro: true },
  { id: 21, title: "কুইক রিভিশন", desc: "স্টাডি কার্ডে প্রশ্ন, উত্তর ও ব্যাখ্যা", icon: <BookOpenCheck className="h-5 w-5" />, isPro: false, href: "/study" }
];

export default function ToolsGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-end justify-between border-b border-gray-100 pb-5 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-1">
            সব টুলস এক জায়গায়
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            40+ AI টুলস দিয়ে BCS এর A to Z কাভার
          </p>
        </div>
        <Link 
          href="/tools" 
          className="text-sm font-bold text-primary transition-colors hover:text-accent flex items-center gap-1 shrink-0"
        >
          সব দেখো &rarr;
        </Link>
      </div>

      {/* Grid: 5 columns desktop, 2 columns mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
        {toolsList.map((tool) => {
          const ToolWrapper = tool.href ? Link : 'div';
          const wrapperProps = tool.href ? { href: tool.href } : {};
          return (
            <ToolWrapper
              key={tool.id}
              {...wrapperProps}
              className="group relative flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-200/60 hover:shadow-md cursor-pointer overflow-hidden"
            >
              {/* PRO Badge top right */}
              {tool.isPro && (
                <span className="absolute top-2.5 right-2.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[8px] font-extrabold text-white uppercase tracking-wider scale-90 group-hover:scale-95 transition-transform">
                  PRO
                </span>
              )}

              {/* Left Circle Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f4f8] text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                {tool.icon}
              </div>

              {/* Right text details */}
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="truncate text-sm font-bold text-primary group-hover:text-primary/90 transition-colors leading-tight">
                  {tool.title}
                </h3>
                <p className="truncate text-[10px] sm:text-xs text-gray-400 group-hover:text-gray-500 transition-colors mt-0.5 font-medium">
                  {tool.desc}
                </p>
              </div>
            </ToolWrapper>
          );
        })}
      </div>
    </section>
  );
}
