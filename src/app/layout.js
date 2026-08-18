import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import AdvertisePopup from "@/components/AdvertisePopup";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata = {
  title: "BCS Spark - বাংলাদেশের প্রথম AI-চালিত BCS প্রস্তুতি প্ল্যাটফর্ম",
  description: "BCS Spark হল বাংলাদেশের প্রথম AI-চালিত BCS প্রস্তুতি প্ল্যাটফর্ম। ৪৬তম BCS প্রিলিমিনারি পরীক্ষা সহ সব ধরণের সরকারি চাকরির প্রস্তুতি নিন সহজেই।",
  // bing webmaster verifications
  verification: {
    other: {
      "msvalidate.01": "6210F62E302522A9230705CDAA6F6019",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${hindSiliguri.variable} scroll-smooth`}
    >
      <body suppressHydrationWarning className="bg-brand-bg text-primary min-h-screen flex flex-col font-sans">
        {children}
        <Analytics />
        {/* Global Advertisement Popup - shows 5s after load, once per 24h */}
        <AdvertisePopup />
      </body>
    </html>
  );
}

