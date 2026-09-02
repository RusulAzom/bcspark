/**
 * Vocabulary Stories (VoTale) shared data helpers.
 *
 * The raw JSON contains duplicate entries (same id + title) and placeholder
 * slugs ("-"). This module normalizes the dataset:
 *   - dedupes stories by `id::title` (preserving first occurrence order)
 *   - assigns a stable "Day" number (1-based position) for daily progress tracking
 *   - generates a unique, URL-safe slug: `day-<N>-<storyId>`
 *     (story ids are not globally unique in the source data — e.g. two different
 *     stories share id "s010" — so the day number keeps every slug unique)
 *
 * Used by both the client component (VoTale.js) and the server routes under
 * src/app/vocabulary/stories/ so slugs and day numbers never diverge.
 */
import rawStories from '../../data/t20/english/grammar/vocabulary/stories/vocastory.json';

function dedupeStories(stories) {
  const seen = new Set();
  return stories.filter((story) => {
    const key = `${story.id}::${story.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Returns the normalized story list:
 * [{ ...story, slug: string, day: number }]
 */
export function getStories() {
  return dedupeStories(rawStories).map((story, index) => {
    const day = index + 1;
    const slug =
      story.slug && story.slug !== '-' ? story.slug : `day-${day}-${story.id}`;
    return { ...story, slug, day };
  });
}

/**
 * Finds a single story by its URL slug. Returns null when not found.
 */
export function getStoryBySlug(slug) {
  if (!slug) return null;
  return getStories().find((story) => story.slug === slug) || null;
}

/* ===========================================================================
 * Dynamic quiz generator
 * ---------------------------------------------------------------------------
 * Builds 3–5 multiple-choice questions that test the MEANING of the specific
 * vocabulary words actually highlighted in a story. The word set and the
 * ordering of the answer options are randomized on every call, so each reader
 * gets a fresh challenge.
 * =========================================================================== */

/** Fisher–Yates shuffle (returns a new shuffled copy). */
function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Randomly generate a fresh set of quiz questions for a given story.
 *
 * @param {object} story           Normalized story (see getStories()).
 * @param {object} dictionary      wordId → { word, bn_meaning, pos, ... } map.
 * @param {object} [opts]          { min, max } question count (default 3..5).
 * @returns {Array<{
 *   wordId: string,
 *   word: string,
 *   correctAnswer: string,
 *   options: string[]
 * }>}
 */
export function buildQuizQuestions(story, dictionary, opts = {}) {
  if (!story || !dictionary) return [];
  const min = opts.min || 3;
  const max = opts.max || 5;

  // 1. Collect the words to test: everything highlighted in the story body
  //    (contentWordIds) plus any manually curated set (quizWordIds).
  const contentIds = (story.contentWordIds || []).filter((id) => dictionary[id]);
  const curatedIds = (story.quizWordIds || []).filter((id) => dictionary[id]);
  const candidateIds = shuffle([...new Set([...curatedIds, ...contentIds])]);

  // 2. Pick how many questions to ask (3 to 5, clamped to what's available).
  const count = Math.max(min, Math.min(max, candidateIds.length));
  const selectedIds = candidateIds.slice(0, count);
  if (!selectedIds.length) return [];

  // 3. Build each question: correct meaning + 3 randomized distractor meanings.
  const allMeanings = Object.values(dictionary).map((e) => e.bn_meaning);

  return selectedIds.map((wordId) => {
    const correct = dictionary[wordId];
    const distractors = shuffle(
      allMeanings.filter((m) => m !== correct.bn_meaning)
    ).slice(0, 3);

    return {
      wordId,
      word: correct.word,
      correctAnswer: correct.bn_meaning,
      options: shuffle([correct.bn_meaning, ...distractors]),
    };
  });
}
