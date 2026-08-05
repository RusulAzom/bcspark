'use client';
import { useState, useEffect } from 'react';
import orthonitibd from '../../../../../data/t20/GK/orthoniti/orthonitibd.json';
import QuickPracticeEngine from '@/components/QuickPracticeEngine';

function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function OrthonitiPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const questions = getRandomItems(orthonitibd, 20);
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
                    title: "বাংলাদেশের অর্থনীতি Quiz Test - BCSpark",
                    category: "GK - বাংলাদেশ বিষয়াবলী",
                    subject: "বাংলাদেশের অর্থনীতি",
                    step: "04",
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