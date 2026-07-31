'use client';
import { useState, useEffect } from 'react';
// Topic 1: জাতীয় বিষয়াবলী (6 files)
import jatiyoBisoyaboli from '../../../../../data/t20/GK/jatiyaBisoyboli/jatiyoBisoyaboli.json';
import kistiSongskriti from '../../../../../data/t20/GK/jatiyaBisoyboli/kistiSongskriti.json';
import muktijhdhdo1971 from '../../../../../data/t20/GK/jatiyaBisoyboli/muktijhdhdo1971.json';
import prachinBortomanHistory from '../../../../../data/t20/GK/jatiyaBisoyboli/prachin_bortomanHistory.json';
import prothomMohilaBD from '../../../../../data/t20/GK/jatiyaBisoyboli/prothom_mohilaBD.json';
import vashaAnddolon from '../../../../../data/t20/GK/jatiyaBisoyboli/vashaAnddolon.json';
// Topic 2: কৃষিজ সম্পদ
import krishijSompod from '../../../../../data/t20/GK/krisijSompod/krishij_sompod.json';
// Topic 3: জনশুমারি
import jonosumari from '../../../../../data/t20/GK/jonosumari/jonosumari.json';
// Topic 4: বাংলাদেশের অর্থনীতি
import orthonitibd from '../../../../../data/t20/GK/orthoniti/orthonitibd.json';
// Topic 5: শিল্প ও বাণিজ্য
import shilpoBanijjo from '../../../../../data/t20/GK/shilpoBanijjo/shilpo_banijjo.json';
// Topic 6: বাংলাদেশের সংবিধান
import bangladeherSongbidhan from '../../../../../data/t20/GK/bangladesherSongbidhan/bangladeher_songbidhan.json';
// Topic 7: রাজনৈতিক ও সরকার ব্যবস্থা
import rajnoitikSorkarBabostha from '../../../../../data/t20/GK/rajnoitikOsorkarBabostha/rajnoitikSorkar_babostha.json';
// Topic 8: জাতীয় অর্জন
import jatiyoOrjonBD from '../../../../../data/t20/GK/jatiyoOrjon/jatiyoOrjonBD.json';
// Topic 9: গুরুত্বপূর্ণ প্রতিষ্ঠানসমূহ
import protisthanSomuho from '../../../../../data/t20/GK/prothisthanSomuho/protisthan_somuho.json';
// Topic 10: খেলাধুলা ও চলচ্চিত্র
import kheladhulaColochitra from '../../../../../data/t20/GK/kheladhulaCholochitra/kheladhula_colochitra.json';
// Topic 11: গণমাধ্যম ও প্রযুক্তি
import gonomadhomProjukti from '../../../../../data/t20/GK/gonomadhomProjukti/gonomadhom_projukti.json';

import QuickPracticeEngine from '@/components/QuickPracticeEngine';

function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function GKPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Topic 1: জাতীয় বিষয়াবলী (4 from 6 files)
        const t1 = [
            ...getRandomItems(jatiyoBisoyaboli, 1),
            ...getRandomItems(kistiSongskriti, 1),
            ...getRandomItems(muktijhdhdo1971, 1),
            ...getRandomItems(vashaAnddolon, 1)
        ];
        // Topics 2-8: 2 each
        const t2 = getRandomItems(krishijSompod, 2);
        const t3 = getRandomItems(jonosumari, 2);
        const t4 = getRandomItems(orthonitibd, 2);
        const t5 = getRandomItems(shilpoBanijjo, 2);
        const t6 = getRandomItems(bangladeherSongbidhan, 2);
        const t7 = getRandomItems(rajnoitikSorkarBabostha, 2);
        // Topic 8: জাতীয় অর্জন (1)
        const t8 = getRandomItems(jatiyoOrjonBD, 1);
        // Topics 9-11: 1 each
        const t9 = getRandomItems(protisthanSomuho, 1);
        const t10 = getRandomItems(kheladhulaColochitra, 1);
        const t11 = getRandomItems(gonomadhomProjukti, 1);

        const combinedQuestions = [
            ...t1, ...t2, ...t3, ...t4, ...t5, ...t6,
            ...t7, ...t8, ...t9, ...t10, ...t11
        ];
        const finalShuffled = combinedQuestions.sort(() => 0.5 - Math.random());

        setRandomQuestions(finalShuffled);
        setIsReady(true);
    }, []);

    if (!isReady) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl font-bold animate-pulse">Loading questions...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <QuickPracticeEngine
                questions={randomQuestions}
                config={{
                    title: "GK - বাংলাদেশ বিষয়াবলী (All Topics) Quiz Test - BCSpark",
                    category: "GK - বাংলাদেশ বিষয়াবলী",
                    subject: "GK - বাংলাদেশ বিষয়াবলী (All Topics)",
                    step: "01",
                    passMark: 50,
                    questionLimit: 20,
                    timeLimit: 120,
                    timerDisplay: "t20",
                    negativeMarking: 0.5,
                    randomize: true,
                }}
            />
        </div>
    );
}