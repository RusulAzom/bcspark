// Server Component layout for the /psychology-test-bangla route segment.
// Exports `metadata` (not allowed in the "use client" page) so Next.js
// can inject the <title>, <meta>, and canonical <link> into <head>.
export const metadata = {
  title: "মানসিক স্বাস্থ্য পরীক্ষা | Psychology Test Bangla — BCSpark",
  description:
    "BCSpark-এ করুন বিনামূল্যে অনলাইন মানসিক চিকিৎসা ও টেস্ট। উদ্বেগ ও দুশ্চিন্তা পরীক্ষা, ডিপ্রেশন টেস্ট বাংলা, সম্পর্কের টানাপোড়েন ও মানসিক চাপ, পড়াশোনায় ক্লান্তি ও বার্নআউট — সবকিছু এক জায়গায়। Scientific Mental Health Assessment.",
  keywords:
    "মানসিক স্বাস্থ্য পরীক্ষা, Psychology Test Bangla, অনলাইন মানসিক চিকিৎসা ও টেস্ট, উদ্বেগ ও দুশ্চিন্তা পরীক্ষা, ডিপ্রেশন টেস্ট বাংলা, সম্পর্কের টানাপোড়েন ও মানসিক চাপ, পড়াশোনায় ক্লান্তি ও বার্নআউট, Scientific Mental Health Assessment, বাংলা সাইকোলজি টেস্ট, GAD-7 and DASS-21 Bangla",
  robots: "index, follow",
  alternates: {
    canonical: "https://bcspark.bd/psychology-test-bangla",
  },
  openGraph: {
    title: "মানসিক স্বাস্থ্য পরীক্ষা | Psychology Test Bangla",
    description:
      "বাংলাদেশের প্রথম AI-চালিত প্ল্যাটফর্মে বিনামূল্যে আপনার মানসিক স্বাস্থ্য যাচাই করুন। GAD-7, BAI, HAM-A, RAS সহ সব সাইকোলজি টেস্ট বাংলায়।",
    url: "https://bcspark.bd/psychology-test-bangla",
    type: "website",
  },
};

export default function PsychologyTestBanglaLayout({ children }) {
  return children;
}