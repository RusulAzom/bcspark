'use client';
// নতুন পেজ যুক্ত করলে এখানে import করতে হবে, তারপর number হিসেব করে দিতে হবে,  
import { useState, useEffect } from 'react';
// *********1. update here after new data  *****************
import koshTisueGenetics from '../../../../../data/t20/sadharonBiggan/biology/koshTisueGenetics.json';
import praniBidda from '../../../../../data/t20/sadharonBiggan/biology/praniBidda.json';
import puttiOnubiggan from '../../../../../data/t20/sadharonBiggan/biology/puttiOnubiggan.json';
import rogShastho from '../../../../../data/t20/sadharonBiggan/biology/rogShastho.json';
import sorirtottoManobdeh from '../../../../../data/t20/sadharonBiggan/biology/sorirtottoManobdeh.json';
import udvhidBiggan from '../../../../../data/t20/sadharonBiggan/biology/udvhidBiggan.json';

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
        const questionsFromKoshTisueGenetics = getRandomItems(koshTisueGenetics, 4);
        const questionsFromPraniBidda = getRandomItems(praniBidda, 3);
        const questionsFromPuttiOnubiggan = getRandomItems(puttiOnubiggan, 3);
        const questionsFromRogShastho = getRandomItems(rogShastho, 3);
        const questionsFromSorirtottoManobdeh = getRandomItems(sorirtottoManobdeh, 3);
        const questionsFromUdvhidBiggan = getRandomItems(udvhidBiggan, 4);

        // 3.**********update here after new data*****************
        const combinedQuestions = [
            ...questionsFromKoshTisueGenetics,
            ...questionsFromPraniBidda,
            ...questionsFromPuttiOnubiggan,
            ...questionsFromRogShastho,
            ...questionsFromSorirtottoManobdeh,
            ...questionsFromUdvhidBiggan
            
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
                    title: "Biology (জীব বিজ্ঞান) কুইজ টেস্ট - BCSpark",
                    category: "সাধারণ বিজ্ঞান",
                    subject: "Biology (জীববিজ্ঞান)",
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