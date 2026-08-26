import { buildAllQuizResponse } from "@/lib/quizSourceServer";
import banglaSources from "@/data/quizSources/bangla";

// Server-only JSON pools — these imports stay on the server and are never
// bundled into client JS (see INTERNAL_API_DOCS.md §2).
import muktijudhdhovashaandolon from "../../../../../../data/t20/bangla/literature/muktijudhdhovashaandolon.json";
import modhdhojug from "../../../../../../data/t20/bangla/literature/modhdhojug.json";
import prachinjug from "../../../../../../data/t20/bangla/literature/prachinjug.json";
import pokritioprotoy from "../../../../../../data/t20/bangla/grammar/theory/pokritioprotoy.json";
import karokobivokti from "../../../../../../data/t20/bangla/grammar/theory/karokobivokti.json";
import writing from "../../../../../../data/t20/bangla/grammar/writing/writing.json";

export const dynamic = "force-dynamic";

const datasetMap = {
    "t20/bangla/literature/muktijudhdhovashaandolon.json": muktijudhdhovashaandolon,
    "t20/bangla/literature/modhdhojug.json": modhdhojug,
    "t20/bangla/literature/prachinjug.json": prachinjug,
    "t20/bangla/grammar/theory/pokritioprotoy.json": pokritioprotoy,
    "t20/bangla/grammar/theory/karokobivokti.json": karokobivokti,
    "t20/bangla/grammar/writing/writing.json": writing,
};

// GET /api/quiz/bangla/all          -> 20 questions (default)
// GET /api/quiz/bangla/all?total=30 -> 30 questions (scaled quotas)
// Also supports per-topic overrides, e.g. ?topic1=10&topic2=10
export async function GET(request, context) {
    // Next.js 16: route `params` are delivered as a Promise — always awaited.
    await context.params;
    return buildAllQuizResponse({ sources: banglaSources, datasetMap, request });
}