// Dedicated read-only engine for Study Mode (/study).
//
// Unlike /api/t20/questions (which randomly samples capped batches), this route
// returns the FULL question pool of a subject/topic so the client can paginate
// through 500+ question sets locally. Resolution logic intentionally mirrors
// api/t20/questions/route.js: topics either declare their own `folder`/`files`
// or are backed by a quizSources config under src/data/quizSources/*.
import practiceRoutes from "@/data/practiceRoutes";
import gkAllSources from "@/data/quizSources/gk";
import gkInternationalAllSources from "@/data/quizSources/gkInternational";
import sadharonBigganAllSources from "@/data/quizSources/sadharonBiggan";
import vugolPoribeshDMAllSources from "@/data/quizSources/vugolPoribeshDM";
import noitikotaMSAllSources from "@/data/quizSources/noitikotaMS";
import { poolFiles } from "@/lib/t20Allocation";

export const runtime = "nodejs";

// Same mapping as api/t20/questions/route.js — subjects whose data lives in a
// quizSources config instead of a practiceRoutes topic `folder`.
const SUBJECT_SOURCE_CONFIGS = {
    gk: gkAllSources,
    GKInternational: gkInternationalAllSources,
    Biology: sadharonBigganAllSources,
    VugolPoribeshDM: vugolPoribeshDMAllSources,
    NoitikotaMS: noitikotaMSAllSources,
};

// practiceRoutes topic key -> quizSources config `name` where they diverge.
const FALLBACK_TOPIC_ALIASES = {
    GKInternational: {
        itihasVurajniti: "itihasVurajnitiOnchol",
        nirapottaCkuktti: "nirapottaChuktti",
    },
};

function findConfigTopic(subjectId, topicId) {
    const cfg = SUBJECT_SOURCE_CONFIGS[subjectId];
    if (!cfg || !Array.isArray(cfg.topics)) return null;
    const aliasMap = FALLBACK_TOPIC_ALIASES[subjectId] || {};
    const wanted = aliasMap[topicId] || topicId;
    return (
        cfg.topics.find(
            (t) => t && t.name === wanted && Array.isArray(t.files) && t.files.length > 0
        ) || null
    );
}

// Resolves a subject/topic key into one or more {folder | files} specs that
// poolFiles() understands. Returns [] when the topic is missing/inactive and
// null when the subject itself is unknown.
function resolveSourceSpecs(subjectId, topicId) {
    const subject = practiceRoutes[subjectId];
    if (!subject) return null;

    const specs = [];
    const collectTopic = (id, topic) => {
        if (!topic || !topic.active) return false;
        if (topic.folder || (topic.files && topic.files.length > 0)) {
            specs.push({ folder: topic.folder, files: topic.files });
            return true;
        }
        // Data-less topics fall back to their quizSources config entry, if any.
        const cfgTopic = findConfigTopic(subjectId, id);
        if (cfgTopic) {
            // quizSources paths are relative to data/, while poolFiles() is
            // rooted at data/t20 — strip the leading segment.
            specs.push({
                files: cfgTopic.files.map((f) => String(f.path).replace(/^t20\//, "")),
            });
            return true;
        }
        return false;
    };

    if (topicId === "all") {
        Object.entries(subject.topics || {}).forEach(([id, t]) => {
            if (id !== "all") collectTopic(id, t);
        });
        return specs;
    }

    collectTopic(topicId, (subject.topics || {})[topicId]);
    return specs;
}

/**
 * GET /api/study/questions?key=<subjectId>:<topicId>
 *
 * Returns { questions, total } with the entire (deduplicated by identity)
 * pool for the requested key. Response shape of each question matches the
 * t20 datasets: { q, options[], ans, explain?, source? }.
 */
export async function GET(request) {
    try {
        const url = new URL(request.url);
        const key = url.searchParams.get("key");
        if (!key || !key.includes(":")) {
            return Response.json(
                { error: "Missing or invalid key. Use ?key=<subjectId>:<topicId>" },
                { status: 400, headers: { "Cache-Control": "no-store" } }
            );
        }

        const [subjectId, topicId] = key.split(":");
        const specs = resolveSourceSpecs(subjectId, topicId);
        if (specs === null) {
            return Response.json(
                { error: `Unknown subject: ${subjectId}` },
                { status: 404, headers: { "Cache-Control": "no-store" } }
            );
        }
        if (specs.length === 0) {
            return Response.json(
                { error: `Topic not found or inactive: ${key}` },
                { status: 404, headers: { "Cache-Control": "no-store" } }
            );
        }

        const pool = [];
        for (const spec of specs) {
            const items = await poolFiles(spec);
            // Keep only structurally valid study-card entries; skip garbage rows.
            items.forEach((item) => {
                if (
                    item &&
                    typeof item.q === "string" &&
                    item.q.trim().length > 0
                ) {
                    pool.push(item);
                }
            });
        }

        return Response.json(
            { questions: pool, total: pool.length, subject: subjectId, topic: topicId },
            // Study pools come from static dataset files — safe to cache.
            { headers: { "Cache-Control": "public, max-age=3600" } }
        );
    } catch (err) {
        console.error("[/api/study/questions] Failed to build study pool:", err);
        return Response.json(
            { error: err.message || "Unexpected server error" },
            { status: 500, headers: { "Cache-Control": "no-store" } }
        );
    }
}
