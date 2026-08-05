import fs from "fs/promises";
import path from "path";

const DATA_ROOT = path.join(process.cwd(), "data/t20");

export function getRandomItems(arr, n) {
    if (n <= 0 || !Array.isArray(arr) || arr.length === 0) return [];
    const copy = [...arr];
    // Fisher-Yates partial shuffle: swap first n with random suffix
    for (let i = 0; i < n && i < copy.length; i++) {
        const j = i + Math.floor(Math.random() * (copy.length - i));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(n, copy.length));
}

export async function poolFiles(topic) {
    let filePaths = [];
    if (topic.folder) {
        const dir = path.join(DATA_ROOT, topic.folder);
        const entries = await fs.readdir(dir, { withFileTypes: true });
        filePaths = entries
            .filter((e) => e.isFile() && e.name.endsWith(".json"))
            .map((e) => path.join(dir, e.name));
    } else if (topic.files && Array.isArray(topic.files)) {
        filePaths = topic.files.map((f) => path.join(DATA_ROOT, f));
    } else {
        return [];
    }

    const pool = [];
    for (const fp of filePaths) {
        try {
            const raw = await fs.readFile(fp, "utf-8");
            const data = JSON.parse(raw);
            if (Array.isArray(data)) pool.push(...data);
            else pool.push(...(data.questions || []));
        } catch (err) {
            throw new Error(`Failed to load ${fp}: ${err.message}`);
        }
    }
    return pool;
}

export function allocate(sources, targetN) {
    const withData = sources.filter((s) => (s.pool || []).length > 0);
    if (withData.length === 0) return sources.map(() => 0);

    const totalShare = withData.reduce((sum, s) => sum + (s.share || 0), 0) || withData.length;
    const quotas = withData.map((s) => ((s.share || 0) / totalShare) * targetN);
    const bases = quotas.map((q) => Math.floor(q));
    const remainders = quotas.map((q, i) => q - bases[i]);
    const leftover = targetN - bases.reduce((a, b) => a + b, 0);

    const ranked = withData
        .map((s, i) => ({ index: i, rem: remainders[i] }))
        .sort((a, b) => b.rem - a.rem || a.index - b.index);

    const counts = new Array(sources.length).fill(0);
    for (let i = 0; i < sources.length; i++) {
        if (sources[i].pool && sources[i].pool.length > 0) {
            counts[i] = bases[i];
        }
    }

    for (let k = 0; k < leftover; k++) {
        const idx = ranked[k].index;
        if (counts[idx] + 1 <= sources[idx].pool.length) {
            counts[idx] += 1;
        }
    }

    return counts;
}

export function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}