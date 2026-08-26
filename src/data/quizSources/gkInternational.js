// Central config for the "GK - আন্তর্জাতিক" combined quiz (/t20/gk-international/all).
// Adding a new sub-topic = add one entry here plus one import line in
// src/app/api/quiz/gk-international/all/route.js — nothing else changes.
// `path` values are relative to the repository root's `data/` directory.
export const gkInternationalAllSources = {
    subject: "GK - আন্তর্জাতিক",
    defaultTotal: 20,
    topics: [
        {
            name: "itihasVurajnitiOnchol",
            label: "ইতিহাস ও ভূরাজনীতি অঞ্চল",
            files: [
                { path: "t20/gkInternational/itihasVurajnitiOnchol/boishhikItihas.json", quota: 1 },
                { path: "t20/gkInternational/itihasVurajnitiOnchol/itihasVurajnitiOnchol.json", quota: 1 },
                { path: "t20/gkInternational/itihasVurajnitiOnchol/notunPuratonNam.json", quota: 1 },
                { path: "t20/gkInternational/itihasVurajnitiOnchol/vurajniti.json", quota: 1 },
            ],
        },
        {
            name: "nirapottaChuktti",
            label: "নিরাপত্তা চুক্তি",
            files: [
                { path: "t20/gkInternational/nirapottaChuktti/nirapottaChuktti.json", quota: 2 },
                { path: "t20/gkInternational/nirapottaChuktti/rajnotikKutnitikPorivasha.json", quota: 2 },
            ],
        },
        {
            name: "currentWorld",
            label: "সাম্প্রতিক বিশ্ব",
            files: [{ path: "t20/gkInternational/currentWorld/currentWorld.json", quota: 4 }],
        },
        {
            name: "internationalEnviroment",
            label: "আন্তর্জাতিক পরিবেশ",
            files: [{ path: "t20/gkInternational/internationalEnviroment/internationalEnviroment.json", quota: 4 }],
        },
        {
            name: "antorjatikSongothon",
            label: "আন্তর্জাতিক সংগঠন",
            files: [
                { path: "t20/gkInternational/antorjatikSongothon/int_rajnoitikJot.json", quota: 1 },
                { path: "t20/gkInternational/antorjatikSongothon/manobOdhikarSongstha.json", quota: 1 },
                { path: "t20/gkInternational/antorjatikSongothon/orthonoitikCuktiSonstha.json", quota: 1 },
                { path: "t20/gkInternational/antorjatikSongothon/UN_Jatisongho.json", quota: 1 },
            ],
        },
    ],
};

export default gkInternationalAllSources;