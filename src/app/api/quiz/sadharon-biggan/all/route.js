import { buildAllQuizResponse } from "@/lib/quizSourceServer";
import sadharonBigganSources from "@/data/quizSources/sadharonBiggan";

// Server-only JSON pools — these imports stay on the server and are never
// bundled into client JS (see INTERNAL_API_DOCS.md §2).
// Biology
import koshTisueGenetics from "../../../../../../data/t20/sadharonBiggan/biology/koshTisueGenetics.json";
import praniBidda from "../../../../../../data/t20/sadharonBiggan/biology/praniBidda.json";
import puttiOnubiggan from "../../../../../../data/t20/sadharonBiggan/biology/puttiOnubiggan.json";
import rogShastho from "../../../../../../data/t20/sadharonBiggan/biology/rogShastho.json";
import sorirtottoManobdeh from "../../../../../../data/t20/sadharonBiggan/biology/sorirtottoManobdeh.json";
import udvhidBiggan from "../../../../../../data/t20/sadharonBiggan/biology/udvhidBiggan.json";
// Physics
import alokBiggan from "../../../../../../data/t20/sadharonBiggan/physics/alok_biggan.json";
import biddutChoumbokotto from "../../../../../../data/t20/sadharonBiggan/physics/biddut_choumbokotto.json";
import bolbiddaSokti from "../../../../../../data/t20/sadharonBiggan/physics/bolbidda_sokti.json";
import physicsXyz from "../../../../../../data/t20/sadharonBiggan/physics/physics_xyz.json";
import porimapJontropati from "../../../../../../data/t20/sadharonBiggan/physics/porimap_jontropati.json";
import pormanutejoskriyotaApikhikota from "../../../../../../data/t20/sadharonBiggan/physics/pormanutejoskriyota_apikhikota.json";
import toronggoTap from "../../../../../../data/t20/sadharonBiggan/physics/toronggo_tap.json";
// Chemistry
import acidKharLobon from "../../../../../../data/t20/sadharonBiggan/chemistry/acidKharLobon.json";
import bikriyaoToritKosh from "../../../../../../data/t20/sadharonBiggan/chemistry/bikriyaoToritKosh.json";
import dhatuKhonijPodartho from "../../../../../../data/t20/sadharonBiggan/chemistry/dhatuKhonijPodartho.json";
import folitRosayon from "../../../../../../data/t20/sadharonBiggan/chemistry/folitRosayon.json";
import joiboOjoiboChemistry from "../../../../../../data/t20/sadharonBiggan/chemistry/joiboOjoiboChemistry.json";
import podartherGothonObosthan from "../../../../../../data/t20/sadharonBiggan/chemistry/podartherGothonObosthan.json";
// Unique topics
import pritibiMohakash from "../../../../../../data/t20/sadharonBiggan/uniqueTopics/Pritibi_mohakash.json";

export const dynamic = "force-dynamic";

const datasetMap = {
    "t20/sadharonBiggan/biology/koshTisueGenetics.json": koshTisueGenetics,
    "t20/sadharonBiggan/biology/praniBidda.json": praniBidda,
    "t20/sadharonBiggan/biology/puttiOnubiggan.json": puttiOnubiggan,
    "t20/sadharonBiggan/biology/rogShastho.json": rogShastho,
    "t20/sadharonBiggan/biology/sorirtottoManobdeh.json": sorirtottoManobdeh,
    "t20/sadharonBiggan/biology/udvhidBiggan.json": udvhidBiggan,
    "t20/sadharonBiggan/physics/alok_biggan.json": alokBiggan,
    "t20/sadharonBiggan/physics/biddut_choumbokotto.json": biddutChoumbokotto,
    "t20/sadharonBiggan/physics/bolbidda_sokti.json": bolbiddaSokti,
    "t20/sadharonBiggan/physics/physics_xyz.json": physicsXyz,
    "t20/sadharonBiggan/physics/porimap_jontropati.json": porimapJontropati,
    "t20/sadharonBiggan/physics/pormanutejoskriyota_apikhikota.json": pormanutejoskriyotaApikhikota,
    "t20/sadharonBiggan/physics/toronggo_tap.json": toronggoTap,
    "t20/sadharonBiggan/chemistry/acidKharLobon.json": acidKharLobon,
    "t20/sadharonBiggan/chemistry/bikriyaoToritKosh.json": bikriyaoToritKosh,
    "t20/sadharonBiggan/chemistry/dhatuKhonijPodartho.json": dhatuKhonijPodartho,
    "t20/sadharonBiggan/chemistry/folitRosayon.json": folitRosayon,
    "t20/sadharonBiggan/chemistry/joiboOjoiboChemistry.json": joiboOjoiboChemistry,
    "t20/sadharonBiggan/chemistry/podartherGothonObosthan.json": podartherGothonObosthan,
    "t20/sadharonBiggan/uniqueTopics/Pritibi_mohakash.json": pritibiMohakash,
};

// GET /api/quiz/sadharon-biggan/all          -> 20 questions (default)
// GET /api/quiz/sadharon-biggan/all?total=30 -> 30 questions (scaled quotas)
// Also supports per-topic overrides, e.g. ?topic1=8&topic2=8&topic3=4
export async function GET(request, context) {
    // Next.js 16: route `params` are delivered as a Promise — always awaited.
    await context.params;
    return buildAllQuizResponse({ sources: sadharonBigganSources, datasetMap, request });
}