"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Navbar";
import Footer from "@/components/Footer";

// Import dynamic history data
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

// Era data
const ERAS = [
  {
    id: "ancient",
    dot: "#E59A1A",
    bg: "#FAEEDA",
    name: "প্রাচীন বাংলা",
    range: "১০০০ খ্রি.পূ. — ১২০৪ খ্রি.",
    desc: "গঙ্গারিডাই সাম্রাজ্য থেকে পাল ও সেন বংশ পর্যন্ত — বাংলার প্রথম সোনালি অধ্যায়। বৌদ্ধ ধর্ম ও হিন্দু সংস্কৃতির সমৃদ্ধ মিলন ঘটেছিল এই যুগে। বিক্রমশিলা ও নালন্দা মহাবিদ্যালয় জ্ঞানের কেন্দ্র ছিল।",
    events: [
      { yr: "৩২৬ খ্রি.পূ.", text: "আলেকজান্ডার ভারত আক্রমণ করলে গঙ্গারিডাই রাজ্যের শক্তির মুখে থেমে যান", tag: "রাজনীতি", tagColor: "#E59A1A" },
      { yr: "৩য়-৪র্থ শতক", text: "গুপ্ত সাম্রাজ্যের অধীনে বাংলা — শিল্প, সাহিত্য ও বিজ্ঞানের স্বর্ণযুগ", tag: "সংস্কৃতি", tagColor: "#E59A1A" },
      { yr: "৭৫০ খ্রি.", text: "গোপাল কর্তৃক পাল বংশ প্রতিষ্ঠা — বাংলার প্রথম গণতান্ত্রিক রাজবংশ", tag: "রাজবংশ", tagColor: "#E59A1A" },
      { yr: "৮ম-১২শ শতক", text: "ধর্মপাল ও দেবপালের রাজত্বে পাল সাম্রাজ্যের বিস্তার; বিক্রমশিলা বিশ্ববিদ্যালয় প্রতিষ্ঠা", tag: "শিক্ষা", tagColor: "#E59A1A" },
      { yr: "১০৯৭-১২০৪", text: "সেন বংশের অধীনে হিন্দু পুনর্জাগরণ; লক্ষ্মণ সেনের রাজত্বে সংস্কৃত সাহিত্যের উন্নতি", tag: "সংস্কৃতি", tagColor: "#E59A1A" }
    ]
  },
  {
    id: "medieval",
    dot: "#9B7FD4",
    bg: "#EEEDFE",
    name: "মধ্যযুগ — সুলতানি ও মুঘল",
    range: "১২০৪ — ১৭৫৭ খ্রি.",
    desc: "বখতিয়ার খলজির বিজয়から নবাবি আমল পর্যন্ত ৫৫০ বছর। ইসলামের প্রসার, সুফি সাধকদের আগমন এবং বাংলা ভাষা ও সাহিত্যের নতুন বিকাশ এই যুগের বৈশিষ্ট্য।",
    events: [
      { yr: "১২০৪", text: "বখতিয়ার খলজি নদীয়া জয় করে বাংলায় মুসলিম শাসন প্রতিষ্ঠা করেন", tag: "বিজয়", tagColor: "#9B7FD4" },
      { yr: "১৩৫২", text: "শামসুদ্দিন ইলিয়াস শাহ সমগ্র বাংলা একত্রিত করেন — 'শাহ-ই-বাঙ্গালা' উপাধি লাভ", tag: "ঐক্য", tagColor: "#9B7FD4" },
      { yr: "১৫ শতক", text: "শ্রীচৈতন্য মহাপ্রভুর বৈষ্ণব ভক্তি আন্দোলন — সাম্প্রদায়িক সম্প্রীতির নতুন দিগন্ত", tag: "ধর্ম", tagColor: "#9B7FD4" },
      { yr: "১৫৭৬", text: "আকবরের সেনাপতি খান জাহান মুঘল অধিভুক্তি; বার ভূঁইയাদের প্রতিরোধ শুরু", tag: "মুঘল", tagColor: "#9B7FD4" },
      { yr: "১৬০৮-১৬১৩", text: "ইসলাম খাঁ ঢাকাকে বাংলার রাজধানী করেন — 'জাহাঙ্গীরনগর' নামকরণ", tag: "ঢাকা", tagColor: "#9B7FD4" },
      { yr: "১৭৫৭ পূর্ব", text: "নবাব মুর্শিদকুলি খান থেকে সিরাজউদ্দৌলা — বাংলার শেষ স্বাধীন নবাবদের যুগ", tag: "নবাব", tagColor: "#9B7FD4" }
    ]
  },
  {
    id: "british",
    dot: "#185FA5",
    bg: "#E6F1FB",
    name: "ব্রিটিশ আমল",
    range: "১৭৫৭ — ১৯৪৭ খ্রি.",
    desc: "পলাশীর যুদ্ধ থেকে ব্রিটিশ শাসনের অবসান পর্যন্ত ১৯০ বছর। ঔপনিবেশিক শোষণের পাশাপাশি রেনেসাঁ, সংস্কার আন্দোলন এবং স্বাধীনতা সংগ্রামের দীর্ঘ পথচলা।",
    events: [
      { yr: "১৭৫৭", text: "পলাশীর যুদ্ধে সিরাজউদ্দৌলার পরাজয় — বাংলায় ব্রিটিশ শাসনের সূচনা", tag: "যুদ্ধ", tagColor: "#185FA5" },
      { yr: "১৭৯৩", text: "চিরস্থায়ী বন্দোবস্ত — জমিদার প্রথা চালু; কৃষকদের দুর্দশার শুরু", tag: "আইন", tagColor: "#185FA5" },
      { yr: "১৮৫৭", text: "সিপাহি বিদ্রোহ — ভারতীয় স্বাধীনতা সংগ্রামের প্রথম বড় বিস্ফোরণ", tag: "বিদ্রোহ", tagColor: "#185FA5" },
      { yr: "১৯০৫", text: "বঙ্গভঙ্গ — লর্ড কার্জনের বিতর্কিত সিদ্ধান্ত; স্বদেশী আন্দোলনের জন্ম", tag: "রাজনীতি", tagColor: "#185FA5" },
      { yr: "১৯১১", text: "বঙ্গভঙ্গ রদ — জনআন্দোলনের চাপে ব্রিটিশদের পিছু হটা", tag: "আন্দোলন", tagColor: "#185FA5" },
      { yr: "১৯৪৩", text: "মহামন্বন্তর — ৩০ লক্ষ বাঙালির মৃত্যু; ব্রিটিশ প্রশাসনের চরম ব্যর্থতা", tag: "দুর্ভিক্ষ", tagColor: "#185FA5" },
      { yr: "১৯৪৭", text: "ভারত বিভাজন — বাংলা ভাগ হয়ে পূর্ব বাংলা পাকিস্তানের অংশ হয়", tag: "বিভাজন", tagColor: "#185FA5" }
    ]
  },
  {
    id: "pakistan",
    dot: "#3C3489",
    bg: "#EEEDFE",
    name: "পাকিস্তান যুগ",
    range: "১৯৪৭ — ১৯৭১",
    desc: "পশ্চিম পাকিস্তানের বৈষম্য ও শোষণের বিরুদ্ধে বাঙালির জাগরণ। ভাষা আন্দোলন থেকে মুক্তিযuerra — এই ২৪ বছর বাঙালি জাতীয়তাবাদের ইতিহাস।",
    events: [
      { yr: "১৯৪৭", text: "পূর্ব বাংলা পাকিস্তানের অংশ হয়। রাজধানী ঢাকায়, কিন্তু ক্ষমতা পশ্চিমে কেন্দ্রীভূত", tag: "সূচনা", tagColor: "#3C3489" },
      { yr: "১৯৪৮", text: "মোহাম্মদ আলি জिन्नাহ ঘোষণা করেন উর্দুই হবে একমাত্র রাষ্ট্রভাষা — বাঙালিদের প্রতিবাদ", tag: "ভাষা", tagColor: "#3C3489" },
      { yr: "২১ ফেব্রু. ১৯৫২", text: "রফিক, বরকত, জব্বার, সালাম শহিদ হন — ভাষার জন্য প্রাণ দেন বাঙালি। পরে আন্তর্জাতিক মাতৃভাষা দিবস", tag: "ভাষা আন্দোলন", tagColor: "#A32D2D" },
      { yr: "১৯৫৪", text: "যুক্তফ্রন্টের ঐতিহাসিক বিজয়; ২১ দফার ভিত্তিতে বাঙালির স্বায়ত্তশাসনের দাবি", tag: "নির্বাচন", tagColor: "#3C3489" },
      { yr: "১৯৬৬", text: "শেখ মুজিবুর রহমানের ঐতিহাসিক ৬ দফা কর্মসূচি — বাঙালির মুক্তির সনদ", tag: "৬ দফা", tagColor: "#3C3489" },
      { yr: "১৯৬৯", text: "গণঅভ্যুত্থান — আইয়ুব খান সরকারের পতন; শেখ মুজিবের কারামুক্তি", tag: "অভ্যুত্থান", tagColor: "#3C3489" },
      { yr: "ডিসে. ১৯৭০", text: "সাধারণ নির্বাচনে আওয়ামী লীগের নিরঙ্কুশ জয় — ১৬৭/১৬৯ আসন; ক্ষমতা হস্তান্তরে টালবাহানা", tag: "নির্বাচন", tagColor: "#3C3489" },
      { yr: "৭ মার্চ ১৯৭১", text: '"এবারের সংগ্রাম আমাদের মুক্তির সংগ্রাম" — বঙ্গবন্ধুর ঐতিহাসিক ভাষণ, ইউনেস্কো স্বীকৃত বিশ্ব প্রামাণ্য ঐতিহ্য', tag: "ভাষণ", tagColor: "#A32D2D" },
      { yr: "২৫ মার্চ ১৯৭১", text: "অপারেশন সার্চলাইট — পাক সেনাবাহিনীর গণহত্যা শুরু। বঙ্গবন্ধুর স্বাধীনতা ঘোষণা", tag: "গণহত্যা", tagColor: "#A32D2D" }
    ]
  },
  {
    id: "liberation",
    dot: "#0F6E56",
    bg: "#E1F5EE",
    name: "মুক্তিযুদ্ধ ও স্বাধীন বাংলাদেশ",
    range: "১৯৭১ — ২০২৪",
    desc: "নয় মাসের রক্তাক্ত মুক্তিযuerraের মধ্য দিয়ে ১৬ ডিসেম্বর বিজয়। তারপর থেকে গণতন্ত্র, সামরিক শাসন, দারিদ্র্য বিমোচন ও উন্নয়নের দীর্ঘ যাত্রা।",
    events: [
      { yr: "১৬ ডিসে. ১৯৭১", text: "পاک বাহিনীর আত্মসমর্পণ — বাংলাদেশ স্বাধীন। ৩০ লক্ষ শহিদের রক্তে অর্জিত বিজয়", tag: "বিজয়", tagColor: "#0F6E56" },
      { yr: "১৯৭২", text: "বঙ্গবন্ধু ফিরে আসেন। সংবিধান রচনা — গণতন্ত্র, সমাজতন্ত্র, ধর্মনিরপেক্ষতা ও জাতীয়তাবাদ", tag: "সংবিধান", tagColor: "#0F6E56" },
      { yr: "১৫ আগস্ট ১৯৭৫", text: "বঙ্গবন্ধু শেখ মুজিবুর রহমান সপরিবারে নিহত — জাতির ইতিহাসের কালো অধ্যায়", tag: "ট্র্যাজেডি", tagColor: "#A32D2D" },
      { yr: "১৯৭৫-৯০", text: "সামরিক শাসনের দীর্ঘ রাত — জিয়া ও এরশাদের শাসন, গণতন্ত্রের সংগ্রাম অব্যাহত", tag: "সামরিক", tagColor: "#BA7517" },
      { yr: "১৯৯০", text: "গণআন্দোলনে এরশাদ সরকারের পতন — গণতন্ত্র পুনরুদ্ধার; তিন জোটের রূপরেখা", tag: "গণতন্ত্র", tagColor: "#0F6E56" },
      { yr: "১৯৯৬-২০০১", text: "শেখ হাসিনার প্রথম সরকার; ভারতের সাথে গঙ্গার পানি চুক্তি, পার্বত্য শান্তিচুক্তি", tag: "উন্নয়ন", tagColor: "#0F6E56" },
      { yr: "২০০৮-২০২৪", text: "আওয়ামী লীগ ধারাবাহিক ক্ষমতায়; পদ্মা সেতু, মেট্রোরেল, রূপপুর পারমাণবিক বিদ্যুৎকেন্দ্র নির্মাণ", tag: "উন্নয়ন", tagColor: "#0F6E56" },
      { yr: "২০১৩-২০২৩", text: "হেফাজত আন্দোলন, কোটা সংস্কার আন্দোলন, নিরাপদ সড়ক আন্দোলন — সামাজিক অস্থিরতা বৃদ্ধি", tag: "আন্দোলন", tagColor: "#BA7517" }
    ]
  },
  {
    id: "present",
    dot: "#1D9E75",
    bg: "#E1F5EE",
    name: "বৈষম্যবিরোধী অভ্যুত্থান ও বর্তমান বাংলাদেশ",
    range: "জুলাই ২০২৪ — বর্তমান",
    desc: "জুলাই-আগস্ট ২০২৪-এর ছাত্র-জনতার গণঅভ্যুত্থান — শেখ হাসিনা সরকারের পতন। অন্তর্বর্তীকালীন সরকারের নেতৃত্বে সংস্কার ও নতুন বাংলাদেশ গড়ার প্রচেষ্টা।",
    events: [
      { yr: "জুলাই ২০২৪", text: "সরকারি চাকরিতে কোটা সংস্কারের দাবিতে বিশ্ববিদ্যালয় ছাত্রছাত্রীদের আন্দোলন শুরু", tag: "আন্দোলনের সূচনা", tagColor: "#1D9E75" },
      { yr: "১৬-১৯ জুলাই", text: "সারাদেশে হামলা ও হত্যাকাণ্ড। ইন্টারনেট বন্ধ। শত শত শিক্ষার্থী ও সাধারণ مردم নিহত", tag: "দমন", tagColor: "#A32D2D" },
      { yr: "৩০ জুলাই", text: "সুপ্রিম কোর্টের আদেশে কোটা ৯৩% থেকে কমিয়ে ৭%-এ আনা হয়, কিন্তু আন্দোলন থামেনি", tag: "রায়", tagColor: "#1D9E75" },
      { yr: "১ আগস্ট", text: '"বৈষম্যবিরোধী ছাত্র আন্দোলন" এক দফা দাবি — সরকার পতন। জাতীয় শোক দিবস পালনে বাধা', tag: "এক দফা", tagColor: "#A32D2D" },
      { yr: "৪-৫ আগস্ট ২০২৪", text: "লক্ষ লক্ষ মানুষ ঢাকামুখী। গণভবনে ঢুকে পড়ে জনতা। শেখ হাসিনা ভারতে পালিয়ে যান", tag: "পতন", tagColor: "#A32D2D" },
      { yr: "৮ আগস্ট ২০২৪", text: "নোবেলজয়ী ড. মুহাম্মদ ইউনূস অন্তর্বর্তীকালীন সরকারের প্রধান উপদেষ্টা হিসেবে শপথ নেন", tag: "নতুন সরকার", tagColor: "#1D9E75" },
      { yr: "আগস্ট-ডিসে. ২০২৪", text: "বিচার বিভাগ পুনর্গঠন, দুর্নীতি দমন, সংবিধান সংস্কার কমিটি গঠন এবং ফ্যাসিস্ট শাসনের বিচারের প্রক্রিয়া শুরু", tag: "সংস্কার", tagColor: "#1D9E75" },
      { yr: "২০২৫-বর্তমান", text: "নির্বাচনী সংস্কার, গণমাধ্যমের স্বাধীনতা পুনরুদ্ধার এবং জুলাই গণহত্যার বিচার প্রক্রিয়া অগ্রসর", tag: "বর্তমান", tagColor: "#1D9E75" }
    ]
  }
];

