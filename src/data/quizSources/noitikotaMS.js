// Central config for the "নৈতিকতা, মূল্যবোধ ও সুশাসন" combined quiz (/t20/noitikota-mullobodh-sushahon/all).
// Adding a new sub-topic = add one entry here plus one import line in
// src/app/api/quiz/noitikota-mullobodh-sushahon/all/route.js — nothing else changes.
// `path` values are relative to the repository root's `data/` directory.
export const noitikotaMSAllSources = {
    subject: "নৈতিকতা, মূল্যবোধ ও সুশাসন",
    defaultTotal: 20,
    topics: [
        {
            name: "noitikota",
            label: "নৈতিকতা",
            files: [{ path: "t20/noikotaMS/noitikota901.json", quota: 7 }],
        },
        {
            name: "mullobodh",
            label: "মূল্যবোধ",
            files: [{ path: "t20/noikotaMS/mullobodh902.json", quota: 7 }],
        },
        {
            name: "sushason",
            label: "সুশাসন",
            files: [{ path: "t20/noikotaMS/sushason903.json", quota: 6 }],
        },
    ],
};

export default noitikotaMSAllSources;