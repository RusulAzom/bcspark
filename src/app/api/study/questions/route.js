// Dedicated read-only engine for Study Mode (/study).
//
// 3-tier filtering (Subject > Topic > Micro-topic) sourced directly from
// data/microTopics.json. Unlike /api/t20/questions (random sampled batches),
// this route serves two modes:
//   - GET (no params)            -> the Subject > Topic > Micro-topic tree
//   - GET ?subject&topic[&micro] -> the FULL pool of the targeted JSON file
// Aggregated "(All)" topics are never offered — Level 2 lists only the
// specific topics present in microTopics.json. Inactive practiceRoutes
// topics are filtered out to stay consistent with the rest of the site.
import fs from "fs/promises";
import path from "path";
import practiceRoutes from "@/data/practiceRoutes";
import banglaQuizSources from "@/data/quizSources/bangla";
import englishQuizSources from "@/data/quizSources/english";
import gkQuizSources from "@/data/quizSources/gk";
import gkInternationalQuizSources from "@/data/quizSources/gkInternational";
import ictQuizSources from "@/data/quizSources/ict";
import noikotaMSQuizSources from "@/data/quizSources/noitikotaMS";
import sadharonBigganQuizSources from "@/data/quizSources/sadharonBiggan";
import vugolPoribeshDMQuizSources from "@/data/quizSources/vugolPoribeshDM";
import { poolFiles, shuffle } from "@/lib/t20Allocation";

export const runtime = "nodejs";

const MICRO_TOPICS_PATH = path.join(process.cwd(), "data", "microTopics.json");
// Study file paths resolve under data/t20/<subject>/<topic>/<file>.
const DATA_ROOT = path.join(process.cwd(), "data", "t20");

async function pathExists(p) {
    try {
        await fs.stat(p);
        return true;
    } catch {
        return false;
    }
}

// ---------------------------------------------------------------------------
// Display-label mapping.
//
// Level 1 (Subject): microTopics.json root keys often differ from the
// practiceRoutes subject objects, so we map each root key to its human label.
// Bangla/Grammar/Literature labels pull from practiceRoutes; the combined-GK
// artefacts (GK, gkInternational, ict, sadharonBiggan, …) are labelled with
// their canonical Bengali names so users never see a raw camelCase key.
const SUBJECT_LABELS = {
    "bangla Sahitto": "বাংলা সাহিত্য",
    banglaBakaron: "বাংলা ব্যাকরণ",
    englishGrammer: "English Grammar",
    englishLiturature: "English Literature",
    GK: "বাংলাদেশ বিষয়াবলী",
    gkInternational: "আন্তর্জাতিক বিষয়াবলী",
    ict: "কম্পিউটার ও তথ্যপ্রযুক্তি",
    noikotaMS: "নৈতিকতা, মূল্যবোধ ও সুশাসন",
    sadharonBiggan: "সাধারণ বিজ্ঞান",
    vugolPoribeshDM: "ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা",
};

// Level 2 (Topic): several subjects' specific topics have no practiceRoutes
// folder entry (they are backed by quizSources configs instead). Each
// quizSources config carries { name, label } — fold them into one name->label
// index so microTopics.json topic keys resolve to the same Bengali labels the
// quiz engine already uses (e.g. bangladesherSongbidhan -> "বাংলাদেশের সংবিধান").
const quizTopicLabelByName = [
  banglaQuizSources,
  englishQuizSources,
  gkQuizSources,
  gkInternationalQuizSources,
  ictQuizSources,
  noikotaMSQuizSources,
  sadharonBigganQuizSources,
  vugolPoribeshDMQuizSources,
].reduce((index, cfg) => {
    if (cfg && Array.isArray(cfg.topics)) {
        for (const topic of cfg.topics) {
            if (topic && typeof topic.name === "string" && typeof topic.label === "string") {
                index[topic.name] = topic.label;
            }
        }
    }
    return index;
}, {});

// Defensive fallback: turn a camelCase/PascalCase/snake key into readable
// Title Case even when no label is configured anywhere, so raw keys never
// reach the user. (e.g. "bangladesherSongbidhan" -> "Bangladesher Songbidhan")
function toReadableTitle(key) {
    const words = String(key)
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_\-]+/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    if (words.length === 0) return String(key);
    return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// Resolve a Level 2 topic's display label.
//  1. If the practiceRoutes folder entry exists, honour its own label.
//  2. Otherwise fall back to the quizSources config label by topic name.
//  3. Last resort: title-case the raw key so it always stays readable.
function resolveTopicLabel(routeEntry, topicKey) {
    if (routeEntry?.topic?.label) return String(routeEntry.topic.label);
    if (quizTopicLabelByName[topicKey]) return quizTopicLabelByName[topicKey];
    return toReadableTitle(topicKey);
}

