import { buildAllQuizResponse } from "@/lib/quizSourceServer";
import gkSources from "@/data/quizSources/gk";

// Server-only JSON pools — these imports stay on the server and are never
// bundled into client JS (see INTERNAL_API_DOCS.md §2).
import jatiyoBisoyaboli from "../../../../../../data/t20/GK/jatiyaBisoyboli/jatiyoBisoyaboli.json";
import kistiSongskriti from "../../../../../../data/t20/GK/jatiyaBisoyboli/kistiSongskriti.json";
import muktijhdhdo1971 from "../../../../../../data/t20/GK/jatiyaBisoyboli/muktijhdhdo1971.json";
import prachinBortomanHistory from "../../../../../../data/t20/GK/jatiyaBisoyboli/prachin_bortomanHistory.json";
import prothomMohilaBD from "../../../../../../data/t20/GK/jatiyaBisoyboli/prothom_mohilaBD.json";
import vashaAnddolon from "../../../../../../data/t20/GK/jatiyaBisoyboli/vashaAnddolon.json";
import krishijSompod from "../../../../../../data/t20/GK/krisijSompod/krishij_sompod.json";
import jonosumari from "../../../../../../data/t20/GK/jonosumari/jonosumari.json";
import orthonitibd from "../../../../../../data/t20/GK/orthoniti/orthonitibd.json";
import shilpoBanijjo from "../../../../../../data/t20/GK/shilpoBanijjo/shilpo_banijjo.json";
import bangladeherSongbidhan from "../../../../../../data/t20/GK/bangladesherSongbidhan/bangladeher_songbidhan.json";
import rajnoitikSorkarBabostha from "../../../../../../data/t20/GK/rajnoitikOsorkarBabostha/rajnoitikSorkar_babostha.json";
import jatiyoOrjonBD from "../../../../../../data/t20/GK/jatiyoOrjon/jatiyoOrjonBD.json";
import protisthanSomuho from "../../../../../../data/t20/GK/prothisthanSomuho/protisthan_somuho.json";
import kheladhulaColochitra from "../../../../../../data/t20/GK/kheladhulaCholochitra/kheladhula_colochitra.json";
import gonomadhomProjukti from "../../../../../../data/t20/GK/gonomadhomProjukti/gonomadhom_projukti.json";

export const dynamic = "force-dynamic";

const datasetMap = {
    "t20/GK/jatiyaBisoyboli/jatiyoBisoyaboli.json": jatiyoBisoyaboli,
    "t20/GK/jatiyaBisoyboli/kistiSongskriti.json": kistiSongskriti,
    "t20/GK/jatiyaBisoyboli/muktijhdhdo1971.json": muktijhdhdo1971,
    "t20/GK/jatiyaBisoyboli/prachin_bortomanHistory.json": prachinBortomanHistory,
    "t20/GK/jatiyaBisoyboli/prothom_mohilaBD.json": prothomMohilaBD,
    "t20/GK/jatiyaBisoyboli/vashaAnddolon.json": vashaAnddolon,
    "t20/GK/krisijSompod/krishij_sompod.json": krishijSompod,
    "t20/GK/jonosumari/jonosumari.json": jonosumari,
    "t20/GK/orthoniti/orthonitibd.json": orthonitibd,
    "t20/GK/shilpoBanijjo/shilpo_banijjo.json": shilpoBanijjo,
    "t20/GK/bangladesherSongbidhan/bangladeher_songbidhan.json": bangladeherSongbidhan,
    "t20/GK/rajnoitikOsorkarBabostha/rajnoitikSorkar_babostha.json": rajnoitikSorkarBabostha,
    "t20/GK/jatiyoOrjon/jatiyoOrjonBD.json": jatiyoOrjonBD,
    "t20/GK/prothisthanSomuho/protisthan_somuho.json": protisthanSomuho,
    "t20/GK/kheladhulaCholochitra/kheladhula_colochitra.json": kheladhulaColochitra,
    "t20/GK/gonomadhomProjukti/gonomadhom_projukti.json": gonomadhomProjukti,
};

// GET /api/quiz/gk/all          -> 20 questions (default distribution)
// GET /api/quiz/gk/all?total=30 -> 30 questions (quotas scale proportionally)
// Also supports per-topic overrides, e.g. ?total=20&topic1=6&topic2=4
export async function GET(request, context) {
    // Next.js 16: route `params` are delivered as a Promise — always awaited.
    await context.params;
    return buildAllQuizResponse({ sources: gkSources, datasetMap, request });
}