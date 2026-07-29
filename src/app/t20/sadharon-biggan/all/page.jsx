'use client';
// নতুন পেজ যুক্ত করলে এখানে import করতে হবে, তারপর number হিসেব করে দিতে হবে,  
import { useState, useEffect } from 'react';
// *********1. update here after new data  *****************
// Biology topics
import koshTisueGenetics from '../../../../../data/t20/sadharonBiggan/biology/koshTisueGenetics.json';
import praniBidda from '../../../../../data/t20/sadharonBiggan/biology/praniBidda.json';
import puttiOnubiggan from '../../../../../data/t20/sadharonBiggan/biology/puttiOnubiggan.json';
import rogShastho from '../../../../../data/t20/sadharonBiggan/biology/rogShastho.json';
import sorirtottoManobdeh from '../../../../../data/t20/sadharonBiggan/biology/sorirtottoManobdeh.json';
import udvhidBiggan from '../../../../../data/t20/sadharonBiggan/biology/udvhidBiggan.json';
// Physics topics
import alokBiggan from '../../../../../data/t20/sadharonBiggan/physics/alok_biggan.json';
import biddutChoumbokotto from '../../../../../data/t20/sadharonBiggan/physics/biddut_choumbokotto.json';
import bolbiddaSokti from '../../../../../data/t20/sadharonBiggan/physics/bolbidda_sokti.json';
import physicsXyz from '../../../../../data/t20/sadharonBiggan/physics/physics_xyz.json';
import porimapJontropati from '../../../../../data/t20/sadharonBiggan/physics/porimap_jontropati.json';
import pormanutejoskriyotaApikhikota from '../../../../../data/t20/sadharonBiggan/physics/pormanutejoskriyota_apikhikota.json';
// Chemistry topics
import acidKharLobon from '../../../../../data/t20/sadharonBiggan/chemistry/acidKharLobon.json';
import bikriyaoToritKosh from '../../../../../data/t20/sadharonBiggan/chemistry/bikriyaoToritKosh.json';
import dhatuKhonijPodartho from '../../../../../data/t20/sadharonBiggan/chemistry/dhatuKhonijPodartho.json';
import folitRosayon from '../../../../../data/t20/sadharonBiggan/chemistry/folitRosayon.json';
import joiboOjoiboChemistry from '../../../../../data/t20/sadharonBiggan/chemistry/joiboOjoiboChemistry.json';
import podartherGothonObosthan from '../../../../../data/t20/sadharonBiggan/chemistry/podartherGothonObosthan.json';
// Unique Topics
import pritibiMohakash from '../../../../../data/t20/sadharonBiggan/uniqueTopics/Pritibi_mohakash.json';

import QuickPracticeEngine from '@/components/QuickPracticeEngine';

// Helper: array থেকে random n টা item নেওয়া - Type বাদ
function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function sadharonBigganAllPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // 2. ************* update here after new data নম্বর বণ্টন কর*************
        // 6 from Biology (1 from each)
        const q1 = getRandomItems(koshTisueGenetics, 1);
        const q2 = getRandomItems(praniBidda, 1);
        const q3 = getRandomItems(puttiOnubiggan, 1);
        const q4 = getRandomItems(rogShastho, 1);
        const q5 = getRandomItems(sorirtottoManobdeh, 1);
        const q6 = getRandomItems(udvhidBiggan, 1);
        // 6 from Physics (1 from each of 6 selected topics)
        const q7 = getRandomItems(alokBiggan, 1);
        const q8 = getRandomItems(biddutChoumbokotto, 1);
        const q9 = getRandomItems(bolbiddaSokti, 1);
        const q10 = getRandomItems(physicsXyz, 1);
        const q11 = getRandomItems(porimapJontropati, 1);
        const q12 = getRandomItems(pormanutejoskriyotaApikhikota, 1);
        // 6 from Chemistry (1 from each)
        const q13 = getRandomItems(acidKharLobon, 1);
        const q14 = getRandomItems(bikriyaoToritKosh, 1);
        const q15 = getRandomItems(dhatuKhonijPodartho, 1);
        const q16 = getRandomItems(folitRosayon, 1);
        const q17 = getRandomItems(joiboOjoiboChemistry, 1);
        const q18 = getRandomItems(podartherGothonObosthan, 1);
        // 2 from Unique Topics
        const q19 = getRandomItems(pritibiMohakash, 2);

        // 3.**********update here after new data*****************
        const combinedQuestions = [
            ...q1, ...q2, ...q3, ...q4, ...q5, ...q6,
            ...q7, ...q8, ...q9, ...q10, ...q11, ...q12,
            ...q13, ...q14, ...q15, ...q16, ...q17, ...q18,
            ...q19
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
                    // *************=====5. change here ======*****************
                    title: "Sadharon Biggan (সাধারণ বিজ্ঞান) - All Topics Quiz Test - BCSpark",
                    category: "সাধারণ বিজ্ঞান",
                    subject: "সাধারণ বিজ্ঞান (All Topics)",
                    step: "04",
                    passMark: 50,
                    questionLimit: 20,
                    timeLimit: 180,
                    timerDisplay: "t20",
                    negativeMarking: 0.5,
                    randomize: true,
                }}
            />
        </div>
    );
}