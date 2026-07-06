"use client";

import { Zap, Users, Star, Clock } from "lucide-react";

export default function CtaAndStats() {
  const statsList = [
    { value: "৮৫,০০০+", label: "সক্রিয় পরীক্ষার্থী" },
    { value: "৪০+", label: "AI টুলস" },
    { value: "২,৫০,০০০+", label: "প্রশ্ন ব্যাংক" },
    { value: "৯৪%", label: "সাফল্যের হার" }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 font-bengali">
      
      {/* 1. Stats Banner Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm mb-12 hover:shadow-md transition-shadow">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y-2 md:divide-y-0 md:divide-x-2 divide-gray-100/60">
          {statsList.map((stat, idx) => (
            <div 
              key={idx} 
              className={`text-center flex flex-col justify-center ${
                idx > 1 ? "pt-6 md:pt-0" : ""
              } ${
                idx === 1 ? "pt-6 sm:pt-0" : ""
              }`}
            >
              <p className="text-3xl sm:text-4xl font-extrabold text-primary mb-1 sm:mb-2">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 font-bold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. CTA Banner Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#1a365d] via-[#1a4b8c] to-[#1e5aa8] p-8 sm:p-12 text-center text-white overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
        
        {/* Subtle decorative background circles */}
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
          
          {/* Subtitle Accent */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4.5 py-1 text-xs sm:text-sm font-bold text-accent backdrop-blur-sm">
            <Zap className="h-4 w-4 fill-accent stroke-accent" />
            <span>আজই শুরু করুন</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-wide leading-tight">
            BCS জার্নি শুরু করো আজই
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-blue-100/90 font-medium">
            ফ্রি সাইনআপ • ক্রেডিট কার্ড লাগবে না
          </p>

          {/* Center Button */}
          <div className="pt-2 flex justify-center">
            <button className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-base sm:text-lg font-extrabold text-primary shadow-lg shadow-amber-500/20 transition-all hover:bg-accent-dark hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
              <span>ফ্রি অ্যাকাউন্ট খোলো</span>
              <Zap className="h-5 w-5 fill-primary stroke-primary" />
            </button>
          </div>

          {/* Bottom stats row */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-6 border-t border-white/10 text-xs sm:text-sm text-blue-100 font-bold">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" />
              <span>৮৫,০০০+ পরীক্ষার্থী</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent fill-accent" />
              <span>৪.৯/৫ রেটিং</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              <span>২৪/৭ সাপোর্ট</span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
