// src/psychologyData.js

export const psychologyCategories = [
  {
    id: "cat_anxiety",
    nameBN: "উদ্বেগ ও অস্থিরতা",
    nameEN: "Anxiety & Panic",
    description: "পরীক্ষার আগের মানসিক অস্থিরতা, অতিরিক্ত চিন্তা এবং প্যানিক হওয়া পরিমাপের টেস্ট।"
  },
  {
    id: "cat_burnout",
    nameBN: "অ্যাকাডেমিক বার্নআউট (পড়াশোনার ক্লান্তি)",
    nameEN: "Academic Burnout",
    description: "দীর্ঘদিন একটানা পড়াশোনার ফলে তৈরি হওয়া চরম মানসিক ক্লান্তি ও অনীহা পরিমাপের টেস্ট।"
  }
];

export const psychologyTests = {
  GAD7: {
    id: "GAD7",
    parentId: "cat_anxiety",
    name: "Generalized Anxiety Disorder (GAD-7)",
    totalQuestions: 7,
    source: "Spitzer, R. L., et al. (2006). A brief measure for assessing generalized anxiety disorder. Archives of Internal Medicine.",
    localResearch: "Dhira, T. A., et al. (2021). Validated among university students of Bangladesh for measuring academic stress and anxiety.",
    description: "এটি একটি আন্তর্জাতিকভাবে স্বীকৃত বৈজ্ঞানিক টেস্ট। প্রতিযোগিতামূলক পরীক্ষার প্রস্তুতি নেওয়ার সময় শিক্ষার্থীদের মনের ভেতরের অতিরিক্ত দুশ্চিন্তা, নার্ভাসনেস এবং অস্থিরতার লেভেল জানতে এই টেস্টটি অত্যন্ত কার্যকরী।",
    options: [
      { text: "একদমই না (Not at all)", value: 0 },
      { text: "বেশ কয়েকদিন (Several days)", value: 1 },
      { text: "অর্ধেক বা তার বেশি দিন (More than half the days)", value: 2 },
      { text: "প্রায় প্রতিদিনই (Nearly every day)", value: 3 }
    ],
    questions: [
      { id: "gad7_q1", text: "আপনি কি প্রায়ই নার্ভাস বোধ করেন, দুশ্চিন্তা করেন বা অস্থির থাকেন?" },
      { id: "gad7_q2", text: "আপনি কি নিজের দুশ্চিন্তা বা উদ্বেগ নিয়ন্ত্রণ বা বন্ধ করতে পারেন না?" },
      { id: "gad7_q3", text: "বিভিন্ন বিষয় নিয়ে আপনি কি প্রয়োজনের চেয়ে অতিরিক্ত চিন্তা করেন?" },
      { id: "gad7_q4", text: "আপনার কি শান্ত বা শিথিল হতে (Relax করতে) খুব কষ্ট হয়?" },
      { id: "gad7_q5", text: "আপনি কি এতটাই অস্থির থাকেন যে এক জায়গায় শান্ত হয়ে বসে থাকা কঠিন হয়ে পড়ে?" },
      { id: "gad7_q6", text: "আপনি কি সহজেই বিরক্ত বা খিটখিটে হয়ে পড়েন?" },
      { id: "gad7_q7", text: "আপনার মনে কি এমন ভয় কাজ করে যে খারাপ কিছু একটা ঘটতে চলেছে?" }
    ],
    scoring: [
      { min: 0, max: 4, status: "Minimal Anxiety (ন্যূনতম উদ্বেগ)", color: "green", suggestion: "আপনার উদ্বেগের মাত্রা একদম স্বাভাবিক। বিসিএস বা পরীক্ষার পড়াশোনার পাশাপাশি নিজের এই মানসিক ব্যালেন্স ধরে রাখুন।" },
      { min: 5, max: 9, status: "Mild Anxiety (মৃদু উদ্বেগ)", color: "blue", suggestion: "আপনার মধ্যে কিছুটা মৃদু উদ্বেগ রয়েছে। পরীক্ষার চাপ বা অতিরিক্ত পড়ার কারণে এটি হতে পারে। পর্যাপ্ত ঘুমান ও পড়ার মাঝে ছোট বিরতি নিন।" },
      { min: 10, max: 14, status: "Moderate Anxiety (মাঝারি উদ্বেগ - সতর্ক সংকেত)", color: "orange", suggestion: "আপনার উদ্বেগের মাত্রা মাঝারি পর্যায়ে রয়েছে। এটি আপনার পড়াশোনায় ব্যাঘাত ঘটাতে পারে। প্রয়োজনে একজন ভালো কাউন্সেলরের পরামর্শ নিন।" },
      { min: 15, max: 21, status: "Severe Anxiety (তীব্র উদ্বেগ - জরুরি)", color: "red", suggestion: "আপনার উদ্বেগের মাত্রা অনেক বেশি। এটি অবহেলা করলে আপনার পরীক্ষার পারফর্ম্যান্স মারাত্মকভাবে ক্ষতিগ্রস্ত হতে পারে। দ্রুত বিশেষজ্ঞের সাহায্য নিন।" }
    ]
  }
};