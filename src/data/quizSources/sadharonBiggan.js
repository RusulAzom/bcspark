// Central config for the "সাধারণ বিজ্ঞান" combined quiz (/t20/sadharon-biggan/all).
// Adding a new sub-topic = add one entry here plus one import line in
// src/app/api/quiz/sadharon-biggan/all/route.js — nothing else changes.
// `path` values are relative to the repository root's `data/` directory.
export const sadharonBigganAllSources = {
    subject: "সাধারণ বিজ্ঞান",
    defaultTotal: 20,
    topics: [
        {
            name: "biology",
            label: "জীব বিজ্ঞান",
            files: [
                { path: "t20/sadharonBiggan/biology/koshTisueGenetics.json", quota: 1 },
                { path: "t20/sadharonBiggan/biology/praniBidda.json", quota: 1 },
                { path: "t20/sadharonBiggan/biology/puttiOnubiggan.json", quota: 1 },
                { path: "t20/sadharonBiggan/biology/rogShastho.json", quota: 1 },
                { path: "t20/sadharonBiggan/biology/sorirtottoManobdeh.json", quota: 1 },
                { path: "t20/sadharonBiggan/biology/udvhidBiggan.json", quota: 1 },
            ],
        },
        {
            name: "physics",
            label: "পদার্থ বিজ্ঞান",
            files: [
                { path: "t20/sadharonBiggan/physics/alok_biggan.json", quota: 1 },
                { path: "t20/sadharonBiggan/physics/biddut_choumbokotto.json", quota: 1 },
                { path: "t20/sadharonBiggan/physics/bolbidda_sokti.json", quota: 1 },
                { path: "t20/sadharonBiggan/physics/physics_xyz.json", quota: 1 },
                { path: "t20/sadharonBiggan/physics/porimap_jontropati.json", quota: 1 },
                { path: "t20/sadharonBiggan/physics/pormanutejoskriyota_apikhikota.json", quota: 1 },
                // Not drawn by default; selectable via ?topic2=N override.
                { path: "t20/sadharonBiggan/physics/toronggo_tap.json", quota: 0 },
            ],
        },
        {
            name: "chemistry",
            label: "রসায়ন বিজ্ঞান",
            files: [
                { path: "t20/sadharonBiggan/chemistry/acidKharLobon.json", quota: 1 },
                { path: "t20/sadharonBiggan/chemistry/bikriyaoToritKosh.json", quota: 1 },
                { path: "t20/sadharonBiggan/chemistry/dhatuKhonijPodartho.json", quota: 1 },
                { path: "t20/sadharonBiggan/chemistry/folitRosayon.json", quota: 1 },
                { path: "t20/sadharonBiggan/chemistry/joiboOjoiboChemistry.json", quota: 1 },
                { path: "t20/sadharonBiggan/chemistry/podartherGothonObosthan.json", quota: 1 },
            ],
        },
        {
            name: "uniqueTopics",
            label: "ভূমি ও মহাকাশ",
            files: [{ path: "t20/sadharonBiggan/uniqueTopics/Pritibi_mohakash.json", quota: 2 }],
        },
    ],
};

export default sadharonBigganAllSources;