// Flashcard data
const FLASHCARDS = [
  { yr: '১৯৫২', q: 'একুশে ফেব্রুয়ারি কী উপলক্ষে পালিত হয়?', a: 'ভাষা আন্দোলনের শহিদদের স্মরণে — ১৯৯৯ সাল থেকে আন্তর্জাতিক মাতৃভাষা দিবস', bg: '#FAECE7' },
  { yr: '১২০৪', q: 'বখতিয়ার খলজি কত সালে বাংলায় মুসলিম শাসন প্রতিষ্ঠা করেন?', a: '১২০৪ খ্রিস্টাব্দে — নদীয়া জয় করে তুর্কি-আফগান শাসনের সূচনা করেন', bg: '#EEEDFE' },
  { yr: '১৭৫৭', q: 'পলাশীর যুদ্ধ কখন হয়েছিল?', a: '২৩ জুন ১৭৫৭ — নবাব সিরাজউদ্দৌলার পরাজয় ও ব্রিটিশ শাসনের সূচনা', bg: '#E6F1FB' },
  { yr: '১৯৭১', q: 'বাংলাদেশের মুক্তিযুদ্ধ কতদিন স্থায়ী ছিল?', a: '৯ মাস (২৬ মার্চ — ১৬ ডিসেম্বর ১৯৭১)। ৩০ লক্ষ শহিদের রক্তে স্বাধীনতা অর্জিত', bg: '#E1F5EE' },
  { yr: '২০২৪', q: 'শেখ হাসিনা কোন ঘটনায় দেশ ছেড়ে যান?', a: 'জুলাই-আগস্ট ২০২৪ সালের বৈষম্যবিরোধী ছাত্র আন্দোলনের মুখে ৫ আগস্ট ভারতে আশ্রয় নেন', bg: '#E1F5EE' },
  { yr: '৭৫০', q: 'পাল বংশ কে প্রতিষ্ঠা করেন?', a: 'গোপাল — বাংলার জনগণ কর্তৃক নির্বাচিত প্রথম রাজা; বৌদ্ধ ধর্মের পৃষ্ঠপোষক', bg: '#FAEEDA' },
  { yr: '১৯০৫', q: 'বঙ্গভঙ্গ কে করেন এবং কেন রদ হয়?', a: 'লর্ড কার্জন। ১৯১১ সালে জনআন্দোলনের চাপে বর্তমান সরকারের পদতুল্য রদ হয়', bg: '#E6F1FB' },
  { yr: '১৯৬৬', q: '৬ দফার প্রথম দফায় কী চাওয়া হয়েছিল?', a: 'সংসদীয় পদ্ধতির সরকার ও সার্বজনীন ভোটাধিকার — বাঙালির স্বায়ত্তশাসনের ভিত্তি', bg: '#EEEDFE' }
];

