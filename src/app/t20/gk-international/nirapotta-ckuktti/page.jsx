'use client';
import { useState, useEffect } from 'react';
import nirapottaChuktti from '../../../../../data/t20/gkInternational/nirapottaChuktti/nirapottaChuktti.json';
import rajnotikKutnitikPorivasha from '../../../../../data/t20/gkInternational/nirapottaChuktti/rajnotikKutnitikPorivasha.json';
import QuickPracticeEngine from '@/components/QuickPracticeEngine';

function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function NirapottaCkukttiPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const q1 = getRandomItems(nirapottaChuktti, 10);
        const q2 = getRandomItems(rajnotikKutnitikPorivasha, 10);

        const combinedQuestions = [...q1, ...q2];
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
                    title: "আন্তর্জাতিক নিরাপত্তা ও আন্তরাষ্ট্রীয় ক্ষমতা সম্পর্ক - GK Quiz - BCSpark",
                    category: "GK - আন্তর্জাতিক",
                    subject: "আন্তর্জাতিক নিরাপত্তা ও আন্তরাষ্ট্রীয় ক্ষমতা সম্পর্ক",
                    step: "02",
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