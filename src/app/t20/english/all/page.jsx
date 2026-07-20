'use client';
// নতুন পেজ যুক্ত করলে এখানে import করতে হবে, তারপর number হিসেব করে দিতে হবে,  
import { useState, useEffect } from 'react';
// *********1. update here after new data  *****************
import spelling from '../../../../../data/t20/english/grammar/spelling/spelling.json';
import tense from '../../../../../data/t20/english/grammar/tense/tense.json';
import verb482 from '../../../../../data/t20/english/grammar/verb/verb482.json';
import vocabulary from '../../../../../data/t20/english/grammar/vocabulary/vocabulary.json';
import voice from '../../../../../data/t20/english/grammar/voice/voice.json';
import literature from '../../../../../data/t20/english/literature/literature.json';


import QuickPracticeEngine from '@/components/QuickPracticeEngine';

// Helper: array থেকে random n টা item নেওয়া - Type বাদ
function getRandomItems(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

export default function englishPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // 2. ************* update here after new data নম্বর বণ্টন কর*************
        const questionsFromSpelling = getRandomItems(spelling, 2);
        const questionsFromTense = getRandomItems(tense, 4);
        const questionsFromVerb482 = getRandomItems(verb482, 4);
        const questionsFromVocabulary = getRandomItems(vocabulary, 4);
        const questionsFromVoice = getRandomItems(voice, 4);
        const questionsFromLiterature = getRandomItems(literature, 2);

        // 3.**********update here after new data*****************
        const combinedQuestions = [
            ...questionsFromSpelling,
            ...questionsFromTense,
            ...questionsFromVerb482,
            ...questionsFromVocabulary,
            ...questionsFromVoice,
            ...questionsFromLiterature,
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
                    title: "English Quick Practice (All) - BCSpark",
                    category: "English",
                    subject: "English All",
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