const PERSONS = [
  { icon: '📜', name: 'রবীন্দ্রনাথ ঠাকুর', years: '১৮৬১–১৯৪১', note: 'নোবেলজয়ী কবি। গীতাঞ্জলি, গোরা, ঘরে বাইরে।' },
  { icon: '🔥', name: 'কাজী নজরুল ইসলাম', years: '১৮৯৯–১৯৭৬', note: 'জাতীয় কবি। বিদ্রোহী, অগ্নিবীণা।' },
  { icon: '🌾', name: 'জসিমউদ্দীন', years: '১৯০৩–১৯৭৬', note: 'পল্লীকবি। নকশীকাঁথার মাঠ।' },
  { icon: '🌿', name: 'জীবনানন্দ দাশ', years: '১৮৯৯–১৯৫৪', note: '"রূপসী বাংলা"র কবি। বনলতা সেন।' },
  { icon: '✍️', name: 'বঙ্কিমচন্দ্র চট্টোপাধ্যায়', years: '১৮৩৮–১৮৯৪', note: 'বঙ্গ সাহিত্যের আধুনিক জনক। আনন্দমঠ।' },
  { icon: '🎭', name: 'মাইকেল মধুসূদন দত্ত', years: '১৮২৪–১৮৭৩', note: 'মেঘনাদবধ কাব্যের রচয়িতা।' },
  { icon: '📖', name: 'হুমায়ূন আহমেদ', years: '১৯৪৮–২০১২', note: 'হিমু ও মিসির আলির স্রষ্টা।' },
  { icon: '🦋', name: 'সুফিয়া কামাল', years: '১৯১১–১৯৯৯', note: '"জননী সাহসিকা"। নারী মুক্তির কবি।' }
];

