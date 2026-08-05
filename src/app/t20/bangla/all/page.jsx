'use client';
// নতুন পেজ যুক্ত করলে এখানে import করতে হবে, তারপর number হিসেব করে দিতে হবে,  
import { useState, useEffect } from 'react';
// *********1. update here after new data  *****************
import muktijudhovashaandolon from '../../../../../data/t20/bangla/literature/muktijudhdhovashaandolon.json';
import pokritioprotoy from '../../../../../data/t20/bangla/grammar/theory/pokritioprotoy.json';
import modhdhojug from '../../../../../data/t20/bangla/literature/modhdhojug.json';
import prachinjug from '../../../../../data/t20/bangla/literature/prachinjug.json';
import writing from '../../../../../data/t20/bangla/grammar/writing/writing.json';
import karokobivokti from '../../../../../data/t20/bangla/grammar/theory/karokobivokti.json';

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
        const questionsFromMuktijudhovashaandolon = getRandomItems(muktijudhovashaandolon, 2);
        const questionsFromPokritioprotoy = getRandomItems(pokritioprotoy, 2);
        const questionsFromModhdhojug = getRandomItems(modhdhojug, 4);
        const questionsFromPrachinjug = getRandomItems(prachinjug, 4);
        const questionsFromWriting = getRandomItems(writing, 4);
        const questionsFromKarok = getRandomItems(karokobivokti, 4);

        // 3.**********update here after new data*****************
        const combinedQuestions = [
            ...questionsFromModhdhojug,
            ...questionsFromPokritioprotoy,
            ...questionsFromMuktijudhovashaandolon,
            ...questionsFromPrachinjug,
            ...questionsFromWriting,
            ...questionsFromKarok
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
                    title: "Bangla Quick Practice - BCS",
                    category: "Bangla",
                    subject: "Bangla All",
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