'use client';

import { useEffect, useState } from 'react';
import QuickPracticeEngine from './QuickPracticeEngine';

export default function T20QuizPage({ topicKey }) {
    const [questions, setQuestions] = useState(null);
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!topicKey) {
            setLoading(false);
            return;
        }

        fetch(`/api/t20/questions?key=${encodeURIComponent(topicKey)}`)
            .then((r) => {
                if (!r.ok) throw new Error(r.statusText);
                return r.json();
            })
            .then((d) => {
                setQuestions(d.questions);
                setConfig(d.config);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [topicKey]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl font-bold animate-pulse">Loading questions...</div>
            </div>
        );
    }

    if (!questions) return null;

    return <QuickPracticeEngine questions={questions} config={config || {}} />;
}