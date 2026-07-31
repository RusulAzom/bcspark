'use client';
import { useState, useEffect } from 'react';
import jatiyoBisoyaboli from '../../../../../data/t20/GK/jatiyaBisoyboli/jatiyoBisoyaboli.json';
import kistiSongskriti from '../../../../../data/t20/GK/jatiyaBisoyboli/kistiSongskriti.json';
import muktijhdhdo1971 from '../../../../../data/t20/GK/jatiyaBisoyboli/muktijhdhdo1971.json';
import prachinBortomanHistory from '../../../../../data/t20/GK/jatiyaBisoyboli/prachin_bortomanHistory.json';
import prothomMohilaBD from '../../../../../data/t20/GK/jatiyaBisoyboli/prothom_mohilaBD.json';
import vashaAnddolon from '../../../../../data/t20/GK/jatiyaBisoyboli/vashaAnddolon.json';
import QuickPracticeEngine from '@/components/QuickPracticeEngine';

function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function JatiyaBisoyboliPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const q1 = getRandomItems(jatiyoBisoyaboli, 4);
        const q2 = getRandomItems(kistiSongskriti, 4);
        const q3 = getRandomItems(muktijhdhdo1971, 3);
        const q4 = getRandomItems(prachinBortomanHistory, 3);
        const q5 = getRandomItems(prothomMohilaBD, 3);
        const q6 = getRandomItems(vashaAnddolon, 3);

        const combinedQuestions = [...q1, ...q2, ...q3, ...q4, ...q5, ...q6];
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
                    title: "জাতীয় বিষয়াবলী Quiz Test - BCSpark",
                    category: "GK - বাংলাদেশ বিষয়াবলী",
                    subject: "জাতীয় বিষয়াবলী",
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