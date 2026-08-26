// Central config for the Bangla combined quiz (/t20/bangla/all).
// Adding a new sub-topic = add one entry here plus one import line in
// src/app/api/quiz/bangla/all/route.js — nothing else changes.
// `path` values are relative to the repository root's `data/` directory.
export const banglaAllSources = {
    subject: "Bangla",
    defaultTotal: 20,
    topics: [
        {
            name: "literature",
            label: "বাংলা সাহিত্য",
            files: [
                { path: "t20/bangla/literature/muktijudhdhovashaandolon.json", quota: 2 },
                { path: "t20/bangla/literature/modhdhojug.json", quota: 4 },
                { path: "t20/bangla/literature/prachinjug.json", quota: 4 },
            ],
        },
        {
            name: "grammar",
            label: "বাংলা ব্যাকরণ",
            files: [
                { path: "t20/bangla/grammar/theory/pokritioprotoy.json", quota: 2 },
                { path: "t20/bangla/grammar/theory/karokobivokti.json", quota: 4 },
                { path: "t20/bangla/grammar/writing/writing.json", quota: 4 },
            ],
        },
    ],
};

export default banglaAllSources;