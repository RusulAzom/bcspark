import Navbar from '@/components/Navbar';
import VoTale from '@/components/vocabulary/VoTale';
import StoriesList from '@/components/vocabulary/StoriesList';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { getStories } from '@/lib/vocabStories';

export const metadata = {
  title: 'Vocabulary Stories (VoTale) - BCS Spark',
  description:
    'Learn English vocabulary for BCS through engaging Bangla narrative stories — one story every day with word meanings and mini quizzes.',
};

export default function VoTalePage() {
  const stories = getStories();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-1">
              <Link
                href="/vocabulary"
                className="text-xs text-slate-400 hover:text-[#1E53C5] transition-colors mr-1"
              >
                ← Back to Hub
              </Link>
              <h1 className="text-lg md:text-3xl font-bold text-[#0B1B4F]">
                Vocabulary Stories
              </h1>
              <span className="text-xs bg-gradient-to-r from-[#F35E1B]/15 to-[#F9B816]/15 text-[#F35E1B] border border-[#F35E1B]/25 px-2.5 py-0.5 rounded-full font-medium">
                VoTale
              </span>
            </div>
            <p className="text-sm text-slate-500">
              
            </p>
          </div>
        </div>

        {/* Day Tracker — all stories with unique shareable URLs */}
        <div className="max-w-6xl mx-auto px-4 pt-6 sm:pt-8">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-hidden">
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1B4F] mb-1">
                📖 All Stories ({stories.length})
              </h2>
              <p className="text-xs text-slate-400 mb-3">
                One story a day — follow your daily progress
              </p>
              <StoriesList stories={stories} />
            </div>
          </div>
        </div>

        {/* Featured story (first of the day) */}
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          <VoTale />
        </div>
      </div>
      <Footer />
    </>
  );
}