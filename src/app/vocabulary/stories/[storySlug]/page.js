import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VoTale from '@/components/vocabulary/VoTale';
import Link from 'next/link';
import { getStories, getStoryBySlug } from '@/lib/vocabStories';

/**
 * Pre-render every story at build time so each shareable URL
 * (/vocabulary/stories/day-1-s001, ...) loads natively & fast.
 */
export function generateStaticParams() {
  return getStories().map((story) => ({ storySlug: story.slug }));
}

/**
 * SEO: page title & meta description update dynamically per story slug.
 */
export async function generateMetadata({ params }) {
  const { storySlug } = await params;
  const story = getStoryBySlug(storySlug);

  if (!story) {
    return {
      title: 'Story Not Found - BCS Spark',
      description: 'The vocabulary story you are looking for does not exist.',
    };
  }

  const plainTitle = story.title.replace(/\p{Extended_Pictographic}/gu, '').trim();

  return {
    title: `Day ${story.day}: ${plainTitle} | Vocabulary Stories - BCS Spark`,
    description: `${story.hook} — ${plainTitle}. Learn English vocabulary through this Bangla story with ${story.wordsUsed?.length || 0} exam words, meanings and a mini quiz on BCS Spark.`,
  };
}

export default async function VoTaleStoryPage({ params }) {
  const { storySlug } = await params;
  const story = getStoryBySlug(storySlug);

  if (!story) notFound();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-1">
              <Link
                href="/vocabulary/stories"
                className="text-xs text-slate-400 hover:text-[#1E53C5] transition-colors mr-1"
              >
                ← All Stories
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0B1B4F]">
                Vocabulary Stories
              </h1>
              <span className="text-xs bg-gradient-to-r from-[#F35E1B]/15 to-[#F9B816]/15 text-[#F35E1B] border border-[#F35E1B]/25 px-2.5 py-0.5 rounded-full font-medium">
                VoTale
              </span>
            </div>
          </div>
        </div>

        {/* The deep-linked story, loaded natively for social sharing */}
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          <VoTale initialStory={story} showPrevNext />
        </div>
      </div>
      <Footer />
    </>
  );
}