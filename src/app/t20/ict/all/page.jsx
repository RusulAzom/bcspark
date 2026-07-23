'use client';
// নতুন পেজ যুক্ত করলে এখানে import করতে হবে, তারপর number হিসেব করে দিতে হবে,  
import { useState, useEffect } from 'react';
// *********1. update here after new data  *****************
import ict701 from '../../../../../data/t20/ict/ict701.json';
import ict704 from '../../../../../data/t20/ict/ict704.json';
import ict705 from '../../../../../data/t20/ict/ict705.json';
import ict706 from '../../../../../data/t20/ict/ict706.json';
import ict710 from '../../../../../data/t20/ict/ict710.json';
import ict720 from '../../../../../data/t20/ict/ict720.json';
import ict730 from '../../../../../data/t20/ict/ict730.json';
import ict740 from '../../../../../data/t20/ict/ict740.json';
import ict750 from '../../../../../data/t20/ict/ict750.json';

import QuickPracticeEngine from '@/components/QuickPracticeEngine';

// Helper: array থেকে random n টা item নেওয়া - Type বাদ
function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function banglaPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // 2. ************* update here after new data নম্বর বণ্টন কর*************
        const questionsFromIct701 = getRandomItems(ict701, 3);
        const questionsFromIct704 = getRandomItems(ict704, 2);
        const questionsFromIct705 = getRandomItems(ict705, 2);
        const questionsFromIct706 = getRandomItems(ict706, 2);
        const questionsFromIct710 = getRandomItems(ict710, 2);
        const questionsFromIct720 = getRandomItems(ict720, 2);
        const questionsFromIct730 = getRandomItems(ict730, 3);
        const questionsFromIct740 = getRandomItems(ict740, 2);
        const questionsFromIct750 = getRandomItems(ict750, 2);

        // 3.**********update here after new data*****************
        const combinedQuestions = [
            ...questionsFromIct701,
            ...questionsFromIct704,
            ...questionsFromIct705,
            ...questionsFromIct706,
            ...questionsFromIct710,
            ...questionsFromIct720,
            ...questionsFromIct730,
            ...questionsFromIct740,
            ...questionsFromIct750
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
                    title: "ICT<তথ্য প্রযুক্তি Quick Practice - BCSpark",
                    category: "ICT - তথ্য প্রযুক্তি",
                    subject: "ICT < তথ্য প্রযুক্তি (ALL Topics)",
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