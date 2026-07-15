'use client';
import { useState } from 'react';
import questions from '../../../../../data/t20/GK/gkAll.json';
import QuickPracticeEngine from '@/components/QuickPracticeEngine';

export default function GKPage() {
    const [randomQuestions] = useState(() => {
        return [...questions]
            .sort(() => 0.5 - Math.random())
            .slice(0, 20);
    });

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <QuickPracticeEngine
                questions={randomQuestions}
                config={{
                    title: "GK Quick Practice - BCS",
                    category: "GK",
                    subject: "GK All",
                    step: "01",
                    passMark: 50,
                    questionLimit: 20,
                    // time in second
                    timeLimit: 120,
                    // time display format t20/clock
                    timerDisplay: "t20",
                    negativeMarking: 0.5,
                    randomize: true,
                }}
            />
        </div>
    );
}