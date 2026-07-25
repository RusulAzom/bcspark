'use client';

import Navbar from '@/components/Navbar';
import AdBanner728 from '@/components/add/adstra/AdBanner728';
import NativeBanner from '@/components/add/adstra/NativeBanner';
import SocialBar from '@/components/add/adstra/SocialBar';

import Footer from '@/components/Footer';
import VoTale from '@/components/vocabulary/VoTale';
import Link from 'next/link';

export default function VoTalePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white">
          {/* adds 728 */}
          <AdBanner728 />
          {/* 🎯 Social Bar Ad Script */}
          <SocialBar />
          
          {/* <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-1">
              <Link
                href="/vocabulary"
                className="text-xs text-slate-400 hover:text-[#1E53C5] transition-colors mr-1"
              >
                ← Back to Hub
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-[#0B1B4F]">
                Vocabulary Stories
              </h1>
              <span className="text-xs bg-gradient-to-r from-[#F35E1B]/15 to-[#F9B816]/15 text-[#F35E1B] border border-[#F35E1B]/25 px-2.5 py-0.5 rounded-full font-medium">
                VoTale
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Learn vocabulary through engaging narrative stories — hover or click highlighted words to see meanings
            </p>
          </div> */}
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <VoTale />
        </div>
         {/* 🎯 tEst কন্টেন্টের নিচে Native Banner */}
          <NativeBanner />
      </div>
      <Footer />
    </>
  );
}