'use client';
import { useEffect, useState } from 'react';

import QuickPracticeEngine from '@/components/QuickPracticeEngine';

// Questions are fetched from the internal quiz API so that only the selected
// questions ship to the browser instead of the full JSON pools
// (see INTERNAL_API_DOCS.md §2).
export default function VugolPoribeshAllPage() {
    const [randomQuestions, setRandomQuestions] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadQuestions() {
            try {
                const response = await fetch('/api/quiz/vugol-poribesh-dm/all');
                if (!response.ok) {
                    throw new Error(`Failed to load questions (${response.status})`);
                }
                const payload = await response.json();
                if (cancelled) return;
                setRandomQuestions(Array.isArray(payload.questions) ? payload.questions : []);
                setIsReady(true);
            } catch (err) {
                console.error('Failed to load Vugol Poribesh all-topic questions:', err);
                if (!cancelled) setError(err.message || 'Failed to load questions');
            }
        }

        loadQuestions();

        return () => {
            cancelled = true;
        };
    }, []);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg font-semibold text-red-600">
                    প্রশ্ন লোড করা যায়নি। পৃষ্ঠাটি রিফ্রেশ করে আবার চেষ্টা করুন।
                </div>
            </div>
        );
    }

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