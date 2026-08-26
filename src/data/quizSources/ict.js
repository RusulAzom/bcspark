// Central config for the ICT combined quiz (/t20/ict/all).
// Adding a new file = add one entry here plus one import line in
// src/app/api/quiz/ict/all/route.js — nothing else changes.
// `path` values are relative to the repository root's `data/` directory.
export const ictAllSources = {
    subject: "ICT - তথ্য প্রযুক্তি",
    defaultTotal: 20,
    topics: [
        {
            name: "ict",
            label: "তথ্য ও যোগাযোগ প্রযুক্তি",
            files: [
                { path: "t20/ict/ict701.json", quota: 3 },
                { path: "t20/ict/ict704.json", quota: 2 },
                { path: "t20/ict/ict705.json", quota: 2 },
                { path: "t20/ict/ict706.json", quota: 2 },
                { path: "t20/ict/ict710.json", quota: 2 },
                { path: "t20/ict/ict720.json", quota: 2 },
                { path: "t20/ict/ict730.json", quota: 3 },
                { path: "t20/ict/ict740.json", quota: 2 },
                { path: "t20/ict/ict750.json", quota: 2 },
            ],
        },
    ],
};

export default ictAllSources;