import practiceRoutes from "@/data/practiceRoutes";
import { poolFiles, allocate, shuffle } from "@/lib/t20Allocation";

export const runtime = "nodejs";

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

        const targetN = (topic.config && topic.config.questionLimit) || subject.defaultQuestionLimit || 20;

        let sources = [];
        if (topicId === "all") {
            sources = Object.entries(subject.topics)
                .filter(([id, t]) => id !== "all" && t.active && (t.folder || (t.files && t.files.length > 0)))
                .map(([id, t]) => ({ id, ...t }));
        } else {
            sources = [topic];
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

        // Determine counts via LRM
        const shareSum = withPool.reduce((sum, s) => sum + (s.share || 0), 0) || withPool.length;
        const rawQuotas = withPool.map((s) => ((s.share || 0) / shareSum) * targetN);
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
            return serverError(`Allocation mismatch: expected ${targetN}, got ${total}`);
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