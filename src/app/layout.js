import { Hind_Siliguri } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import AdvertisePopup from "@/components/AdvertisePopup";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

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
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
        <Toaster richColors position="top-center" />
        {/* Global Advertisement Popup - shows 5s after load, once per 24h */}
        <AdvertisePopup />

        {/* SupportKori Floating Widget — lazyOnload so it never blocks initial page load / Core Web Vitals */}
        <Script
          data-color="#FF8A00"
          data-id="rasumon"
          data-message="একটা কফি খাওয়ান! "
          data-position="right"
          src="https://www.supportkori.com/widget.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

