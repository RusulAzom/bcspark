"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Trophy, Newspaper, Zap, BookOpen, Bot } from "lucide-react";

const slides = [
  {
    id: 1,
    badge: "🏆 মাসিক পুরস্কার ১০,০০০ টাকা",
    title: "লিডারবোর্ডে ওঠো টপ ১০০ এ",
    description: "প্রতিদিনের টেস্ট ও কুইজে অংশ নিয়ে পয়েন্ট অর্জন করো। টপ ১০০ জনের জন্য রয়েছে আকর্ষণীয় ক্যাশ রিওয়ার্ড ও গিফট হ্যাম্পার!",
    ctaText: "র্যাঙ্ক দেখো",
    emoji: "🏆",
    bgImage: "/banners/leaderboard.png",
    centerCta: true,
    bgGradient: "from-blue-900/90 to-slate-900/95"
  },
  {
    id: 2,
    badge: "📰 কারেন্ট অ্যাফেয়ার্স মিস নাই",
    title: "আজকের BCS নিউজ আপডেট",
    isNews: true,
    newsItems: [
      "৪৬তম BCS প্রিলিমিনারি পরীক্ষার তারিখ ঘোষণা হতে পারে এই সপ্তাহেই",
      "BCS ক্যাডার বরাদ্দে নতুন নিয়ম: জানুন বিস্তারিত",
      "সরকারি চাকরিতে আবেদনের বয়সসীমা বাড়ানোর সুপারিশ সংসদে"
    ],
    ctaText: "নিউজ পড়ো",
    emoji: "📰",
    bgImage: "/banners/daily-news.png",
    centerCta: true,
    bgGradient: "from-indigo-950/90 to-slate-900/95"
  },
  {
    id: 3,
    badge: "⚡ T20 কুইজ চ্যালেঞ্জ",
    title: "T20 কুইজ চ্যালেঞ্জ",
    description: "প্রতিদিন মাত্র ২০টি প্রশ্নের দ্রুত উত্তর দিয়ে যাচাই করো তোমার প্রস্তুতি। প্রতি সপ্তাহে সেরা ৫ কুইজার পাবেন আকর্ষণীয় স্পেশাল ব্যাজ ও ডিল!",
    ctaText: "কুইজ খেলো",
    emoji: "⚡",
    centerCta: true,
    bgGradient: "from-blue-950 via-[#1a365d] to-[#2b6cb0]"
  },
  {
    id: 4,
    badge: "📖 স্মার্ট রিভিশন",
    title: "ভুলের খাতা ২.০",
    description: "মডেল টেস্টে করা আপনার সকল ভুল প্রশ্ন স্বয়ংক্রিয়ভাবে জমা হবে এখানে। দুর্বল বিষয়গুলোকে চিহ্নিত করে রিভিশন দিন নিমিষেই!",
    ctaText: "ভুলের খাতা দেখো",
    emoji: "📖",
    centerCta: true,
    bgGradient: "from-purple-950 via-[#1a365d] to-[#6b46c1]"
  },
  {
    id: 5,
    badge: "🤖 AI ২৪/৭ মেন্টরিং",
    title: "Study Buddy AI",
    description: "BCS সিলেবাসের যেকোনো কঠিন বিষয় বুঝতে চ্যাট করুন আমাদের পার্সোনাল AI মেন্টরের সাথে। সাথে থাকছে ইন্সট্যান্ট সমাধান ও কাস্টম নোট জেনারেশন।",
    ctaText: "চ্যাট শুরু করো",
    emoji: "🤖",
    centerCta: true,
    bgGradient: "from-teal-950 via-[#1a365d] to-[#319795]"
  },
  {
    id: 6,
    badge: "🧠 মানসিক স্বাস্থ্য যাচাই",
    title: "আপনার মানসিক স্বাস্থ্য কেমন আছে?",
    description: "ডিপ্রেশন, দুশ্চিন্তা ও সম্পর্কের টানাপোড়েন পরিমাপ করুন আন্তর্জাতিক বৈজ্ঞানিক স্কেলে—সম্পূর্ণ বিনামূল্যে ও গোপনে।",
    ctaText: "পরীক্ষা শুরু করুন",
    emoji: "🧠",
    link: "/psychology-test-bangla",
    centerCta: true,
    bgGradient: "from-indigo-900 via-blue-800 to-purple-900"
  },
  {
    id: 7,
    badge: "⚡ ভোকাবুলারি হাব",
    title: "BCS ও জব এক্সাম ভোকাবুলারি মাস্টারক্লাস",
    description: "৩০০০+ রিয়েল ডেটা, স্মার্ট MCQ কুইজ এবং ৩ডি ফ্ল্যাশকার্ড গেমের মাধ্যমে আপনার ভোকাবুলারি রিটেনশন বাড়ান ১০০%—সম্পূর্ণ ফ্রি।",
    ctaText: "অনুশীলন শুরু করুন",
    emoji: "📚",
    link: "/vocabulary",
    centerCta: true,
    bgGradient: "from-indigo-900 via-blue-800 to-purple-900"
  },
  {
    id: 9,
    badge: "📝 BCS Question Bank",
    title: "BCS ও সরকারি চাকরির প্রশ্ন ব্যাংক",
    description: "সব ধরনের প্রশ্ন ও সমাধান একসাথে। প্রাক্তন প্রশ্নপত্র থেকে MCQ অনুশীলন করো এবং প্রস্তুতি নিশ্চিত করো।",
    ctaText: "প্রশ্ন ব্যাংক দেখো",
    emoji: "📝",
    link: "/question-bank",
    centerCta: true,
    bgGradient: "from-blue-900 via-indigo-800 to-purple-900"
  },
  {
    id: 8,
    badge: "📖 ভোকাব স্টোরি হাব",
    title: "গল্পে গল্পে BCS ও জব এক্সাম ভোকাবুলারি মাস্টারক্লাস",
    description: "আকর্ষণীয় গল্প, ইন্টারেক্টিভ মিনি-কুইজ এবং ভিজ্যুয়াল মিনিং-এর মাধ্যমে আপনার ভোকাবুলারি রিটেনশন বাড়ান ১০০%—সম্পূর্ণ ফ্রি।",
    ctaText: "গল্প পড়া শুরু করুন",
    emoji: "📖",
    link: "/vocabulary/stories",
    centerCta: true,
    bgGradient: "from-indigo-900 via-blue-800 to-purple-900"
  }
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 5000); // 5 seconds rotation
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  return (
    <div
      className="relative h-full min-h-[460px] w-full overflow-hidden rounded-2xl bg-[#0f172a] shadow-xl transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 flex flex-col p-8 sm:p-10 transition-all duration-700 ease-in-out ${isActive
                ? "opacity-100 translate-x-0 scale-100 z-10"
                : "opacity-0 translate-x-4 scale-95 z-0 pointer-events-none"
              } ${slide.centerCta ? 'justify-center gap-6' : 'justify-between'}`}
          >
            {/* Background Layer */}
            {slide.bgImage ? (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-10000"
                  style={{ backgroundImage: `url('${slide.bgImage}')` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient}`} />
              </>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient}`} />
            )}

            {/* Slide Content */}
            <div className={`relative z-20 flex flex-col h-full ${slide.centerCta ? 'justify-center gap-6' : 'justify-between'}`}>

              {/* Top Badge & Header */}
              <div>
                <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-accent backdrop-blur-sm border border-white/5 uppercase tracking-wider mb-6">
                  {slide.badge}
                </span>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide leading-tight mb-4 flex items-center gap-3">
                  {slide.title}
                </h2>

                {/* Body Details */}
                {slide.isNews ? (
                  <ul className="space-y-3.5 text-slate-200">
                    {slide.newsItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-base sm:text-lg">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl">
                    {slide.description}
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className={`flex items-end mt-6 ${slide.centerCta ? 'justify-center' : 'justify-between'}`}>
                {slide.link ? (
                  <Link href={slide.link} className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-base font-bold text-primary shadow-lg transition-all hover:bg-accent-dark hover:-translate-y-0.5 active:translate-y-0">
                    <span>{slide.ctaText}</span>
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                ) : (
                  <button className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-base font-bold text-primary shadow-lg transition-all hover:bg-accent-dark hover:-translate-y-0.5 active:translate-y-0">
                    <span>{slide.ctaText}</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>

            </div>
          </div>
        );
      })}

      {/* Manual Slide Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-black/40 hover:scale-105 active:scale-95"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-black/40 hover:scale-105 active:scale-95"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Pagination Indicators */}
      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-accent" : "w-2 bg-white/40"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
