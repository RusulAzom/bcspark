'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import vocaStoriesData from '../../../data/t20/english/grammar/vocabulary/stories/vocastory.json';
import vocaDictData from '../../../data/t20/english/grammar/vocabulary/stories/storyvocabulary.json';

/* ============================================================
   Parser: Extract word tokens from story content
   Supports {{id|text}} and [{{id|text}}] patterns.
   Strips all leftover braces/brackets from display text.
   ============================================================ */
const TOKEN_REGEX = /\[?\{\{([a-z]+\d+)\|([^}]+)\}\}\]?/g;

function parseContent(content) {
  const segments = [];
  let lastIndex = 0;
  let match;

  while ((match = TOKEN_REGEX.exec(content)) !== null) {
    // Push plain text before this token
    if (match.index > lastIndex) {
      segments.push({
        type: 'text',
        value: content.slice(lastIndex, match.index),
      });
    }

    // Sanitize display text: strip any trailing } or ] characters
    const cleanDisplay = match[2].replace(/[}\]]+$/, '').trim();

    segments.push({
      type: 'token',
      id: match[1],
      display: cleanDisplay,
    });

    lastIndex = match.index + match[0].length;
  }

  // Remaining plain text
  if (lastIndex < content.length) {
    segments.push({
      type: 'text',
      value: content.slice(lastIndex),
    });
  }

  return segments;
}

/* ============================================================
   Deduplicate stories array by unique id
   ============================================================ */
function deduplicateStories(stories) {
  const seen = new Set();
  return stories.filter((story) => {
    if (seen.has(story.id)) return false;
    seen.add(story.id);
    return true;
  });
}

/* ============================================================
   Popover / Tooltip Component
   ============================================================ */
