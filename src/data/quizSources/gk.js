// Central config for the "GK - বাংলাদেশ বিষয়াবলী" combined quiz (/t20/gk/all).
// Adding a new sub-topic = add one entry here plus one import line in
// src/app/api/quiz/gk/all/route.js — nothing else changes.
// `path` values are relative to the repository root's `data/` directory.
export const gkAllSources = {
    subject: "GK - বাংলাদেশ বিষয়াবলী",
    defaultTotal: 20,
    topics: [
        {
            name: "jatiyaBisoyboli",
            label: "জাতীয় বিষয়াবলী",
            files: [
                { path: "t20/GK/jatiyaBisoyboli/jatiyoBisoyaboli.json", quota: 1 },
                { path: "t20/GK/jatiyaBisoyboli/kistiSongskriti.json", quota: 1 },
                { path: "t20/GK/jatiyaBisoyboli/muktijhdhdo1971.json", quota: 1 },
                // Not drawn by default; selectable via ?topic1=N override.
                { path: "t20/GK/jatiyaBisoyboli/prachin_bortomanHistory.json", quota: 0 },
                { path: "t20/GK/jatiyaBisoyboli/prothom_mohilaBD.json", quota: 0 },
                { path: "t20/GK/jatiyaBisoyboli/vashaAnddolon.json", quota: 1 },
            ],
        },
        {
            name: "krisijSompod",
            label: "কৃষিজ সম্পদ",
            files: [{ path: "t20/GK/krisijSompod/krishij_sompod.json", quota: 2 }],
        },
        {
            name: "jonosumari",
            label: "জনশুমারি",
            files: [{ path: "t20/GK/jonosumari/jonosumari.json", quota: 2 }],
        },
        {
            name: "orthoniti",
            label: "বাংলাদেশের অর্থনীতি",
            files: [{ path: "t20/GK/orthoniti/orthonitibd.json", quota: 2 }],
        },
        {
            name: "shilpoBanijjo",
            label: "শিল্প ও বাণিজ্য",
            files: [{ path: "t20/GK/shilpoBanijjo/shilpo_banijjo.json", quota: 2 }],
        },
        {
            name: "bangladesherSongbidhan",
            label: "বাংলাদেশের সংবিধান",
            files: [{ path: "t20/GK/bangladesherSongbidhan/bangladeher_songbidhan.json", quota: 2 }],
        },
        {
            name: "rajnoitikOsorkarBabostha",
            label: "রাজনৈতিক ও সরকার ব্যবস্থা",
            files: [{ path: "t20/GK/rajnoitikOsorkarBabostha/rajnoitikSorkar_babostha.json", quota: 2 }],
        },
        {
            name: "jatiyoOrjon",
            label: "জাতীয় অর্জন",
            files: [{ path: "t20/GK/jatiyoOrjon/jatiyoOrjonBD.json", quota: 1 }],
        },
        {
            name: "prothisthanSomuho",
            label: "গুরুত্বপূর্ণ প্রতিষ্ঠানসমূহ",
            files: [{ path: "t20/GK/prothisthanSomuho/protisthan_somuho.json", quota: 1 }],
        },
        {
            name: "kheladhulaCholochitra",
            label: "খেলাধুলা ও চলচ্চিত্র",
            files: [{ path: "t20/GK/kheladhulaCholochitra/kheladhula_colochitra.json", quota: 1 }],
        },
        {
            name: "gonomadhomProjukti",
            label: "গণমাধ্যম ও প্রযুক্তি",
            files: [{ path: "t20/GK/gonomadhomProjukti/gonomadhom_projukti.json", quota: 1 }],
        },
    ],
};

export default gkAllSources;