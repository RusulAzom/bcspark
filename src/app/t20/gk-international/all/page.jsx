'use client';
import { useState, useEffect } from 'react';
// Subtopic 1
import boishhikItihas from '../../../../../data/t20/gkInternational/itihasVurajnitiOnchol/boishhikItihas.json';
import itihasVurajnitiOnchol from '../../../../../data/t20/gkInternational/itihasVurajnitiOnchol/itihasVurajnitiOnchol.json';
import notunPuratonNam from '../../../../../data/t20/gkInternational/itihasVurajnitiOnchol/notunPuratonNam.json';
import vurajniti from '../../../../../data/t20/gkInternational/itihasVurajnitiOnchol/vurajniti.json';
// Subtopic 2
import nirapottaChuktti from '../../../../../data/t20/gkInternational/nirapottaChuktti/nirapottaChuktti.json';
import rajnotikKutnitikPorivasha from '../../../../../data/t20/gkInternational/nirapottaChuktti/rajnotikKutnitikPorivasha.json';
// Subtopic 3
import currentWorld from '../../../../../data/t20/gkInternational/currentWorld/currentWorld.json';
// Subtopic 4
import internationalEnviroment from '../../../../../data/t20/gkInternational/internationalEnviroment/internationalEnviroment.json';
// Subtopic 5
import intRajnoitikJot from '../../../../../data/t20/gkInternational/antorjatikSongothon/int_rajnoitikJot.json';
import manobOdhikarSongstha from '../../../../../data/t20/gkInternational/antorjatikSongothon/manobOdhikarSongstha.json';
import orthonoitikCuktiSonstha from '../../../../../data/t20/gkInternational/antorjatikSongothon/orthonoitikCuktiSonstha.json';
import UNJatisongho from '../../../../../data/t20/gkInternational/antorjatikSongothon/UN_Jatisongho.json';

import QuickPracticeEngine from '@/components/QuickPracticeEngine';

function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function GkInternationalAllPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // 4 from subtopic 1 (1 from each file)
        const s1 = [
            ...getRandomItems(boishhikItihas, 1),
            ...getRandomItems(itihasVurajnitiOnchol, 1),
            ...getRandomItems(notunPuratonNam, 1),
            ...getRandomItems(vurajniti, 1)
        ];
        // 4 from subtopic 2 (2 from each file)
        const s2 = [
            ...getRandomItems(nirapottaChuktti, 2),
            ...getRandomItems(rajnotikKutnitikPorivasha, 2)
        ];
        // 4 from subtopic 3
        const s3 = getRandomItems(currentWorld, 4);
        // 4 from subtopic 4
        const s4 = getRandomItems(internationalEnviroment, 4);
        // 4 from subtopic 5 (1 from each file)
        const s5 = [
            ...getRandomItems(intRajnoitikJot, 1),
            ...getRandomItems(manobOdhikarSongstha, 1),
            ...getRandomItems(orthonoitikCuktiSonstha, 1),
            ...getRandomItems(UNJatisongho, 1)
        ];

        const combinedQuestions = [...s1, ...s2, ...s3, ...s4, ...s5];
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
                    title: "GK - আন্তর্জাতিক (All Topics) Quiz Test - BCSpark",
                    category: "GK - আন্তর্জাতিক",
                    subject: "GK - আন্তর্জাতিক (All Topics)",
                    step: "06",
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