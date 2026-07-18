/**
 * Vocabulary Data Source
 *
 * Imports the real BCS vocabulary dataset (1874 items) from the local JSON file.
 * This is the single source of truth for all vocabulary components.
 *
 * Schema: { id, q, options, ans, source, topicsId, explain }
 */
import fullVocabulary from '../../../data/t20/english/grammar/vocabulary/vocabulary.json';

export default fullVocabulary;