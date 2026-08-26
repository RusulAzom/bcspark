import { buildAllQuizResponse } from "@/lib/quizSourceServer";
import noitikotaMSSources from "@/data/quizSources/noitikotaMS";

// Server-only JSON pools — these imports stay on the server and are never
// bundled into client JS (see INTERNAL_API_DOCS.md §2).
import noitikota901 from "../../../../../../data/t20/noikotaMS/noitikota901.json";
import mullobodh902 from "../../../../../../data/t20/noikotaMS/mullobodh902.json";
import sushason903 from "../../../../../../data/t20/noikotaMS/sushason903.json";

export const dynamic = "force-dynamic";

const datasetMap = {
    "t20/noikotaMS/noitikota901.json": noitikota901,
    "t20/noikotaMS/mullobodh902.json": mullobodh902,
    "t20/noikotaMS/sushason903.json": sushason903,
};

// GET /api/quiz/noitikota-mullobodh-sushahon/all          -> 20 questions (default)
// GET /api/quiz/noitikota-mullobodh-sushahon/all?total=30 -> 30 questions (scaled quotas)
// Also supports per-topic overrides, e.g. ?topic1=7&topic2=7&topic3=6
export async function GET(request, context) {
    // Next.js 16: route `params` are delivered as a Promise — always awaited.
    await context.params;
    return buildAllQuizResponse({ sources: noitikotaMSSources, datasetMap, request });
}