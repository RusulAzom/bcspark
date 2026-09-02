'use client';

import { useState, useRef, useCallback } from 'react';

/**
 * Story list with a "See All Stories" expand/collapse toggle.
 * Shows the first 5 cards (Day 1–5) by default; expanding reveals the
 * full list smoothly and scrolls it into view.
 */
export default function StoriesList({ stories }) {
  const [showAll, setShowAll] = useState(false);
  const expandedRef = useRef(null);

  const INITIAL_COUNT = 5;

  const handleToggle = useCallback(() => {
    setShowAll((prev) => {
      const next = !prev;
      if (next) {
        // Wait for the expanded cards to mount, then smoothly bring the
        // newly revealed stories into view.
        requestAnimationFrame(() => {
          setTimeout(() => {
            expandedRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }, 50);
        });
      }
      return next;
    });
  }, []);

  return (
    <div>
      {/* Always-visible cards: Day 1–5 by default, all when expanded */}
      <div className="space-y-2">
        {stories.slice(0, INITIAL_COUNT).map((story) => (
          <a
            key={story.slug}
            href={`/vocabulary/stories/${story.slug}`}
            className="w-full flex items-center gap-2 text-left px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-[#1E53C5]/30 hover:bg-[#1E53C5]/5 transition-all text-sm font-medium text-slate-700"
          >
            <span className="shrink-0 inline-flex items-center bg-white border border-slate-200 text-[10px] font-bold text-[#1E53C5] rounded-full px-2 py-0.5">
              Day {story.day}
            </span>
            <span className="truncate">
              {story.coverEmoji} {story.title}
            </span>
          </a>
        ))}
      </div>

      {/* Newly revealed cards (Day 6+) mount here when expanded */}
      {showAll && stories.length > INITIAL_COUNT && (
        <div ref={expandedRef} className="space-y-2 pt-2">
          {stories.slice(INITIAL_COUNT).map((story) => (
            <a
              key={story.slug}
              href={`/vocabulary/stories/${story.slug}`}
              className="w-full flex items-center gap-2 text-left px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-[#1E53C5]/30 hover:bg-[#1E53C5]/5 transition-all text-sm font-medium text-slate-700"
            >
              <span className="shrink-0 inline-flex items-center bg-white border border-slate-200 text-[10px] font-bold text-[#1E53C5] rounded-full px-2 py-0.5">
                Day {story.day}
              </span>
              <span className="truncate">
                {story.coverEmoji} {story.title}
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Toggle button — placed directly after the 5th story card */}
      {stories.length > INITIAL_COUNT && (
        <div className="pt-3">
          <button
            onClick={handleToggle}
            className="w-full py-3 bg-gradient-to-r from-[#1E53C5] to-[#2a6bdf] text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-md shadow-[#1E53C5]/20 active:scale-[0.99]"
          >
            {showAll
              ? 'কম গল্প দেখুন (Show Less)'
              : `See All Stories (${stories.length}) · সব গল্প দেখুন`}
            <span className="ml-2 inline-block">{showAll ? '▲' : '▼'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
