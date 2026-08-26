import { buildAllQuizResponse } from "@/lib/quizSourceServer";
import ictSources from "@/data/quizSources/ict";

// Server-only JSON pools — these imports stay on the server and are never
// bundled into client JS (see INTERNAL_API_DOCS.md §2).
import ict701 from "../../../../../../data/t20/ict/ict701.json";
import ict704 from "../../../../../../data/t20/ict/ict704.json";
import ict705 from "../../../../../../data/t20/ict/ict705.json";
import ict706 from "../../../../../../data/t20/ict/ict706.json";
import ict710 from "../../../../../../data/t20/ict/ict710.json";
import ict720 from "../../../../../../data/t20/ict/ict720.json";
import ict730 from "../../../../../../data/t20/ict/ict730.json";
import ict740 from "../../../../../../data/t20/ict/ict740.json";
import ict750 from "../../../../../../data/t20/ict/ict750.json";

export const dynamic = "force-dynamic";

const datasetMap = {
    "t20/ict/ict701.json": ict701,
    "t20/ict/ict704.json": ict704,
    "t20/ict/ict705.json": ict705,
    "t20/ict/ict706.json": ict706,
    "t20/ict/ict710.json": ict710,
    "t20/ict/ict720.json": ict720,
    "t20/ict/ict730.json": ict730,
    "t20/ict/ict740.json": ict740,
    "t20/ict/ict750.json": ict750,
};

// GET /api/quiz/ict/all          -> 20 questions (default)
// GET /api/quiz/ict/all?total=30 -> 30 questions (scaled quotas)
export async function GET(request, context) {
    // Next.js 16: route `params` are delivered as a Promise — always awaited.
    await context.params;
    return buildAllQuizResponse({ sources: ictSources, datasetMap, request });
}