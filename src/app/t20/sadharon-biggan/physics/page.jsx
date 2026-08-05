'use client';
// নতুন পেজ যুক্ত করলে এখানে import করতে হবে, তারপর number হিসেব করে দিতে হবে,  
import { useState, useEffect } from 'react';
// *********1. update here after new data  *****************
import alokBiggan from '../../../../../data/t20/sadharonBiggan/physics/alok_biggan.json';
import biddutChoumbokotto from '../../../../../data/t20/sadharonBiggan/physics/biddut_choumbokotto.json';
import bolbiddaSokti from '../../../../../data/t20/sadharonBiggan/physics/bolbidda_sokti.json';
import physicsXyz from '../../../../../data/t20/sadharonBiggan/physics/physics_xyz.json';
import porimapJontropati from '../../../../../data/t20/sadharonBiggan/physics/porimap_jontropati.json';
import pormanutejoskriyotaApikhikota from '../../../../../data/t20/sadharonBiggan/physics/pormanutejoskriyota_apikhikota.json';
import toronggoTap from '../../../../../data/t20/sadharonBiggan/physics/toronggo_tap.json';

import QuickPracticeEngine from '@/components/QuickPracticeEngine';

// Helper: array থেকে random n টা item নেওয়া - Type বাদ
function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function noitikotamsPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // 2. ************* update here after new data নম্বর বণ্টন কর*************
        const questionsFromAlokBiggan = getRandomItems(alokBiggan, 3);
        const questionsFromBiddutChoumbokotto = getRandomItems(biddutChoumbokotto, 3);
        const questionsFromBolbiddaSokti = getRandomItems(bolbiddaSokti, 3);
        const questionsFromPhysicsXyz = getRandomItems(physicsXyz, 3);
        const questionsFromPorimapJontropati = getRandomItems(porimapJontropati, 3);
        const questionsFromPormanutejoskriyotaApikhikota = getRandomItems(pormanutejoskriyotaApikhikota, 3);
        const questionsFromToronggoTap = getRandomItems(toronggoTap, 2);

        // 3.**********update here after new data*****************
        const combinedQuestions = [
            ...questionsFromAlokBiggan,
            ...questionsFromBiddutChoumbokotto,
            ...questionsFromBolbiddaSokti,
            ...questionsFromPhysicsXyz,
            ...questionsFromPorimapJontropati,
            ...questionsFromPormanutejoskriyotaApikhikota,
            ...questionsFromToronggoTap
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
                    title: "Physics (পদার্থ বিজ্ঞান) Quiz Test - BCSpark",
                    category: "সাধারণ বিজ্ঞান",
                    subject: "Physics (পদার্থ বিজ্ঞান)",
                    step: "02",
                    passMark: 50,
                    questionLimit: 21,
                    timeLimit: 120,
                    timerDisplay: "t20",
                    negativeMarking: 0.5,
                    randomize: true,
                }}
            />
        </div>
    );
}