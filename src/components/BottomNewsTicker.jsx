"use client";

import { Flame } from "lucide-react";
import { useTodayHistory } from "@/components/TodayHistoryProvider";

function getFallbackItems() {
  return ["আজকের ঐতিহাসিক ঘটনা এখনও যোগ করা হয়নি।"];
}

export default function BottomNewsTicker() {
  const { data: todayHistory, isLoading } = useTodayHistory();
  const newsItems = todayHistory?.tickerItems?.length
    ? todayHistory.tickerItems
    : isLoading
      ? ["আজকের ঐতিহাসিক ঘটনা লোড হচ্ছে..."]
      : getFallbackItems();
  const marqueeText = newsItems.join(" ⚡ ");
  const marqueeDuration = Math.max(12, marqueeText.length / 18);
  // Duplicate the array to create a seamless infinite scrolling effect
  const doubleItems = [...newsItems, ...newsItems];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-10 w-full items-center border-t border-blue-950 bg-[#15294a] shadow-[0_-4px_10px_rgba(0,0,0,0.1)] overflow-hidden font-bengali">
      
      {/* Left fixed badge: "ইতিহাস" */}
      <div className="relative z-20 flex h-full items-center gap-1.5 bg-accent px-2 sm:px-3 w-fit font-extrabold text-primary shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
        <Flame className="h-4 w-4 fill-primary stroke-primary animate-pulse" />
          <span className="text-xs sm:text-sm tracking-wide whitespace-nowrap">ইতিহাজ</span>
      </div>

      {/* Right Marquee Container */}
      <div className="relative flex flex-1 h-full items-center overflow-hidden">
        <div className="animate-marquee flex items-center gap-16 py-1 whitespace-nowrap text-white text-xs sm:text-sm font-medium" style={{ animationDuration: `${marqueeDuration}s` }}>
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
