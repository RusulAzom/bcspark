'use client';

import { useState, useCallback } from 'react';

export default function Flashcard3D({ questions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = questions[currentIndex];

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [currentIndex, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  if (!currentCard) {
    return (
      <div className="text-center text-slate-400 py-12">
        No flashcards available.
      </div>
    );
  }

  const englishWord = currentCard.q.split(' ')[0];

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      {/* Card Counter */}
      <div className="flex items-center justify-between w-full mb-6">
        <span className="text-sm text-slate-500">
          Card {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-xs text-slate-400">
          Click card to flip
        </span>
      </div>

      {/* 3D Flip Card Container */}
      <div
        className="relative w-full aspect-[3/4] cursor-pointer perspective-[1000px]"
        onClick={handleFlip}
      >
        <div
          className="relative w-full h-full transition-transform duration-700 ease-in-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front Face - English Word */}
          <div
            className="absolute inset-0 rounded-2xl border border-slate-200 bg-white p-8 flex flex-col items-center justify-center shadow-md"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-sm uppercase tracking-widest text-slate-400 mb-6">
              English Word
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1B4F] text-center mb-4">
              {englishWord}
            </h2>
            <div className="mt-auto text-xs text-slate-400">
              Tap to reveal meaning
            </div>
            {/* Decorative corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#1E53C5]/20 rounded-tl" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#1E53C5]/20 rounded-tr" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#1E53C5]/20 rounded-bl" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#1E53C5]/20 rounded-br" />
          </div>

          {/* Back Face - Bengali Meaning */}
          <div
            className="absolute inset-0 rounded-2xl border border-[#F9B816]/30 bg-white p-8 flex flex-col items-center justify-center shadow-md"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="text-sm uppercase tracking-widest text-[#F35E1B] mb-6">
              বাংলা অর্থ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1B4F] text-center mb-4 leading-relaxed">
              {currentCard.options[currentCard.ans]}
            </h2>
            {currentCard.explain && (
              <div className="mt-4 pt-4 border-t border-slate-100 w-full">
                <p className="text-sm text-slate-500 text-center leading-relaxed">
                  {currentCard.explain}
                </p>
              </div>
            )}
            <div className="mt-auto text-xs text-slate-400">
              Tap to flip back
            </div>
            {/* Decorative corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#F35E1B]/20 rounded-tl" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#F35E1B]/20 rounded-tr" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#F35E1B]/20 rounded-bl" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#F35E1B]/20 rounded-br" />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            currentIndex > 0
              ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-[#1E53C5]/30 shadow-sm'
              : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
          }`}
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-[#F35E1B] to-[#F9B816] text-white font-semibold hover:shadow-lg hover:shadow-[#F35E1B]/20 active:scale-95 transition-all duration-200 shadow-sm"
        >
          {currentIndex < questions.length - 1 ? 'Next →' : 'Restart ↻'}
        </button>
      </div>
    </div>
  );
}