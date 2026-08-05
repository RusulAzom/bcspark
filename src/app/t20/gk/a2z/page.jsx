'use client';
import { useState, useEffect } from 'react';
import questions from '../../../../../data/t20/GK/AtoZbd1.json';
import QuickPracticeEngine from '@/components/QuickPracticeEngine';

export default function GKPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const shuffled = [...questions]
            .sort(() => 0.5 - Math.random())
            .slice(0, 20);
        setRandomQuestions(shuffled);
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
                    title: "A2Z GK Quick Practice - BCS",
                    category: "A2Z GK",
                    subject: "বাংলাদেশ পরিচিতি",
                    step: "01",
                    passMark: 50,
                    questionLimit: 20,
                    timeLimit: 600,
                    timerDisplay: "MM:SS",
                    negativeMarking: 0.5,
                    randomize: true,
                }}
            />
        </div>
    );
}