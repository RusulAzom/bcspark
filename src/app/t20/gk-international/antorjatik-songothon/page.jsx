'use client';
import { useState, useEffect } from 'react';
import intRajnoitikJot from '../../../../../data/t20/gkInternational/antorjatikSongothon/int_rajnoitikJot.json';
import manobOdhikarSongstha from '../../../../../data/t20/gkInternational/antorjatikSongothon/manobOdhikarSongstha.json';
import orthonoitikCuktiSonstha from '../../../../../data/t20/gkInternational/antorjatikSongothon/orthonoitikCuktiSonstha.json';
import UNJatisongho from '../../../../../data/t20/gkInternational/antorjatikSongothon/UN_Jatisongho.json';
import QuickPracticeEngine from '@/components/QuickPracticeEngine';

function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function AntorjatikSongothonPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const q1 = getRandomItems(intRajnoitikJot, 5);
        const q2 = getRandomItems(manobOdhikarSongstha, 5);
        const q3 = getRandomItems(orthonoitikCuktiSonstha, 5);
        const q4 = getRandomItems(UNJatisongho, 5);

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
                    title: "আন্তর্জাতিক সংগঠনসমূহ এবং বৈশ্বিক অর্থনৈতিক প্রতিষ্ঠানাদি - GK Quiz - BCSpark",
                    category: "GK - আন্তর্জাতিক",
                    subject: "আন্তর্জাতিক সংগঠনসমূহ এবং বৈশ্বিক অর্থনৈতিক প্রতিষ্ঠানাদি",
                    step: "05",
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