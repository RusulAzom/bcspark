'use client';
// নতুন পেজ যুক্ত করলে এখানে import করতে হবে, তারপর number হিসেব করে দিতে হবে,  
import { useState, useEffect } from 'react';
// *********1. update here after new data  *****************
// ভূগোল topics
import vugol from '../../../../../data/t20/vugolPoribeshDM/vugol/vugol.json';
// পরিবেশ topics
import abohaoyaJolobayu from '../../../../../data/t20/vugolPoribeshDM/poribesh/abohaoyaJolobayu.json';
import bangladesherPoribesh from '../../../../../data/t20/vugolPoribeshDM/poribesh/bangladesher_poribesh.json';
import voutoPoribesh from '../../../../../data/t20/vugolPoribeshDM/poribesh/vouto_Poribesh.json';
// দুর্যোগ ব্যবস্থাপনা topics
import prakitikDurjogBabosthapona from '../../../../../data/t20/vugolPoribeshDM/durjogBabosthapona/prakitikDurjogBabosthapona.json';

import QuickPracticeEngine from '@/components/QuickPracticeEngine';

// Helper: array থেকে random n টা item নেওয়া - Type বাদ
function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function vugolPoribeshAllPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // 2. ************* update here after new data নম্বর বণ্টন কর*************
        // 7 from ভূগোল
        const q1 = getRandomItems(vugol, 7);
        // 7 from পরিবেশ (2+2+3)
        const q2 = getRandomItems(abohaoyaJolobayu, 2);
        const q3 = getRandomItems(bangladesherPoribesh, 2);
        const q4 = getRandomItems(voutoPoribesh, 3);
        // 6 from দুর্যোগ ব্যবস্থাপনা
        const q5 = getRandomItems(prakitikDurjogBabosthapona, 6);

        // 3.**********update here after new data*****************
        const combinedQuestions = [
            ...q1,
            ...q2, ...q3, ...q4,
            ...q5
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
                    title: "ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা - All Topics Quiz Test - BCSpark",
                    category: "ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা",
                    subject: "ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা (All Topics)",
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