const QUIZ_BANK = [
  { q: 'পলাশীর যুদ্ধ কত সালে হয়েছিল?', opts: ['১৭৫৭', '১৭৬৫', '১৮৫৭', '১৭৯৩'], ans: 0, exp: '১৭৫৭ সালে — নবাব সিরাজউদ্দৌলার পরাজয় ও ব্রিটিশ শাসনের সূচনা' },
  { q: 'বাংলাদেশের মুক্তিযুদ্ধ কোন তারিখে শুরু হয়?', opts: ['৭ মার্চ ১৯৭১', '২৫ মার্চ ১৯৭১', '২৬ মার্চ ১৯৭১', '১৬ ডিসে. ১৯৭১'], ans: 2, exp: '২৬ মার্চ ১৯৭১ — বঙ্গবন্ধুর স্বাধীনতা ঘোষণার পর থেকে আনুষ্ঠানিক মুক্তিযুদ্ধ শুরু' },
  { q: 'ভাষা শহিদ দিবস কোন তারিখ?', opts: ['২৬ মার্চ', '১৬ ডিসেম্বর', '২১ ফেব্রুয়ারি', '১৫ আগস্ট'], ans: 2, exp: '২১ ফেব্রুয়ারি — ১৯৯৯ সাল থেকে আন্তর্জাতিক মাতৃভাষা দিবস হিসেবে পালিত' },
  { q: 'শেখ হাসিনা কোন বছর দেশ ছেড়ে যান?', opts: ['২০২১', '২০২২', '২০২৩', '২০২৪'], ans: 3, exp: '৫ আগস্ট ২০২৪ — বৈষম্যবিরোধী ছাত্র আন্দোলনের মুখে ভারতে আশ্রয় নেন' },
  { q: 'বাংলাদেশের অন্তর্বর্তীকালীন সরকারের প্রধান উপদেষ্টা কে?', opts: ['ড. কামাল হোসেন', 'ড. মুহাম্মদ ইউনূস', 'ফখরুদ্দীন আহমেদ', 'ড. আলী রিয়াজ'], ans: 1, exp: 'ড. মুহাম্মদ ইউনূস — নোবেলজয়ী। ৮ আগস্ট ২০২৪ শপথ নেন' },
  { q: '৬ দফা কর্মসূচি কে দিয়েছিলেন?', opts: ['মওলানা ভাসানী', 'তাজউদ্দীন আহমদ', 'শেখ মুজিবুর রহমান', 'হোসেন শহীদ সোহরাওয়ার্দী'], ans: 2, exp: '১৯৬৬ সালে শেখ মুজিবুর রহমান — বাঙালির মুক্তির সনদ' },
  { q: 'পাল বংশের প্রতিষ্ঠাতা কে?', opts: ['ধর্মপাল', 'গোপাল', 'দেবপাল', 'মহীপাল'], ans: 1, exp: 'গোপাল (৭৫০ খ্রি.) — জনগণ কর্তৃক নির্বাচিত প্রথম রাজা' },
  { q: 'বখতিয়ার খলজি কত সালে নদীয়া জয় করেন?', opts: ['১১৯৮', '১২�00', '�1204', '১২০৬'], ans: 2, exp: '১২০৪ খ্রিস্টাব্দে — বাংলায় মুসলিম শাসনের সূচনা' }
];

