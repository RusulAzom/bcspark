import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata = {
  title: "BCS Spark - বাংলাদেশের প্রথম AI-চালিত BCS প্রস্তুতি প্ল্যাটফর্ম",
  description: "BCS Spark হল বাংলাদেশের প্রথম AI-চালিত BCS প্রস্তুতি প্ল্যাটফর্ম। ৪৬তম BCS প্রিলিমিনারি পরীক্ষা সহ সব ধরণের সরকারি চাকরির প্রস্তুতি নিন সহজেই।",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} scroll-smooth`}
    >
      <body className="bg-brand-bg text-primary min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}

