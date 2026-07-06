"use client";

import { Check } from "lucide-react";

export default function PricingSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Headings */}
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
          তোমার প্ল্যান, তোমার পছন্দ
        </h2>
        <p className="text-base text-gray-600 font-medium max-w-md mx-auto">
          ফ্রি দিয়ে শুরু করো, প্রো তে পাওয়ার নাও
        </p>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
        
        {/* Card 1: FREE */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col justify-between h-[480px] hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">FREE</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-extrabold text-primary">৳০</span>
              <span className="text-base font-normal text-gray-500 ml-1">/মাস</span>
            </div>
            
            <ul className="space-y-4 text-gray-600 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>১০ টি AI টুল</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>ডেইলি T20 কুইজ</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>বেসিক অ্যানালাইটিক্স</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-3 border border-primary text-primary font-bold rounded-lg transition-all hover:bg-primary hover:text-white cursor-pointer active:scale-[0.98]">
            ফ্রি তে শুরু করো
          </button>
        </div>

        {/* Card 2: PRO (Highlighted) */}
        <div className="bg-white border-2 border-accent rounded-2xl p-8 relative shadow-xl md:scale-105 flex flex-col justify-between h-[510px] z-10 hover:shadow-2xl transition-all duration-300">
          {/* Badge */}
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent text-white px-5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide whitespace-nowrap shadow-md">
            সবচেয়ে জনপ্রিয়
          </span>

          <div>
            <h3 className="text-xl font-bold text-primary mb-4 mt-2">PRO</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-extrabold text-primary">৳৯৯</span>
              <span className="text-base font-normal text-gray-500 ml-1">/মাস</span>
            </div>

            <ul className="space-y-4 text-gray-600 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-accent shrink-0" />
                <span className="font-semibold text-gray-800">৪০+ সব টুল আনলক</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-accent shrink-0" />
                <span className="font-semibold text-gray-800">ভুলের খাতা ২.০</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-accent shrink-0" />
                <span className="font-semibold text-gray-800">Study Buddy AI</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-accent shrink-0" />
                <span>প্রায়োরিটি সাপোর্ট</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-accent shrink-0" />
                <span>বিজ্ঞাপন মুক্ত</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-3 bg-accent text-white font-extrabold rounded-lg shadow-lg shadow-amber-500/10 transition-all hover:bg-accent-dark cursor-pointer active:scale-[0.98] mt-4">
            প্রো নাও
          </button>
        </div>

        {/* Card 3: SPARK PREMIUM */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col justify-between h-[480px] hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">SPARK PREMIUM</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-extrabold text-primary">৳২৯৯</span>
              <span className="text-base font-normal text-gray-500 ml-1">/মাস</span>
            </div>

            <ul className="space-y-4 text-gray-600 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>PRO এর সব সুবিধা</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="font-semibold text-gray-800">১:১ AI মেন্টরিং</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>কাস্টম মডেল টেস্ট</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>এক্সক্লুসিভ স্টাডি ম্যাটেরিয়ালস</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>আনলিমিটেড মক এক্সাম</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-3 border border-primary text-primary font-bold rounded-lg transition-all hover:bg-primary hover:text-white cursor-pointer active:scale-[0.98]">
            প্রিমিয়াম নাও
          </button>
        </div>

      </div>
    </section>
  );
}
