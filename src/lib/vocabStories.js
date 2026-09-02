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
