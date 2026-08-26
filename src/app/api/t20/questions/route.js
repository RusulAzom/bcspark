import practiceRoutes from "@/data/practiceRoutes";
import gkAllSources from "@/data/quizSources/gk";
import gkInternationalAllSources from "@/data/quizSources/gkInternational";
import sadharonBigganAllSources from "@/data/quizSources/sadharonBiggan";
import vugolPoribeshDMAllSources from "@/data/quizSources/vugolPoribeshDM";
import noitikotaMSAllSources from "@/data/quizSources/noitikotaMS";
import { poolFiles, allocate, shuffle } from "@/lib/t20Allocation";

export const runtime = "nodejs";

// Some subjects describe their question pools inside a quizSources config
// (src/data/quizSources/*) instead of putting folder/files directly on the
// practiceRoute topic. Map those subjects so the generic resolver can still
// serve any of their sub-topics.
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

// Locate the matching quizSources topic for a practiceRoute topic that has no
// own data reference. Returns null when the subject/topic is not backed by a
// config (e.g. ICT or legacy english topics) — callers then report the usual
// empty-pool error and pages fall back to their static question sets.
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

function badRequest(message) {
    return new Response(JSON.stringify({ error: message }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
}

function notFound(message) {
    return new Response(JSON.stringify({ error: message }), {
        status: 404,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
}

function serverError(message) {
    return new Response(JSON.stringify({ error: message }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
}

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const key = url.searchParams.get("key");
        if (!key || !key.includes(":")) {
            return badRequest("Missing or invalid key. Use ?key=<subjectId>:<topicId>");
        }

        const [subjectId, topicId] = key.split(":");
        const subject = practiceRoutes[subjectId];
        if (!subject) return badRequest(`Unknown subject: ${subjectId}`);

        const topic = subject.topics[topicId];
        if (!topic || !topic.active) return notFound(`Topic not found or inactive: ${key}`);

        const targetN0 = (topic.config && topic.config.questionLimit) || subject.defaultQuestionLimit || 20;

        // Optional explicit count (?total=N) — sent by the homepage mock test
        // card so every practice route honours the user's question selection.
        // Clamped later against the actual pool capacity.
        const requestedTotal = Number(url.searchParams.get("total"));
        let targetN =
            Number.isInteger(requestedTotal) && requestedTotal > 0
                ? Math.min(requestedTotal, 200)
                : targetN0;

        let sources = [];
        if (topicId === "all") {
            sources = Object.entries(subject.topics)
                .filter(([id, t]) => id !== "all" && t.active && (t.folder || (t.files && t.files.length > 0)))
                .map(([id, t]) => ({ id, ...t }));
        } else {
            let effectiveTopic = topic;
            if (!topic.folder && !(topic.files && topic.files.length > 0)) {
                const cfgTopic = findConfigTopic(subjectId, topicId);
                if (cfgTopic) {
                    // quizSources paths are relative to data/, while poolFiles()
                    // is rooted at data/t20 — strip the leading segment.
                    effectiveTopic = {
                        ...topic,
                        files: cfgTopic.files.map((f) =>
                            String(f.path).replace(/^t20\//, "")
                        ),
                    };
                }
            }
            sources = [effectiveTopic];
        }

        // Pool each source
        const withPool = [];
        for (const src of sources) {
            try {
                const pool = await poolFiles(src);
                if (pool.length === 0) continue;
                withPool.push({ ...src, pool });
            } catch (err) {
                return serverError(`Failed to load data for ${key}: ${err.message}`);
            }
        }

        if (withPool.length === 0) return serverError("No data files available for this topic");

        // Never request more than the pooled questions can actually supply.
        if (requestedTotal > 0) {
            const capSum = withPool.reduce((sum, s) => sum + s.pool.length, 0);
            targetN = Math.min(targetN, capSum);
        }

        // Determine counts via LRM
        // NOTE: topics without a configured `share` previously collapsed to a
        // 0-weight quota (yielding ~1 question regardless of the requested
        // total). When every pooled source lacks a share, distribute equally.
        const configuredShareTotal = withPool.reduce(
            (sum, s) => sum + (s.share || 0),
            0
        );
        const shareSum =
            configuredShareTotal > 0 ? configuredShareTotal : withPool.length;
        const rawQuotas = withPool.map((s) =>
            ((configuredShareTotal > 0 ? (s.share || 0) : 1) / shareSum) * targetN
        );
        const bases = rawQuotas.map((q) => Math.floor(q));
        const remainders = rawQuotas.map((q, i) => q - bases[i]);
        const leftover = targetN - bases.reduce((a, b) => a + b, 0);

        const ranked = withPool
            .map((s, i) => ({ index: i, rem: remainders[i] }))
            .sort((a, b) => b.rem - a.rem || a.index - b.index);

        const counts = bases.map((b, i) => {
            if (!withPool[i] || !withPool[i].pool) return 0;
            const base = b;
            let c = base;
            const pos = ranked.findIndex((r) => r.index === i);
            if (pos !== -1 && pos < leftover && c + 1 <= withPool[i].pool.length) {
                c += 1;
            }
            return c;
        });

        const total = counts.reduce((a, b) => a + b, 0);
        if (total !== targetN) {
            // Downgraded from a hard 500 to a warning: rounding remainders can
            // land one short of the target; returning fewer questions beats
            // failing the whole exam request.
            console.warn(
                `[/api/t20/questions] Allocation shortfall for ${key}: expected ${targetN}, got ${total}`
            );
        }

        // Draw and shuffle
        const drawn = [];
        for (let i = 0; i < withPool.length; i++) {
            const n = counts[i];
            if (n > 0) {
                drawn.push(...getRandomItems(withPool[i].pool, n));
            }
        }
        const questions = shuffle(drawn);

        const config = topic.config || subject.defaultQuizConfig || {};

        return Response.json({ questions, config }, {
            headers: { "Cache-Control": "no-store" },
        });
    } catch (err) {
        return serverError(`Unexpected error: ${err.message}`);
    }
}

function getRandomItems(arr, n) {
    if (n <= 0 || !Array.isArray(arr) || arr.length === 0) return [];
    const copy = [...arr];
    for (let i = 0; i < n && i < copy.length; i++) {
        const j = i + Math.floor(Math.random() * (copy.length - i));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(n, copy.length));
}