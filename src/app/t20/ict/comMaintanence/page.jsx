'use client';
import { useState, useEffect } from 'react';
import questions from '../../../../../data/t20/ict/ict701.json';
import QuickPracticeEngine from '@/components/QuickPracticeEngine';

export default function IctPage() {
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
                    title: "কম্পিউটার রক্ষণাবেক্ষণ, Virus, Cyber Security, firewall, software, Operating System ect.",
                    category: "তথ্য ও প্রযুক্তি",
                    subject: "কম্পিউটার রক্ষণাবেক্ষণ, Virus, Cyber Security, firewall, software, OS",
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