async function readMicroTopics() {
    const raw = await fs.readFile(MICRO_TOPICS_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("microTopics.json must contain an object of subjects");
    }
    return parsed;
}

// practiceRoutes lookup for a folder key ("bangla Sahitto/19thSahittik").
// Returns null when no topic (active or inactive) owns that folder.
function findRouteEntry(rootKey, topicKey) {
    const folder = `${rootKey}/${topicKey}`;
    for (const [subjectId, subject] of Object.entries(practiceRoutes)) {
        for (const [topicId, t] of Object.entries(subject.topics || {})) {
            if (t && t.folder === folder) {
                return {
                    subjectId,
                    topicId,
                    topic: t,
                    subjectLabel: String(subject.label || subjectId).replace(/^👉\s*/, ""),
                };
            }
        }
    }
    return null;
}

// Builds the Subject > Topic > Micro-topic tree for the Level 1-3 dropdowns.
// Only specific topics with at least one valid micro-topic entry are listed;
// inactive practiceRoutes topics are skipped entirely. Both Level 1 and
// Level 2 display labels are de-camelCased into human-readable strings via
// practiceRoutes labels, quizSources config labels, then a Title-case fallback.
function buildStudyTree(microTopics) {
    const subjects = [];
    for (const [rootKey, topicsMap] of Object.entries(microTopics)) {
        if (!topicsMap || typeof topicsMap !== "object" || Array.isArray(topicsMap)) continue;

        const topics = [];
        let subjectLabel = SUBJECT_LABELS[rootKey] || "";

        for (const [topicKey, microList] of Object.entries(topicsMap)) {
            if (!Array.isArray(microList)) continue;

            const routeEntry = findRouteEntry(rootKey, topicKey);
            if (routeEntry && !routeEntry.topic.active) continue; // inactive topic

            const micros = microList
                .filter(
                    (m) =>
                        m &&
                        typeof m.microTopic === "string" &&
                        m.microTopic.trim().length > 0 &&
                        typeof m.file === "string" &&
                        m.file.endsWith(".json")
                )
                .map((m) => ({ label: m.microTopic, file: m.file }));
            if (micros.length === 0) continue;

            topics.push({
                id: topicKey,
                // Whole-subject bundle topics (topicKey === rootKey, e.g. a
                // subject-wide "GK"/"noikotaMS" folder) reuse the subject's
                // canonical Bengali label rather than their raw key.
                label:
                    topicKey === rootKey && SUBJECT_LABELS[rootKey]
                        ? SUBJECT_LABELS[rootKey]
                        : resolveTopicLabel(routeEntry, topicKey),
                microTopics: micros,
            });
        }

        if (topics.length === 0) continue;
        subjects.push({ id: rootKey, label: subjectLabel || toReadableTitle(rootKey), topics });
    }
    return subjects;
}


// ---------------------------------------------------------------------------
// Dynamic study-target resolution.
//
// Subjects store their pools in one of two layouts:
//   3-tier (nested):  data/t20/<subject>/<topic>/<file.json>   (Bangla, English, …)
//   2-tier (flat):    data/t20/<subject>/<file.json>           (ict, noikotaMS)
// The resolver probes the nested path first and transparently falls back to
// the flat layout, so both shapes work with zero configuration.
//
// Aggregate bundles ("<subject>All.json", e.g. ictAll.json) are excluded from
// flat whole-topic reads — they duplicate the individual micro-topic files and
// would double-count questions.
const AGGREGATE_BUNDLE = /All\.json$/;

async function resolveStudyTarget(rootKey, topicKey, microFile) {
    const subjectDir = path.join(DATA_ROOT, rootKey);
    const nestedDir = path.join(subjectDir, topicKey);

    if (microFile) {
        // Standard 3-tier: data/t20/<subject>/<topic>/<file.json>
        const nestedFile = path.join(nestedDir, microFile);
        if (await pathExists(nestedFile)) {
            return { files: [`${rootKey}/${topicKey}/${microFile}`] };
        }
        // Flat 2-tier fallback: data/t20/<subject>/<file.json>
        const flatFile = path.join(subjectDir, microFile);
        if (await pathExists(flatFile)) {
            return { files: [`${rootKey}/${microFile}`] };
        }
        return null;
    }

    // Whole topic ("সব মাইক্রো-টপিক"): nested topic folder wins when present.
    if (await pathExists(nestedDir)) {
        return { folder: `${rootKey}/${topicKey}` };
    }

    // Flat fallback: combine every .json directly inside data/t20/<subject>/,
    // skipping aggregated "*All.json" bundles to prevent duplicate questions.
    const entries = await fs.readdir(subjectDir, { withFileTypes: true });
    const flatFiles = entries
        .filter(
            (e) =>
                e.isFile() &&
                e.name.endsWith(".json") &&
                !AGGREGATE_BUNDLE.test(e.name)
        )
        .map((e) => `${rootKey}/${e.name}`);
    if (flatFiles.length === 0) return null;
    return { files: flatFiles };
}

