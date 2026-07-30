'use client';
import { useState, useEffect } from 'react';
import boishhikItihas from '../../../../../data/t20/gkInternational/itihasVurajnitiOnchol/boishhikItihas.json';
import itihasVurajnitiOnchol from '../../../../../data/t20/gkInternational/itihasVurajnitiOnchol/itihasVurajnitiOnchol.json';
import notunPuratonNam from '../../../../../data/t20/gkInternational/itihasVurajnitiOnchol/notunPuratonNam.json';
import vurajniti from '../../../../../data/t20/gkInternational/itihasVurajnitiOnchol/vurajniti.json';
import QuickPracticeEngine from '@/components/QuickPracticeEngine';

function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function ItihasVurajnitiPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const q1 = getRandomItems(boishhikItihas, 5);
        const q2 = getRandomItems(itihasVurajnitiOnchol, 5);
        const q3 = getRandomItems(notunPuratonNam, 5);
        const q4 = getRandomItems(vurajniti, 5);

        const combinedQuestions = [...q1, ...q2, ...q3, ...q4];
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
                    title: "বৈশ্বিক ইতিহাস, আঞ্চলিক ও আন্তর্জাতিক ব্যবস্থা - GK Quiz - BCSpark",
                    category: "GK - আন্তর্জাতিক",
                    subject: "বৈশ্বিক ইতিহাস, আঞ্চলিক ও আন্তর্জাতিক ব্যবস্থা, ভূ-রাজনীতি",
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