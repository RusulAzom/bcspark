import { buildAllQuizResponse } from "@/lib/quizSourceServer";
import gkInternationalSources from "@/data/quizSources/gkInternational";

// Server-only JSON pools — these imports stay on the server and are never
// bundled into client JS (see INTERNAL_API_DOCS.md §2).
import boishhikItihas from "../../../../../../data/t20/gkInternational/itihasVurajnitiOnchol/boishhikItihas.json";
import itihasVurajnitiOnchol from "../../../../../../data/t20/gkInternational/itihasVurajnitiOnchol/itihasVurajnitiOnchol.json";
import notunPuratonNam from "../../../../../../data/t20/gkInternational/itihasVurajnitiOnchol/notunPuratonNam.json";
import vurajniti from "../../../../../../data/t20/gkInternational/itihasVurajnitiOnchol/vurajniti.json";
import nirapottaChuktti from "../../../../../../data/t20/gkInternational/nirapottaChuktti/nirapottaChuktti.json";
import rajnotikKutnitikPorivasha from "../../../../../../data/t20/gkInternational/nirapottaChuktti/rajnotikKutnitikPorivasha.json";
import currentWorld from "../../../../../../data/t20/gkInternational/currentWorld/currentWorld.json";
import internationalEnviroment from "../../../../../../data/t20/gkInternational/internationalEnviroment/internationalEnviroment.json";
import intRajnoitikJot from "../../../../../../data/t20/gkInternational/antorjatikSongothon/int_rajnoitikJot.json";
import manobOdhikarSongstha from "../../../../../../data/t20/gkInternational/antorjatikSongothon/manobOdhikarSongstha.json";
import orthonoitikCuktiSonstha from "../../../../../../data/t20/gkInternational/antorjatikSongothon/orthonoitikCuktiSonstha.json";
import unJatisongho from "../../../../../../data/t20/gkInternational/antorjatikSongothon/UN_Jatisongho.json";

export const dynamic = "force-dynamic";

const datasetMap = {
    "t20/gkInternational/itihasVurajnitiOnchol/boishhikItihas.json": boishhikItihas,
    "t20/gkInternational/itihasVurajnitiOnchol/itihasVurajnitiOnchol.json": itihasVurajnitiOnchol,
    "t20/gkInternational/itihasVurajnitiOnchol/notunPuratonNam.json": notunPuratonNam,
    "t20/gkInternational/itihasVurajnitiOnchol/vurajniti.json": vurajniti,
    "t20/gkInternational/nirapottaChuktti/nirapottaChuktti.json": nirapottaChuktti,
    "t20/gkInternational/nirapottaChuktti/rajnotikKutnitikPorivasha.json": rajnotikKutnitikPorivasha,
    "t20/gkInternational/currentWorld/currentWorld.json": currentWorld,
    "t20/gkInternational/internationalEnviroment/internationalEnviroment.json": internationalEnviroment,
    "t20/gkInternational/antorjatikSongothon/int_rajnoitikJot.json": intRajnoitikJot,
    "t20/gkInternational/antorjatikSongothon/manobOdhikarSongstha.json": manobOdhikarSongstha,
    "t20/gkInternational/antorjatikSongothon/orthonoitikCuktiSonstha.json": orthonoitikCuktiSonstha,
    "t20/gkInternational/antorjatikSongothon/UN_Jatisongho.json": unJatisongho,
};

// GET /api/quiz/gk-international/all          -> 20 questions (default)
// GET /api/quiz/gk-international/all?total=30 -> 30 questions (scaled quotas)
// Also supports per-topic overrides, e.g. ?topic3=8&topic4=8&topic5=0
export async function GET(request, context) {
    // Next.js 16: route `params` are delivered as a Promise — always awaited.
    await context.params;
    return buildAllQuizResponse({ sources: gkInternationalSources, datasetMap, request });
}