'use client';

import VoTale from './VoTale';

export default function VocabStories() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-[#1E53C5]/5 border border-[#1E53C5]/15 rounded-full px-4 py-1.5">
          <span className="w-2 h-2 bg-[#1E53C5] rounded-full animate-pulse" />
          <span className="text-sm font-medium text-[#1E53C5]">
            Story Mode
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[#0B1B4F]">
          Vocabulary Stories (VoTale)
        </h2>
        <p className="text-sm text-slate-500">
          Learn vocabulary through engaging narrative stories — hover or click highlighted words to see meanings
        </p>
      </div>

      {/* VoTale Component */}
      <VoTale />
    </div>
  );
}
