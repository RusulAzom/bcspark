'use client';
import { useState, useEffect } from 'react';
import currentWorld from '../../../../../data/t20/gkInternational/currentWorld/currentWorld.json';
import QuickPracticeEngine from '@/components/QuickPracticeEngine';

function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function CurrentWorldPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const questions = getRandomItems(currentWorld, 20);
        const finalShuffled = questions.sort(() => 0.5 - Math.random());

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
                    title: "বিশ্বের সাম্প্রতিক ও চলমান ঘটনাস্প্রবাহ - GK Quiz - BCSpark",
                    category: "GK - আন্তর্জাতিক",
                    subject: "বিশ্বের সাম্প্রতিক ও চলমান ঘটনাস্প্রবাহ",
                    step: "03",
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