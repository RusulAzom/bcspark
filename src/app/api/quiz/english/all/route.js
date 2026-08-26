import { buildAllQuizResponse } from "@/lib/quizSourceServer";
import englishSources from "@/data/quizSources/english";

// Server-only JSON pools — these imports stay on the server and are never
// bundled into client JS (see INTERNAL_API_DOCS.md §2).
import spelling from "../../../../../../data/t20/english/grammar/spelling/spelling.json";
import tense from "../../../../../../data/t20/english/grammar/tense/tense.json";
import verb482 from "../../../../../../data/t20/english/grammar/verb/verb482.json";
import vocabulary from "../../../../../../data/t20/english/grammar/vocabulary/vocabulary.json";
import voice from "../../../../../../data/t20/english/grammar/voice/voice.json";
import literature from "../../../../../../data/t20/english/literature/literature.json";

export const dynamic = "force-dynamic";

const datasetMap = {
    "t20/english/grammar/spelling/spelling.json": spelling,
    "t20/english/grammar/tense/tense.json": tense,
    "t20/english/grammar/verb/verb482.json": verb482,
    "t20/english/grammar/vocabulary/vocabulary.json": vocabulary,
    "t20/english/grammar/voice/voice.json": voice,
    "t20/english/literature/literature.json": literature,
};

// GET /api/quiz/english/all          -> 20 questions (default)
// GET /api/quiz/english/all?total=30 -> 30 questions (scaled quotas)
// Also supports per-topic overrides, e.g. ?topic1=15&topic2=5
export async function GET(request, context) {
    // Next.js 16: route `params` are delivered as a Promise — always awaited.
    await context.params;
    return buildAllQuizResponse({ sources: englishSources, datasetMap, request });
}