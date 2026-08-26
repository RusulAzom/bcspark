// Central config for the English combined quiz (/t20/english/all).
// Adding a new sub-topic = add one entry here plus one import line in
// src/app/api/quiz/english/all/route.js — nothing else changes.
// `path` values are relative to the repository root's `data/` directory.
export const englishAllSources = {
    subject: "English",
    defaultTotal: 20,
    topics: [
        {
            name: "englishGrammar",
            label: "English Grammar",
            files: [
                { path: "t20/english/grammar/spelling/spelling.json", quota: 2 },
                { path: "t20/english/grammar/tense/tense.json", quota: 4 },
                { path: "t20/english/grammar/verb/verb482.json", quota: 4 },
                { path: "t20/english/grammar/vocabulary/vocabulary.json", quota: 4 },
                { path: "t20/english/grammar/voice/voice.json", quota: 4 },
            ],
        },
        {
            name: "englishLiterature",
            label: "English Literature",
            files: [{ path: "t20/english/literature/literature.json", quota: 2 }],
        },
    ],
};

export default englishAllSources;