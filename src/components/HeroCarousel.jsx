"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Trophy, Newspaper, Zap, BookOpen, Bot } from "lucide-react";

const slides = [
  {
    id: 1,
    badge: "❤️ আমাদের সাপোর্ট করুন",
    title: "একটা ☕কফির দামে প্রজেক্টটা বাঁচিয়ে রাখুন",
    description: "এই প্রজেক্টটা চালাতে সার্ভার, ডোমেইন আর টিমের অনেক খরচ। চাইলে ২০, ৫০, ১২০ টাকা দিয়ে আমাদের সাপোর্ট করতে পারেন। আপনার ১টা সাপোর্ট = আমাদের ১০০টা মোটিভেশন!",
    ctaText: "এখনই সাপোর্ট করুন",
    emoji: "☕",
    link: "https://www.supportkori.com/rasumon",
    centerCta: true,
    bgGradient: "from-indigo-950/90 to-slate-900/95"
  },
  {
    id: 2,
    badge: "📲 কমিউনিটি",
    title: "আমাদের WhatsApp Study Group এ জয়েন করুন",
    description: "অ্যাপের নিয়মিত আপডেট, প্রিমিয়াম PDF, বই এবং সাজেশন একদম ফ্রি পেতে এখনই গ্রুপে জয়েন দিন। একসাথে পড়াশোনা করি, একসাথে সফল হই!",
    ctaText: "গ্রুপে জয়েন করুন",
    emoji: "💬",
    link: "https://chat.whatsapp.com/JW63CMSIlMF4sLnf6bF7g4?s=cl&p=a&ilr=1",
    centerCta: true,
    bgGradient: "from-indigo-900 via-blue-800 to-purple-900"
  },
  {
    id: 12,
    badge: "📢 চাকরির বিজ্ঞপ্তি",
    title: "সকল সরকারি চাকরির সর্বশেষ সার্কুলার (ডেইলি আপডেট)",
    description: "দেশের সকল সরকারি চাকরির সার্কুলার এক জায়গায়। আবেদনের তারিখ, যোগ্যতা ও লিংক সহ প্রতিদিন আপডেট পাও। মিস করো না কোনো সুযোগ!",
    ctaText: "সার্কুলার দেখো",
    emoji: "📢",
    link: "/job-circulars",
    centerCta: true,
    bgGradient: "from-sky-700/90 to-blue-900/95",
  },
  {
    id: 13,
    badge: "📰 কারেন্ট অ্যাফেয়ার্স মিস নাই",
    title: "আজকের BCS নিউজ আপডেট",
    isNews: true,
    newsItems: [
      "বাংলাদেশ সহ আন্তর্জাতিক পরীক্ষার উপযোগী সকল সম্প্রতিক ঘটনা দিন<সপ্তাহ<মাস<বছর ভিত্তিক সাজানো।",
    ],
    ctaText: "আজকের নিউজ দেখো",
    emoji: "📰",
    link: "/current-affairs",
    // bgImage: "/banners/daily-news.png",
    centerCta: true,
    bgGradient: "from-indigo-950/90 to-slate-900/95"
  },
  {
    id: 14,
    badge: "⚡ T20 কুইজ চ্যালেঞ্জ",
    title: "T20 কুইজ চ্যালেঞ্জ",
    description: "প্রতিদিন মাত্র ২০টি প্রশ্নের দ্রুত উত্তর দিয়ে যাচাই করো তোমার প্রস্তুতি। প্রতি সপ্তাহে সেরা ৫ কুইজার পাবেন আকর্ষণীয় স্পেশাল ব্যাজ ও ডিল!",
    ctaText: "কুইজ খেলো",
    emoji: "⚡",
    link: "/t20",
    centerCta: true,
    bgGradient: "from-blue-950 via-[#1a365d] to-[#2b6cb0]"
  },
  {
    id: 15,
    badge: "📖 স্মার্ট রিভিশন",
    title: "ভুলের খাতা ২.০",
    description: "মডেল টেস্টে করা আপনার সকল ভুল প্রশ্ন স্বয়ংক্রিয়ভাবে জমা হবে এখানে। দুর্বল বিষয়গুলোকে চিহ্নিত করে রিভিশন দিন নিমিষেই!",
    ctaText: "ভুলের খাতা দেখো",
    emoji: "📖",
    centerCta: true,
    bgGradient: "from-purple-950 via-[#1a365d] to-[#6b46c1]"
  },
  {
    id: 16,
    badge: "🤖 AI ২৪/৭ মেন্টরিং",
    title: "Study Buddy AI",
    description: "BCS সিলেবাসের যেকোনো কঠিন বিষয় বুঝতে চ্যাট করুন আমাদের পার্সোনাল AI মেন্টরের সাথে। সাথে থাকছে ইন্সট্যান্ট সমাধান ও কাস্টম নোট জেনারেশন।",
    ctaText: "চ্যাট শুরু করো",
    emoji: "🤖",
    centerCta: true,
    bgGradient: "from-teal-950 via-[#1a365d] to-[#319795]"
  },
  {
    id: 17,
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
    id: 18,
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
    id: 19,
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
    id: 20,
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
className="relative h-full min-h-[320px] w-full overflow-hidden rounded-2xl bg-[#0f172a] shadow-xl transition-all sm:min-h-[460px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 flex-col p-4 sm:p-10 
              transition-opacity duration-1000 ease-in-out 
              ${isActive
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
              } 
              ${slide.centerCta ? 'justify-center gap-3 sm:gap-6' : 'justify-between'}`}
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
<span className="inline-block rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold text-accent backdrop-blur-sm border border-white/5 uppercase tracking-wider mb-3 sm:px-4 sm:py-1.5 sm:text-xs sm:mb-6">
                  {slide.badge}
                </span>

<h2 className="text-lg sm:text-4xl font-extrabold text-white tracking-wide leading-tight mb-2 sm:mb-4">
                  {slide.title}
                </h2>

                {/* Body Details */}
                {slide.isNews ? (
<ul className="space-y-2.5 text-slate-200">
                    {slide.newsItems.map((item, idx) => (
<li key={idx} className="flex items-start gap-2.5 text-sm sm:text-lg">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
<p className="text-slate-200 text-sm sm:text-lg leading-relaxed max-w-xl">
                    {slide.description}
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className={`flex items-end mt-6 ${slide.centerCta ? 'justify-center' : 'justify-between'}`}>
{slide.link ? (
                  <Link href={slide.link} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base font-bold transition-all hover:bg-accent-dark hover:-translate-y-0.5 active:translate-y-0">
                    <span>{slide.ctaText}</span>
                    <ChevronRight className="h-4 sm:h-5 w-4 sm:w-5" />
                  </Link>
                ) : (
                  <button className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base font-bold transition-all hover:bg-accent-dark hover:-translate-y-0.5 active:translate-y-0">
                    <span>{slide.ctaText}</span>
                    <ChevronRight className="h-4 sm:h-5 w-4 sm:w-5" />
                  </button>
                )}
              </div>

            </div>
          </div>
        );
      })}

      {/* Pagination Indicators */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 z-20 -translate-x-1/2 flex gap-2">
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
