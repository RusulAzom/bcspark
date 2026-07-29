'use client';
// নতুন পেজ যুক্ত করলে এখানে import করতে হবে, তারপর number হিসেব করে দিতে হবে,  
import { useState, useEffect } from 'react';
// *********1. update here after new data  *****************
import acidKharLobon from '../../../../../data/t20/sadharonBiggan/chemistry/acidKharLobon.json';
import bikriyaoToritKosh from '../../../../../data/t20/sadharonBiggan/chemistry/bikriyaoToritKosh.json';
import dhatuKhonijPodartho from '../../../../../data/t20/sadharonBiggan/chemistry/dhatuKhonijPodartho.json';
import folitRosayon from '../../../../../data/t20/sadharonBiggan/chemistry/folitRosayon.json';
import joiboOjoiboChemistry from '../../../../../data/t20/sadharonBiggan/chemistry/joiboOjoiboChemistry.json';
import podartherGothonObosthan from '../../../../../data/t20/sadharonBiggan/chemistry/podartherGothonObosthan.json';

import QuickPracticeEngine from '@/components/QuickPracticeEngine';

// Helper: array থেকে random n টা item নেওয়া - Type বাদ
function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function noitikotamsPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // 2. ************* update here after new data নম্বর বণ্টন কর*************
        const questionsFromAcidKharLobon = getRandomItems(acidKharLobon, 3);
        const questionsFromBikriyaoToritKosh = getRandomItems(bikriyaoToritKosh, 4);
        const questionsFromDhatuKhonijPodartho = getRandomItems(dhatuKhonijPodartho, 3);
        const questionsFromFolitRosayon = getRandomItems(folitRosayon, 3);
        const questionsFromJoiboOjoiboChemistry = getRandomItems(joiboOjoiboChemistry, 4);
        const questionsFromPodartherGothonObosthan = getRandomItems(podartherGothonObosthan, 3);

        // 3.**********update here after new data*****************
        const combinedQuestions = [
            ...questionsFromAcidKharLobon,
            ...questionsFromBikriyaoToritKosh,
            ...questionsFromDhatuKhonijPodartho,
            ...questionsFromFolitRosayon,
            ...questionsFromJoiboOjoiboChemistry,
            ...questionsFromPodartherGothonObosthan
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
                    title: "Chemistry (রসায়ন বিজ্ঞান) Quiz Test - BCSpark",
                    category: "সাধারণ বিজ্ঞান",
                    subject: "Chemistry (রসায়ন বিজ্ঞান)",
                    step: "03",
                    passMark: 50,
                    questionLimit: 18,
                    timeLimit: 120,
                    timerDisplay: "t20",
                    negativeMarking: 0.5,
                    randomize: true,
                }}
            />
        </div>
    );
}