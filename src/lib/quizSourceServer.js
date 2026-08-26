// Shared server-side engine for the combined "/api/quiz/{subject}/all" routes.
// Design reference: INTERNAL_API_DOCS.md (sections 4-7).
//
// Each subject contributes a config file under src/data/quizSources/ describing
// its sub-topics, JSON paths (relative to the repository root "data/" folder)
// and default quotas. Route handlers statically import their JSON pools
// server-side and hand them to buildAllQuizResponse() together with a
// path -> dataset lookup map.
import { getRandomItems, shuffle } from "@/lib/t20Allocation";

const MAX_TOTAL = 200;

// Returns a validated non-negative integer, or null when raw is present but
// invalid. Falls back to `fallback` when raw is absent/empty.
export function parsePositiveInt(raw, fallback = null) {
    if (raw === null || raw === undefined || raw === "") return fallback;
    const text = String(raw).trim();
    if (!/^\d+$/.test(text)) return null;
    const parsed = Number.parseInt(text, 10);
    return Number.isSafeInteger(parsed) ? parsed : null;
}

function jsonError(message, status) {
    return Response.json(
        { error: message },
        { status, headers: { "Cache-Control": "no-store" } }
    );
}

// Largest-remainder apportionment: distributes `target` items over weighted
// buckets without ever exceeding a bucket's capacity (`caps`). When every
// weight is zero an even split is used instead.
export function apportion(weights, target, caps) {
    const count = weights.length;
    const counts = new Array(count).fill(0);
    const capacityTotal = caps.reduce((sum, c) => sum + c, 0);
    const remaining = Math.min(Math.max(target, 0), capacityTotal);
    if (count === 0 || remaining === 0) return counts;

    const effectiveWeights = weights.some((w) => w > 0)
        ? weights.map((w) => Math.max(0, w))
        : weights.map(() => 1); // no configured weight -> fair split
    const weightSum = effectiveWeights.reduce((sum, w) => sum + w, 0);

    const rawQuotas = effectiveWeights.map((w) => (w / weightSum) * remaining);
    let allocated = 0;
    rawQuotas.forEach((quota, i) => {
        counts[i] = Math.min(Math.floor(quota), caps[i]);
        allocated += counts[i];
    });

    // Hand out leftovers by descending fractional part (ties: lower index first).
    const ranked = rawQuotas
        .map((quota, i) => ({ i, fraction: quota - Math.floor(quota) }))
        .sort((a, b) => b.fraction - a.fraction || a.i - b.i);

    while (allocated < remaining) {
        let progressed = false;
        for (const { i } of ranked) {
            if (allocated >= remaining) break;
            if (counts[i] < caps[i]) {
                counts[i] += 1;
                allocated += 1;
                progressed = true;
            }
        }
        if (!progressed) break; // every bucket already at capacity
    }

    return counts;
}

function datasetPool(datasetMap, filePath) {
    const dataset = datasetMap[filePath];
    if (!dataset) {
        throw new Error(`No dataset registered for "${filePath}" — add it to the route handler imports`);
    }
    if (Array.isArray(dataset)) return dataset;
    if (dataset && Array.isArray(dataset.questions)) return dataset.questions;
    throw new Error(`Dataset "${filePath}" is neither an array nor exposes a "questions" array`);
}

/**
 * Builds the Response for a GET /api/quiz/{subject}/all request.
 *
 * Supported query params:
 *   - `total`   : N total questions (default: config.defaultTotal, max: 200).
 *                 Per-topic quotas scale proportionally (largest remainder).
 *   - `topic1`, `topic2`, ... : explicit per-topic quotas (config order,
 *     1-based). Files inside that topic are spread proportionally.
 *
 * Response shape (see INTERNAL_API_DOCS.md §4):
 *   { questions: [...], total: N, subject: "<configured subject name>" }
 */
export function buildAllQuizResponse({ sources, datasetMap, request }) {
    try {
        if (!sources || !Array.isArray(sources.topics) || sources.topics.length === 0) {
            return jsonError("Quiz sources configuration is incomplete", 500);
        }

        const searchParams = request.nextUrl.searchParams;
        const defaultTotal =
            Number.isInteger(sources.defaultTotal) && sources.defaultTotal > 0
                ? sources.defaultTotal
                : 20;

        const totalRaw = searchParams.get("total");
        const totalParsed = parsePositiveInt(totalRaw);
        if (totalParsed === null && totalRaw !== null) {
            return jsonError('"total" must be a positive integer', 400);
        }
        const target = Math.min(totalParsed ?? defaultTotal, MAX_TOTAL);

        const topics = sources.topics.map((topic, index) => {
            if (!topic || typeof topic.name !== "string" || !Array.isArray(topic.files) || topic.files.length === 0) {
                throw new Error(`Invalid topic entry at position ${index + 1} of the quiz sources config`);
            }
            return { index, ...topic };
        });

        // Optional per-topic quota overrides: ?topic1=N&topic2=M (1-based order).
        const topicOverrides = new Map();
        for (const topic of topics) {
            const raw = searchParams.get(`topic${topic.index + 1}`);
            if (raw === null) continue;
            const parsed = parsePositiveInt(raw);
            if (parsed === null) {
                return jsonError(`"topic${topic.index + 1}" must be a non-negative integer`, 400);
            }
            topicOverrides.set(topic.index, parsed);
        }

        // Flatten every topic into per-file units capped by its real pool size.
        const unitsPerTopic = topics.map((topic) =>
            topic.files.map((entry) => {
                if (!entry || typeof entry.path !== "string") {
                    throw new Error(`Invalid file entry inside topic "${topic.name}"`);
                }
                const pool = datasetPool(datasetMap, entry.path);
                return {
                    path: entry.path,
                    pool,
                    quota: Number.isFinite(entry.quota) && entry.quota >= 0 ? entry.quota : 0,
                    cap: pool.length,
                };
            })
        );

        // Stage 1: spread the target across topics (explicit override wins).
        const topicDemands = topics.map((topic) => {
            if (topicOverrides.has(topic.index)) return topicOverrides.get(topic.index);
            return unitsPerTopic[topic.index].reduce((sum, unit) => sum + unit.quota, 0);
        });
        const topicCaps = unitsPerTopic.map((units) =>
            units.reduce((sum, unit) => sum + unit.cap, 0)
        );
        const topicTargets = apportion(topicDemands, target, topicCaps);

        // Stage 2: inside every topic, split its share across the files by weight.
        const picked = [];
        unitsPerTopic.forEach((units, topicIndex) => {
            const counts = apportion(
                units.map((unit) => unit.quota),
                topicTargets[topicIndex],
                units.map((unit) => unit.cap)
            );
            units.forEach((unit, fileIndex) => {
                if (counts[fileIndex] > 0) {
                    picked.push(...getRandomItems(unit.pool, counts[fileIndex]));
                }
            });
        });

        return Response.json(
            {
                questions: shuffle(picked),
                total: picked.length,
                subject: sources.subject,
            },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (err) {
        console.error("[/api/quiz] Failed to build question set:", err);
        return jsonError(err.message || "Unexpected server error", 500);
    }
}