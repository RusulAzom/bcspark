'use client';

import { useState, useCallback } from 'react';

export default function SmartMCQ({ questions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentIndex];
  const options = currentQuestion?.options || [];
  const correctIndex = currentQuestion?.ans ?? -1;

  const handleOptionClick = useCallback(
    (optionIndex) => {
      if (isAnswered) return;
      setSelectedOption(optionIndex);
      setIsAnswered(true);
      if (optionIndex === correctIndex) {
        setScore((prev) => prev + 1);
      }
    },
    [isAnswered, correctIndex]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setScore(0);
    }
  }, [currentIndex, questions.length]);

  const getOptionStyle = (optIndex) => {
    if (!isAnswered) {
      return 'border-slate-200 bg-white hover:border-[#1E53C5]/40 hover:bg-slate-50 cursor-pointer shadow-sm';
    }
    if (optIndex === correctIndex) {
      return 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/30';
    }
    if (optIndex === selectedOption && optIndex !== correctIndex) {
      return 'border-red-400 bg-red-50 ring-2 ring-red-400/30';
    }
    return 'border-slate-100 bg-slate-50 opacity-50';
  };

  if (!currentQuestion) {
    return (
      <div className="text-center text-slate-400 py-12">
        No questions available.
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Progress & Score */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-sm font-semibold text-[#1E53C5]">
          Score: {score}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#1E53C5] to-[#1E53C5]/60 rounded-full transition-all duration-500"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-[#0B1B4F] mb-2">
          {currentQuestion.q}
        </h3>
        {isAnswered && currentQuestion.explain && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500 leading-relaxed">
              {currentQuestion.explain}
            </p>
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-3">
        {options.map((option, optIndex) => (
          <button
            key={optIndex}
            onClick={() => handleOptionClick(optIndex)}
            disabled={isAnswered}
            className={`group relative flex items-center p-4 rounded-2xl border transition-all duration-200 ${getOptionStyle(optIndex)}`}
          >
            {/* Option Letter Badge */}
            <span
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mr-4 transition-all duration-200 ${
                isAnswered && optIndex === correctIndex
                  ? 'bg-emerald-500 text-white'
                  : isAnswered && optIndex === selectedOption
                  ? 'bg-red-400 text-white'
                  : 'bg-slate-100 text-slate-500 group-hover:bg-[#1E53C5]/10 group-hover:text-[#1E53C5]'
              }`}
            >
              {String.fromCharCode(65 + optIndex)}
            </span>

            {/* Option Text */}
            <span className="text-base text-slate-700 text-left leading-relaxed">
              {option}
            </span>

            {/* Status Icon */}
            {isAnswered && optIndex === correctIndex && (
              <span className="ml-auto text-emerald-500 text-xl">✓</span>
            )}
            {isAnswered && optIndex === selectedOption && optIndex !== correctIndex && (
              <span className="ml-auto text-red-400 text-xl">✗</span>
            )}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className={`px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 ${
            isAnswered
              ? 'bg-gradient-to-r from-[#F35E1B] to-[#F9B816] text-white hover:shadow-lg hover:shadow-[#F35E1B]/20 active:scale-95'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
          }`}
        >
          {currentIndex < questions.length - 1 ? 'Next Question →' : 'Restart Quiz'}
        </button>
      </div>
    </div>
  );
}