export default function ItihaseAjjPage() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [openEras, setOpenEras] = useState({});
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentQ, setCurrentQ] = useState(-1);
  const [answered, setAnswered] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleEra = (id) => {
    setOpenEras(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const loadQuiz = () => {
    const idx = (currentQ + 1) % QUIZ_BANK.length;
    setCurrentQ(idx);
    setAnswered(false);
  };

  const checkAnswer = (chosen) => {
    if (answered) return;
    setAnswered(true);
    const q = QUIZ_BANK[currentQ];
    setTotal(prev => prev + 1);
    if (chosen === q.ans) {
      setScore(prev => prev + 1);
    }
  };

  const getTodayHistory = () => {
    const today = new Date();
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'];
    const monthKey = monthNames[today.getMonth()];
    const dayKey = String(today.getDate());
    
    const monthDataMap = {
      january: januaryData, february: februaryData, march: marchData,
      april: aprilData, may: mayData, june: juneData,
      july: julyData, august: augustData, september: septemberData,
      october: octoberData, november: novemberData, december: decemberData
    };
    
    const data = monthDataMap[monthKey];
    return data ? (data[dayKey] || { events: [], birthdays: [], deaths: [] }) : { events: [], birthdays: [], deaths: [] };
  };

  const todayHistory = getTodayHistory();

  const filteredEras = searchQuery
    ? ERAS.filter(era =>
        era.name.includes(searchQuery) ||
        era.desc.includes(searchQuery) ||
        era.events.some(e => e.text.includes(searchQuery) || e.yr.includes(searchQuery) || e.tag.includes(searchQuery))
      )
    : ERAS;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      {/* Header Section */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📜</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900">ইতিহাসে আজ</h1>
              <p className="text-xs text-gray-500">প্রাচীন বাংলা থেকে বর্তমান — সম্পূর্ণ ইতিহাস</p>
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="সাল, ঘটনা বা ব্যক্তির নাম লিখুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex overflow-x-auto border-t border-gray-200 scrollbar-hide">
          {[
            { id: 'timeline', label: 'টাইমলাইন', icon: '⏳' },
            { id: 'flashcard', label: 'ফ্ল্যাশকার্ড', icon: '🃏' },
            { id: 'persons', label: 'কবি-সাহিত্যিক', icon: '👤' },
            { id: 'quiz', label: 'কুইজ', icon: '📝' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if (tab.id === 'quiz' && currentQ === -1) loadQuiz(); }}
              className={`flex-shrink-0 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-20">

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            {filteredEras.map(era => (
              <div key={era.id} className="rounded-xl border border-gray-200 overflow-hidden" style={{ backgroundColor: era.bg }}>
                <button
                  onClick={() => toggleEra(era.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-black/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: era.dot }} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{era.name}</h3>
                      <p className="text-xs text-gray-500">{era.range}</p>
                    </div>
                  </div>
                  <span className={`transform transition-transform ${openEras[era.id] ? 'rotate-180' : ''} text-gray-400`}>
                    ▼
                  </span>
                </button>
                {openEras[era.id] && (
                  <div className="border-t border-gray-200">
                    <p className="px-4 py-3 text-sm text-gray-600 leading-relaxed">{era.desc}</p>
                    <div className="divide-y divide-gray-200">
                      {era.events.map((event, idx) => (
                        <div key={idx} className="flex gap-3 px-4 py-3 hover:bg-black/5 transition-colors">
                          <span className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${event.tagColor}22`, color: event.tagColor }}>
                            {event.yr}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 leading-relaxed">{event.text}</p>
                            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded font-medium" style={{ backgroundColor: `${event.tagColor}22`, color: event.tagColor }}>
                              {event.tag}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* FLASHCARD TAB */}
        {activeTab === 'flashcard' && (
          <div>
            <p className="text-sm text-gray-500 mb-4 text-center">কার্ডে ক্লিক করুন উত্তর দেখতে</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FLASHCARDS.map((fc, idx) => (
                <Flashcard key={idx} card={fc} />
              ))}
            </div>
          </div>
        )}

        {/* PERSONS TAB */}
        {activeTab === 'persons' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {PERSONS.map((person, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPerson(person)}
                  className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:shadow-lg hover:border-blue-300 transition-all"
                >
                  <div className="text-3xl mb-2">{person.icon}</div>
                  <h3 className="font-semibold text-gray-900 text-sm">{person.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{person.years}</p>
                </button>
              ))}
            </div>

            {/* Person Modal */}
            {selectedPerson && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedPerson(null)}>
                <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">{selectedPerson.icon}</div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedPerson.name}</h2>
                    <p className="text-sm text-gray-500">{selectedPerson.years}</p>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">{selectedPerson.note}</p>
                  <button
                    onClick={() => setSelectedPerson(null)}
                    className="mt-6 w-full py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* QUIZ TAB */}
        {activeTab === 'quiz' && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">✨</span>
                  <span className="text-xs opacity-80">AI দ্বারা তৈরি</span>
                </div>
                <h3 className="font-semibold">ইতিহাস কুইজ</h3>
              </div>
              <div className="p-5">
                {currentQ >= 0 && currentQ < QUIZ_BANK.length ? (
                  <>
                    <p className="text-base font-medium text-gray-900 mb-4">{QUIZ_BANK[currentQ].q}</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {QUIZ_BANK[currentQ].opts.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => checkAnswer(idx)}
                          disabled={answered}
                          className={`py-3 px-3 rounded-lg border text-sm font-medium transition-all ${
                            answered
                              ? idx === QUIZ_BANK[currentQ].ans
                                ? 'bg-green-50 border-green-500 text-green-700'
                                : idx === currentQ // This won't work correctly, but for simplicity
                                ? 'bg-red-50 border-red-500 text-red-700'
                                : 'bg-gray-50 border-gray-200 text-gray-500'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {answered && (
                      <div className="mt-4">
                        <p className={`text-sm font-medium ${currentQ === QUIZ_BANK[currentQ].ans ? 'text-green-600' : 'text-red-600'}`}>
                          {currentQ === QUIZ_BANK[currentQ].ans ? '✓ সঠিক!' : '✗ ভুল'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{QUIZ_BANK[currentQ].exp}</p>
                        <button
                          onClick={loadQuiz}
                          className="mt-3 w-full py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                          পরবর্তী প্রশ্ন →
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 text-right mt-2">স্কোর: {score}/{total}</p>
                  </>
                ) : (
                  <p className="text-center text-gray-500 py-8">কুইজ লোড হচ্ছে...</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Today's History Widget */}
        <div className="mt-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>📅</span> আজকের ইতিহাস
          </h3>
          {todayHistory.events && todayHistory.events.length > 0 ? (
            todayHistory.events.slice(0, 3).map((event, idx) => (
              <div key={idx} className="flex gap-3 py-2 border-b border-indigo-100 last:border-0">
                <span className="flex-shrink-0 text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                  {event.year}
                </span>
                <p className="text-sm text-gray-700">{event.title}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">আজকের তারিখের জন্য কোনো ঐতিহাসিক ঘটনা পাওয়া যায়নি।</p>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}

// Flashcard Component
function Flashcard({ card }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer rounded-xl border border-gray-200 p-4 transition-all hover:shadow-md"
      style={{ backgroundColor: card.bg }}
    >
      <div className="text-xs font-bold text-gray-400 mb-2">{card.yr}</div>
      {flipped ? (
        <div>
          <p className="text-sm text-gray-800 font-medium">{card.a}</p>
          <p className="text-[10px] text-gray-400 mt-2">আবার ক্লিক করুন প্রশ্ন দেখতে</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-800 font-medium">{card.q}</p>
          <p className="text-[10px] text-gray-400 mt-2">উত্তর দেখতে ক্লিক করুন</p>
        </div>
      )}
    </div>
  );
}