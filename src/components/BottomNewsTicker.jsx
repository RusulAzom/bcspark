"use client";

import { Flame } from "lucide-react";
import januaryData from "@/data/history/january.json";
import februaryData from "@/data/history/february.json";
import marchData from "@/data/history/march.json";
import aprilData from "@/data/history/april.json";
import mayData from "@/data/history/may.json";
import juneData from "@/data/history/june.json";
import julyData from "@/data/history/july.json";
import augustData from "@/data/history/august.json";
import septemberData from "@/data/history/september.json";
import octoberData from "@/data/history/october.json";
import novemberData from "@/data/history/november.json";
import decemberData from "@/data/history/december.json";
import todayInHistoryData from "@/data/today_in_history.json";

const newsItems = (() => {
  const today = new Date();
  const monthKey = today.toLocaleString("en-US", { month: "long" }).toLowerCase();
  const dayKey = String(today.getDate());
  const monthDataMap = {
    january: januaryData,
    february: februaryData,
    march: marchData,
    april: aprilData,
    may: mayData,
    june: juneData,
    july: julyData,
    august: augustData,
    september: septemberData,
    october: octoberData,
    november: novemberData,
    december: decemberData
  };
  const currentMonthData = monthDataMap[monthKey] || julyData;
  const todayData = currentMonthData[dayKey] || currentMonthData["16"] || { events: [], birthdays: [], deaths: [] };
  const items = [];
  (todayData.events || []).forEach((ev) => {
    if (ev.marquee_text) items.push(ev.marquee_text);
  });
  (todayData.birthdays || []).forEach((b) => {
    if (b.marquee_text) items.push(b.marquee_text);
  });
  (todayData.deaths || []).forEach((d) => {
    if (d.marquee_text) items.push(d.marquee_text);
  });

  // Merge marquee texts from the global today_in_history.json source
  // (structure: { [month]: { [day]: { events, birthdays, deaths } } })
  const globalMonthData = todayInHistoryData[monthKey];
  const globalTodayData =
    (globalMonthData && (globalMonthData[dayKey] || globalMonthData["16"])) ||
    { events: [], birthdays: [], deaths: [] };
  (globalTodayData.events || []).forEach((ev) => {
    if (ev.marquee_text) items.push(ev.marquee_text);
  });
  (globalTodayData.birthdays || []).forEach((b) => {
    if (b.marquee_text) items.push(b.marquee_text);
  });
  (globalTodayData.deaths || []).forEach((d) => {
    if (d.marquee_text) items.push(d.marquee_text);
  });

  return items.length ? items : ["আজকের ঐতিহাসিক ঘটনা এখনও যোগ করা হয়নি।"];
})();

const marqueeText = newsItems.join(" ⚡ ");
const marqueeDuration = Math.max(12, marqueeText.length / 18);

export default function BottomNewsTicker() {
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
