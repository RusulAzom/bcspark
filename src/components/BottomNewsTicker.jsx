"use client";

import { Flame } from "lucide-react";

const newsItems = [
  "আজকের এই দিনে ১৮৮৫ সালে লুই পাস্তুর সফলভাবে প্রথম জলাতঙ্ক রোগের টিকা আবিষ্কার করেন",
  "আজকের এই দিনে ১৯৪৪ সালে নেতাজি সুভাষচন্দ্র বসু মহাত্মা গান্ধীকে প্রথমবার 'জাতির জনক' উপাধিতে ভূষিত করেন",
  "আজকে ৬ জুলাই, ১৯৫৩ সালে রাজশাহী বিশ্ববিদ্যালয় প্রতিষ্ঠা লাভ করে",
  "আজকের এই দিনে ১৮২৭ সালে লন্ডনের চুক্তি স্বাক্ষরিত হয়, যা গ্রিসের স্বাধীনতার পথ সুগম করে",
  "আজকের এই দিনে ১৯১৮ সালে প্রখ্যাত ভারতীয় চিত্রশিল্পী হেমেন্দ্রনাথ মজুমদার জন্মগ্রহণ করেন"
];

export default function BottomNewsTicker() {
  // Duplicate the array to create a seamless infinite scrolling effect
  const doubleItems = [...newsItems, ...newsItems];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-10 w-full items-center border-t border-blue-950 bg-[#15294a] shadow-[0_-4px_10px_rgba(0,0,0,0.1)] overflow-hidden font-bengali">
      
      {/* Left fixed badge: "আজকের ঘটনা" */}
      <div className="relative z-20 flex h-full items-center gap-2 bg-accent px-5 font-extrabold text-primary shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
        <Flame className="h-4 w-4 fill-primary stroke-primary animate-pulse" />
        <span className="text-xs sm:text-sm tracking-wide whitespace-nowrap">오늘의 Event</span>
        {/* Translate "오늘의 Event" back to Bangla "আজকের ঘটনা" since Bangla text must be 100% same */}
        <span className="absolute inset-0 bg-accent flex items-center justify-center gap-1.5 px-4">
          <Flame className="h-4 w-4 fill-primary stroke-primary animate-pulse" />
          <span className="text-xs sm:text-sm tracking-wide whitespace-nowrap">আজকের ঘটনা</span>
        </span>
      </div>

      {/* Right Marquee Container */}
      <div className="relative flex flex-1 h-full items-center overflow-hidden">
        <div className="animate-marquee flex items-center gap-16 py-1 whitespace-nowrap text-white text-xs sm:text-sm font-medium">
          {doubleItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <span>{item}</span>
              <span className="text-accent text-sm">⚡</span>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
