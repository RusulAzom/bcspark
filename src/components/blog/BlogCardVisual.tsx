// src/components/blog/BlogCardVisual.tsx
"use client";

import { Hind_Siliguri } from 'next/font/google';
import { useMemo } from 'react';

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
});

interface BlogCardVisualProps {
  category: string;
  excerpt: string;
  title?: string;
}

const BG_PALETTE = [
  { bg: "#e0e7ff", dot: "#6366f1", label: "#4f46e5" },
  { bg: "#ede9fe", dot: "#8b5cf6", label: "#7c3aed" },
  { bg: "#fce7f3", dot: "#ec4899", label: "#db2777" },
  { bg: "#dbeafe", dot: "#3b82f6", label: "#2563eb" },
];

export default function BlogCardVisual({ category, excerpt, title }: BlogCardVisualProps) {

  const randomStyle = useMemo(() => {
    const str = (title || excerpt || category);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % BG_PALETTE.length;
    return BG_PALETTE[index];
  }, [title, excerpt, category]);

  let displayText = excerpt?.trim();
  if (!displayText || displayText === "কোনো সংক্ষিপ্ত বিবরণ নেই।" || displayText === "BCSpark Spetial Blog") {
    displayText = title? title : "BCSpark টপ ৬টি ফিচার";
  }
  if (displayText.length > 65) {
    displayText = displayText.substring(0, 65).trim() + "…";
  }

  return (
    <div
      className="w-full h-full min-h- rounded-t-xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden"
      style={{
        backgroundColor: randomStyle.bg,
        backgroundImage: `radial-gradient(circle at 1px 1px, ${randomStyle.dot}18 1.5px, transparent 0)`,
        backgroundSize: '24px 24px'
      }}
    >
      {/* LOGO WATERMARK 30% OPACITY */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0.1 }}
      >
        <img
          src="/logo/BCS_Spark_Logo_icon.png"
          alt="watermark"
          className="w- h- object-contain"
        />
      </div>

      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20" style={{ backgroundColor: randomStyle.dot }} />

      <div className="relative z-10 w-full">
        <span
          className="inline-block text- tracking-[0.1em] uppercase px-3 py-0 rounded-full bg-white/60 backdrop-blur-sm mb-1"
          style={{ color: randomStyle.label }}
        >
          {category}
        </span>

        {/* H2 OPACITY 70% - Image er moto lagbe */}
        <h2
          className={`${hindSiliguri.className} font-bold leading-[1.1] text-slate-900 line-clamp-3 break-words`}
          style={{ fontSize: '38px', opacity: 0.7 }}
        >
          <span style={{ fontSize: '34px', opacity: 0.4 }} className="mr-1">“</span>
          {displayText}
          <span style={{ fontSize: '34px', opacity: 0.4 }} className="ml-1">”</span>
        </h2>
      </div>
    </div>
  );
}