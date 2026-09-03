// src/app/blog/[slug]/loading.tsx
// Streaming fallback for the single-article route. While a newly published /
// uncached slug is rendered on demand (ISR), this boundary lets Next stream the
// shell immediately instead of holding the request open until the DB settles —
// which is what previously turned a slow Firestore read into a 500 on Vercel.
import { Loader2 } from "lucide-react";

export default function BlogPostLoading() {
  return (
    <main className="min-h-screen bg-brand-bg">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
          <p className="text-sm text-gray-500 font-medium">ব্লগটি লোড হচ্ছে...</p>
        </div>
      </div>
    </main>
  );
}