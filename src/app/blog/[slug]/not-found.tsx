// src/app/blog/[slug]/not-found.tsx
// Rendered by notFound() when a blog slug resolves to no published post.
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogNotFound() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 px-4 font-sans">
        <h1 className="text-2xl font-bold text-gray-900">ব্লগটি পাওয়া যায়নি</h1>
        <p className="mt-2 text-gray-600 text-center">
          আপনি যে ব্লগ পোস্টটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা ইউআরএল ভুল।
        </p>
        <Link
          href="/blog"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow"
        >
          <ArrowLeft className="h-4 w-4" />
          সব ব্লগে ফিরে যান
        </Link>
      </div>
      <Footer />
    </>
  );
}