/**
 * GET /api/study/questions
 *
 * Mode 1 — no query params:
 *   Returns { subjects: [...] }, the Subject > Topic > Micro-topic tree
 *   (structure sourced from data/microTopics.json, no "(All)" topics).
 *
 * Mode 2 — ?subject=<rootKey>&topic=<topicKey>[&micro=<file>]:
 *   Returns { questions, total } with the FULL pool of the targeted JSON
 *   file (micro-topic) or the whole specific topic folder. All path segments
 *   are validated against microTopics.json, so no user-controlled path ever
 *   reaches the filesystem.
 */
export async function GET(request) {
    try {
        const microTopics = await readMicroTopics();
        const url = new URL(request.url);
        const subjectKey = url.searchParams.get("subject");
        const topicKey = url.searchParams.get("topic");
        const microFile = url.searchParams.get("micro");

        // Mode 1: serve the filter tree.
        if (!subjectKey && !topicKey && !microFile) {
            return Response.json(
                { subjects: buildStudyTree(microTopics) },
                { headers: { "Cache-Control": "public, max-age=3600" } }
            );
        }

        if (!subjectKey || !topicKey) {
            return Response.json(
                { error: "Both 'subject' and 'topic' query params are required" },
                { status: 400, headers: { "Cache-Control": "no-store" } }
            );
        }

        const topicsMap = microTopics[subjectKey];
        if (!topicsMap || typeof topicsMap !== "object" || Array.isArray(topicsMap)) {
            return Response.json(
                { error: `Unknown subject: ${subjectKey}` },
                { status: 404, headers: { "Cache-Control": "no-store" } }
            );
        }

        const microList = Array.isArray(topicsMap[topicKey]) ? topicsMap[topicKey] : null;
        if (!microList) {
            return Response.json(
                { error: `Unknown topic: ${subjectKey}/${topicKey}` },
                { status: 404, headers: { "Cache-Control": "no-store" } }
            );
        }

        const routeEntry = findRouteEntry(subjectKey, topicKey);
        if (routeEntry && !routeEntry.topic.active) {
            return Response.json(
                { error: `Topic is inactive: ${subjectKey}/${topicKey}` },
                { status: 404, headers: { "Cache-Control": "no-store" } }
            );
        }

        // Mode 2: resolve the study target. Path checks handle both the
        // standard 3-tier layout and the flat 2-tier layout (ict/noikotaMS),
        // so no ENOENT scandir/readFile errors can occur for either shape.
        let spec;
        if (microFile) {
            const entry = microList.find((m) => m && m.file === microFile);
            if (!entry) {
                return Response.json(
                    { error: `Unknown micro-topic file: ${microFile}` },
                    { status: 404, headers: { "Cache-Control": "no-store" } }
                );
            }
            spec = await resolveStudyTarget(subjectKey, topicKey, microFile);
        } else {
            spec = await resolveStudyTarget(subjectKey, topicKey, null);
        }

        if (!spec) {
            return Response.json(
                {
                    error: `No study files found for ${subjectKey}/${topicKey}${
                        microFile ? ` (micro: ${microFile})` : ""
                    }`,
                },
                { status: 404, headers: { "Cache-Control": "no-store" } }
            );
        }

        const pool = await poolFiles(spec);
        const filtered = pool.filter(
            (item) => item && typeof item.q === "string" && item.q.trim().length > 0
        );

        // Quiz sampling: a request with ?total=N (e.g. from the study-page CTA
        // or the mock-test handoff) must return a FRESHLY randomised subset
        // spanning the ENTIRE filtered pool — never the same first N items.
        // We fully shuffle the array (Fisher-Yates) then take the top N so
        // every N-sized draw is an independent, uniformly random selection
        // across all pages of the filtered archive.
        const totalParam = Number(url.searchParams.get("total"));
        const wantsRandom = Number.isInteger(totalParam) && totalParam > 0;
        const questions = wantsRandom
            ? shuffle(filtered).slice(0, Math.min(totalParam, filtered.length))
            : filtered;

        // Randomised quiz responses must never be cached — a shared/public
        // max-age header would let the browser or a CDN replay the previous
        // batch instead of returning a fresh draw on the next click.
        const cacheControl = wantsRandom
            ? "no-store, max-age=0"
            : "public, max-age=3600";

        return Response.json(
            {
                questions,
                total: questions.length,
                subject: subjectKey,
                topic: topicKey,
                micro: microFile || null,
            },
            { headers: { "Cache-Control": cacheControl } }
        );
    } catch (err) {
        console.error("[/api/study/questions] Failed to build study pool:", err);
        return Response.json(
            { error: err.message || "Unexpected server error" },
            { status: 500, headers: { "Cache-Control": "no-store" } }
        );
    }
}