function VocabTooltip({ wordData, position, onClose, onMouseEnter, onMouseLeave }) {
  if (!wordData) return null;

  const posColors = {
    noun: 'bg-purple-100 text-purple-700',
    verb: 'bg-blue-100 text-blue-700',
    adjective: 'bg-emerald-100 text-emerald-700',
    adverb: 'bg-amber-100 text-amber-700',
  };

  const posBadge =
    posColors[wordData.pos?.toLowerCase()] || 'bg-slate-100 text-slate-700';

  return (
    <div
      className="fixed z-50 w-72 sm:w-80"
      style={{
        left: Math.min(position.x, window.innerWidth - 320),
        top: position.y + 12,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-red-400 to-rose-400" />

        <div className="p-4 space-y-3">
          {/* Word & POS Row */}
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-bold text-slate-800">
              {wordData.word}
            </h4>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${posBadge}`}
            >
              {wordData.pos}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Bangla Meaning */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Bangla Meaning
            </span>
            <p className="text-base font-medium text-slate-700">
              {wordData.bn_meaning}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
          >
            Click anywhere to close ✕
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Quiz Modal Component
   ============================================================ */
function QuizModal({ story, dictionary, onClose }) {
  const questions = useMemo(() => {
    if (!story?.quizWordIds?.length) return [];

    return story.quizWordIds
      .map((id) => {
        const correctWord = dictionary[id];
        if (!correctWord) return null;

        // Build distractors from other words in the dictionary
        const otherEntries = Object.entries(dictionary).filter(
          ([key]) => key !== id
        );
        const shuffled = otherEntries.sort(() => 0.5 - Math.random());
        const distractors = shuffled.slice(0, 3).map(([, v]) => v.bn_meaning);

        const options = [correctWord.bn_meaning, ...distractors].sort(
          () => 0.5 - Math.random()
        );

        return {
          wordId: id,
          word: correctWord.word,
          correctAnswer: correctWord.bn_meaning,
          options,
        };
      })
      .filter(Boolean);
  }, [story, dictionary]);

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const handleSelect = useCallback(
    (option) => {
      if (selected !== null) return;
      setSelected(option);
      if (option === questions[currentQ].correctAnswer) {
        setScore((s) => s + 1);
      }
    },
    [selected, currentQ, questions]
  );

  const handleNext = useCallback(() => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  }, [currentQ, questions.length]);

  const handleRestart = useCallback(() => {
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
  }, []);

  if (!questions.length) return null;

  const q = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-slate-800">
              {finished ? '🎉 Quiz Complete!' : '📝 Mini Quiz'}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              ✕
            </button>
          </div>
          {!finished && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>
                  Question {currentQ + 1} of {questions.length}
                </span>
                <span>Score: {score}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1E53C5] to-[#F9B816] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {finished ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">
                {score === questions.length
                  ? '🏆'
                  : score >= questions.length / 2
                    ? '👏'
                    : '💪'}
              </div>
              <p className="text-2xl font-bold text-slate-800">
                {score} / {questions.length}
              </p>
              <p className="text-sm text-slate-500">
                {score === questions.length
                  ? 'Perfect! You mastered all the words!'
                  : score >= questions.length / 2
                    ? 'Great job! Keep practicing!'
                    : 'Keep trying, you will get better!'}
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 bg-[#1E53C5] text-white rounded-xl font-medium hover:bg-[#1E53C5]/90 transition-colors"
                >
                  🔄 Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <p className="text-base text-slate-600">
                What is the meaning of{' '}
                <span className="font-bold text-red-600">{q.word}</span>?
              </p>

              <div className="space-y-2">
                {q.options.map((option, idx) => {
                  const isSelected = selected === option;
                  const isCorrect = option === q.correctAnswer;
                  let btnStyle =
                    'border-slate-200 hover:border-[#1E53C5]/40 hover:bg-[#1E53C5]/5';

                  if (selected !== null) {
                    if (isCorrect) {
                      btnStyle =
                        'border-emerald-400 bg-emerald-50 text-emerald-800';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'border-red-400 bg-red-50 text-red-700';
                    } else {
                      btnStyle = 'border-slate-200 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={`${q.wordId}-${idx}`}
                      onClick={() => handleSelect(option)}
                      disabled={selected !== null}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150 font-medium text-sm ${btnStyle}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <button
                  onClick={handleNext}
                  className="w-full py-3 bg-gradient-to-r from-[#1E53C5] to-[#1E53C5] text-white rounded-xl font-semibold hover:brightness-110 transition-all"
                >
                  {currentQ < questions.length - 1
                    ? 'Next Question →'
                    : 'See Results 🎯'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Vocabulary List Tab
   ============================================================ */
function VocabListTab({ wordsUsed, dictionary }) {
  const items = useMemo(
    () =>
      wordsUsed
        .map((id) => ({ id, ...dictionary[id] }))
        .filter((item) => item.word),
    [wordsUsed, dictionary]
  );

  const posColors = {
    noun: 'bg-purple-100 text-purple-700',
    verb: 'bg-blue-100 text-blue-700',
    adjective: 'bg-emerald-100 text-emerald-700',
    adverb: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {items.length} vocabulary words in this story
        </p>
        <span className="text-xs text-slate-400">Click any word to see details</span>
      </div>

      <div className="grid gap-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="group flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-[#1E53C5]/30 hover:shadow-sm transition-all cursor-default"
          >
            {/* Sequential Number — replaces raw ID */}
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-bold text-slate-500 shrink-0">
              {index + 1}
            </span>

            {/* Word */}
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-slate-800 text-sm">
                {item.word}
              </span>
            </div>

            {/* POS Badge */}
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                posColors[item.pos?.toLowerCase()] || 'bg-slate-100 text-slate-700'
              }`}
            >
              {item.pos}
            </span>

            {/* Bangla Meaning */}
            <span className="text-sm text-slate-600 text-right max-w-[200px] truncate shrink-0">
              {item.bn_meaning}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   VoTale — Main Component
   ============================================================ */
export default function VoTale({ storyId: initialStoryId }) {
  // Fix #1: Deduplicate stories by unique id
  const allStories = useMemo(() => deduplicateStories(vocaStoriesData), []);
  const dictionary = useMemo(() => vocaDictData, []);

  // Pick first story as default
  const defaultStory = useMemo(
    () => allStories.find((s) => s.id === initialStoryId) || allStories[0],
    [allStories, initialStoryId]
  );

  const [activeStory, setActiveStory] = useState(defaultStory);
  const [activeTab, setActiveTab] = useState('read');
  const [tooltipWord, setTooltipWord] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showQuiz, setShowQuiz] = useState(false);
  const contentRef = useRef(null);
  const hideTooltipTimer = useRef(null);

  // Fix #3: Track if the user is hovering the tooltip itself
  const [isHoveringTooltip, setIsHoveringTooltip] = useState(false);

  // Track story id changes
  useEffect(() => {
    if (initialStoryId) {
      const found = allStories.find((s) => s.id === initialStoryId);
      if (found) setActiveStory(found);
    }
  }, [initialStoryId, allStories]);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClick = () => {
      if (!isHoveringTooltip) {
        setTooltipWord(null);
      }
    };
    if (tooltipWord) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [tooltipWord, isHoveringTooltip]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hideTooltipTimer.current) clearTimeout(hideTooltipTimer.current);
    };
  }, []);

  const parsedContent = useMemo(
    () => parseContent(activeStory?.content || ''),
    [activeStory]
  );

  const handleWordClick = useCallback(
    (e, id) => {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const wordData = dictionary[id];

      if (tooltipWord?.id === id) {
        setTooltipWord(null);
        return;
      }

      setIsHoveringTooltip(false);
      setTooltipWord({ id, ...wordData });
      setTooltipPos({
        x: rect.left + rect.width / 2,
        y: rect.bottom,
      });
    },
    [dictionary, tooltipWord]
  );

  // Fix #3: Proper mouse enter/leave handlers for closing tooltip on leave
  const handleWordMouseEnter = useCallback(
    (e, id) => {
      if (hideTooltipTimer.current) {
        clearTimeout(hideTooltipTimer.current);
        hideTooltipTimer.current = null;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      const wordData = dictionary[id];
      setIsHoveringTooltip(false);
      setTooltipWord({ id, ...wordData });
      setTooltipPos({
        x: rect.left + rect.width / 2,
        y: rect.bottom,
      });
    },
    [dictionary]
  );

  const handleWordMouseLeave = useCallback(() => {
    // Only close if not hovering the tooltip itself
    hideTooltipTimer.current = setTimeout(() => {
      if (!isHoveringTooltip) {
        setTooltipWord(null);
      }
    }, 150);
  }, [isHoveringTooltip]);

  const handleTooltipMouseEnter = useCallback(() => {
    setIsHoveringTooltip(true);
    if (hideTooltipTimer.current) {
      clearTimeout(hideTooltipTimer.current);
      hideTooltipTimer.current = null;
    }
  }, []);

  const handleTooltipMouseLeave = useCallback(() => {
    setIsHoveringTooltip(false);
    hideTooltipTimer.current = setTimeout(() => {
      setTooltipWord(null);
    }, 200);
  }, []);

  const handleStorySelect = useCallback((story) => {
    setActiveStory(story);
    setActiveTab('read');
    setTooltipWord(null);
    setShowQuiz(false);
  }, []);

  // Fix #1: Use index as fallback for duplicate story keys
  const storySelector = useMemo(
    () =>
      allStories.length > 1 ? (
        <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-thin">
          {allStories.map((story, index) => (
            <button
              key={`${story.id}-${index}`}
              onClick={() => handleStorySelect(story)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeStory.id === story.id
                  ? 'bg-[#1E53C5] text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-[#1E53C5]/30 hover:text-[#1E53C5]'
              }`}
            >
              {story.coverEmoji}{' '}
              {story.title.split(' ').slice(0, 3).join(' ')}
            </button>
          ))}
        </div>
      ) : null,
    [allStories, activeStory.id, handleStorySelect]
  );

  if (!activeStory) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-slate-400">No stories available.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">
      {/* Story Selector (if multiple stories) */}
      {storySelector}

      {/* Main Story Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="relative">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E53C5]/5 via-white to-[#F9B816]/5 rounded-t-3xl" />

          <div className="relative px-6 pt-6 pb-4 sm:px-8 sm:pt-8 sm:pb-5">
            {/* Source badge */}
            <div className="inline-flex items-center gap-1.5 bg-white/80 border border-slate-200 rounded-full px-3 py-1 mb-3">
              <span className="text-xs text-slate-500">
                {activeStory.source}
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="text-xs text-slate-500">
                {activeStory.readingTimeMin} min read
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
              {activeStory.title}
            </h1>

            {/* Hook */}
            <p className="mt-3 text-sm text-slate-500 italic leading-relaxed">
              &ldquo;{activeStory.hook}&rdquo;
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 px-6 sm:px-8">
          <div className="flex gap-0 -mb-px">
            <button
              onClick={() => setActiveTab('read')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === 'read'
                  ? 'border-[#1E53C5] text-[#1E53C5]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              📖 Read Story (গল্পটি পড়ুন)
            </button>
            <button
              onClick={() => setActiveTab('vocab')}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === 'vocab'
                  ? 'border-[#1E53C5] text-[#1E53C5]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              📚 Vocabulary List (শব্দকোষ)
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 sm:px-8 py-6">
          {activeTab === 'read' && (
            <div className="space-y-6">
              {/* Story Content — Fix #4: Increased font size, tightened line-height */}
              <div
                ref={contentRef}
                className="leading-snug text-[18px] text-slate-700 space-y-3"
              >
                {parsedContent.map((segment, idx) => {
                  if (segment.type === 'text') {
                    const parts = segment.value.split(/(\n)/g);
                    return (
                      <span key={`text-${idx}`}>
                        {parts.map((part, i) =>
                          part === '\n' ? <br key={`br-${i}`} /> : part
                        )}
                      </span>
                    );
                  }
                  return (
                    <button
                      key={`token-${segment.id}-${idx}`}
                      onClick={(e) => handleWordClick(e, segment.id)}
                      onMouseEnter={(e) =>
                        handleWordMouseEnter(e, segment.id)
                      }
                      onMouseLeave={handleWordMouseLeave}
                      className="font-bold text-red-600 cursor-pointer underline decoration-dotted underline-offset-4 hover:text-red-700 transition-colors"
                    >
                      {segment.display}
                    </button>
                  );
                })}
              </div>

              {/* Moral */}
              <div className="bg-gradient-to-r from-amber-50 to-amber-50/50 border border-amber-200/60 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0 mt-0.5">💡</span>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">
                      Moral
                    </span>
                    <p className="mt-1 text-sm text-amber-800 leading-relaxed">
                      {activeStory.moral}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              {activeStory.quizWordIds?.length > 0 && (
                <button
                  onClick={() => setShowQuiz(true)}
                  className="w-full py-4 bg-gradient-to-r from-[#1E53C5] to-[#2a6bdf] text-white rounded-2xl font-bold text-base hover:brightness-110 transition-all shadow-lg shadow-[#1E53C5]/20"
                >
                  Start Quiz on this Story 🎯
                </button>
              )}
            </div>
          )}

          {activeTab === 'vocab' && (
            <VocabListTab
              wordsUsed={activeStory.wordsUsed}
              dictionary={dictionary}
            />
          )}
        </div>
      </div>

      {/* Tooltip — Fix #3: Added enter/leave handlers to prevent sticky hover */}
      {tooltipWord && (
        <VocabTooltip
          wordData={tooltipWord}
          position={tooltipPos}
          onClose={() => setTooltipWord(null)}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        />
      )}

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal
          story={activeStory}
          dictionary={dictionary}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
}