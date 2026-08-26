// Central config for the "ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা" combined quiz (/t20/vugol-poribesh-dm/all).
// Adding a new sub-topic = add one entry here plus one import line in
// src/app/api/quiz/vugol-poribesh-dm/all/route.js — nothing else changes.
// `path` values are relative to the repository root's `data/` directory.
export const vugolPoribeshDMAllSources = {
    subject: "ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা",
    defaultTotal: 20,
    topics: [
        {
            name: "vugol",
            label: "ভূগোল",
            files: [{ path: "t20/vugolPoribeshDM/vugol/vugol.json", quota: 7 }],
        },
        {
            name: "poribesh",
            label: "পরিবেশ",
            files: [
                { path: "t20/vugolPoribeshDM/poribesh/abohaoyaJolobayu.json", quota: 2 },
                { path: "t20/vugolPoribeshDM/poribesh/bangladesher_poribesh.json", quota: 2 },
                { path: "t20/vugolPoribeshDM/poribesh/vouto_Poribesh.json", quota: 3 },
            ],
        },
        {
            name: "durjogBabosthapona",
            label: "দুর্যোগ ব্যবস্থাপনা",
            files: [{ path: "t20/vugolPoribeshDM/durjogBabosthapona/prakitikDurjogBabosthapona.json", quota: 6 }],
        },
    ],
};

export default vugolPoribeshDMAllSources;