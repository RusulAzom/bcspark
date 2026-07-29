'use client';
// নতুন পেজ যুক্ত করলে এখানে import করতে হবে, তারপর number হিসেব করে দিতে হবে,  
import { useState, useEffect } from 'react';
// *********1. update here after new data  *****************
import abohaoyaJolobayu from '../../../../../data/t20/vugolPoribeshDM/poribesh/abohaoyaJolobayu.json';
import bangladesherPoribesh from '../../../../../data/t20/vugolPoribeshDM/poribesh/bangladesher_poribesh.json';
import voutoPoribesh from '../../../../../data/t20/vugolPoribeshDM/poribesh/vouto_Poribesh.json';

import QuickPracticeEngine from '@/components/QuickPracticeEngine';

// Helper: array থেকে random n টা item নেওয়া - Type বাদ
function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function poribeshPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // 2. ************* update here after new data নম্বর বণ্টন কর*************
        const questionsFromAbohaoyaJolobayu = getRandomItems(abohaoyaJolobayu, 7);
        const questionsFromBangladesherPoribesh = getRandomItems(bangladesherPoribesh, 7);
        const questionsFromVoutoPoribesh = getRandomItems(voutoPoribesh, 6);

        // 3.**********update here after new data*****************
        const combinedQuestions = [
            ...questionsFromAbohaoyaJolobayu,
            ...questionsFromBangladesherPoribesh,
            ...questionsFromVoutoPoribesh
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
                    // *************=====5. change here ======*****************
                    title: "পরিবেশ Quiz Test - BCSpark",
                    category: "ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা",
                    subject: "পরিবেশ",
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