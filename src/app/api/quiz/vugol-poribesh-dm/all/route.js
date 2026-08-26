import { buildAllQuizResponse } from "@/lib/quizSourceServer";
import vugolPoribeshDMSources from "@/data/quizSources/vugolPoribeshDM";

// Server-only JSON pools — these imports stay on the server and are never
// bundled into client JS (see INTERNAL_API_DOCS.md §2).
import vugol from "../../../../../../data/t20/vugolPoribeshDM/vugol/vugol.json";
import abohaoyaJolobayu from "../../../../../../data/t20/vugolPoribeshDM/poribesh/abohaoyaJolobayu.json";
import bangladesherPoribesh from "../../../../../../data/t20/vugolPoribeshDM/poribesh/bangladesher_poribesh.json";
import voutoPoribesh from "../../../../../../data/t20/vugolPoribeshDM/poribesh/vouto_Poribesh.json";
import prakitikDurjogBabosthapona from "../../../../../../data/t20/vugolPoribeshDM/durjogBabosthapona/prakitikDurjogBabosthapona.json";

export const dynamic = "force-dynamic";

const datasetMap = {
    "t20/vugolPoribeshDM/vugol/vugol.json": vugol,
    "t20/vugolPoribeshDM/poribesh/abohaoyaJolobayu.json": abohaoyaJolobayu,
    "t20/vugolPoribeshDM/poribesh/bangladesher_poribesh.json": bangladesherPoribesh,
    "t20/vugolPoribeshDM/poribesh/vouto_Poribesh.json": voutoPoribesh,
    "t20/vugolPoribeshDM/durjogBabosthapona/prakitikDurjogBabosthapona.json": prakitikDurjogBabosthapona,
};

// GET /api/quiz/vugol-poribesh-dm/all          -> 20 questions (default)
// GET /api/quiz/vugol-poribesh-dm/all?total=30 -> 30 questions (scaled quotas)
// Also supports per-topic overrides, e.g. ?topic1=7&topic2=7&topic3=6
export async function GET(request, context) {
    // Next.js 16: route `params` are delivered as a Promise — always awaited.
    await context.params;
    return buildAllQuizResponse({ sources: vugolPoribeshDMSources, datasetMap, request });
}