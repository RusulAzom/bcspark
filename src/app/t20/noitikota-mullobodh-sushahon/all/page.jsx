'use client';
// নতুন পেজ যুক্ত করলে এখানে import করতে হবে, তারপর number হিসেব করে দিতে হবে,  
import { useState, useEffect } from 'react';
// *********1. update here after new data  *****************
import noitikota901 from '../../../../../data/t20/noikotaMS/noitikota901.json';
import mullobodh902 from '../../../../../data/t20/noikotaMS/mullobodh902.json';
import sushason903 from '../../../../../data/t20/noikotaMS/sushason903.json';

import QuickPracticeEngine from '@/components/QuickPracticeEngine';

// Helper: array থেকে random n টা item নেওয়া - Type বাদ
function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function noitikotamsPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // 2. ************* update here after new data নম্বর বণ্টন কর*************
        const questionsFromNoitikota901 = getRandomItems(noitikota901, 7);
        const questionsFromMullobodh902 = getRandomItems(mullobodh902, 7);
        const questionsFromSushason903 = getRandomItems(sushason903, 6);

        // 3.**********update here after new data*****************
        const combinedQuestions = [
            ...questionsFromNoitikota901,
            ...questionsFromMullobodh902,
            ...questionsFromSushason903
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
                    title: "নৈতিকতা-মূল্যবোধ-সুশাসন All Topics - BCSpark",
                    category: "নৈতিকতা-মূল্যবোধ-সুশাসন",
                    subject: "নৈতিকতা-মূল্যবোধ-সুশাসন (ALL Topics)",
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