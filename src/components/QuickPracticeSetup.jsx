'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import practiceRoutes, { defaultQuizConfig } from '@/data/practiceRoutes';

export default function QuickPracticeSetup() {

    const router = useRouter();

    const [userName, setUserName] = useState('BCSpark');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    // Restore previous setup from sessionStorage and auto-show popup on retry
    useEffect(() => {
        const savedSetup = sessionStorage.getItem("quickPracticeSetup");
        if (savedSetup) {
            try {
                const setup = JSON.parse(savedSetup);
                if (setup.name) setUserName(setup.name);
                if (setup.subject) setSelectedSubject(setup.subject);
                if (setup.topic) setSelectedTopic(setup.topic);
            } catch (e) {
                // ignore parse errors
            }
        }

        const isRetry = sessionStorage.getItem("quickPracticeRetry");
        if (isRetry) {
            setShowConfirm(true);
            sessionStorage.removeItem("quickPracticeRetry");
        }
    }, []);

    const canStart = userName.trim().length > 0 && selectedSubject && selectedTopic;

    const topicConfig =
        practiceRoutes[selectedSubject]?.topics[selectedTopic]?.config || defaultQuizConfig;

    const proceed = () => {

        sessionStorage.removeItem("quickPracticeRetry");

        sessionStorage.setItem(
            "quickPracticeSetup",
            JSON.stringify({
                name: userName,
                subject: selectedSubject,
                topic: selectedTopic,
                skipSetup: true,
            })
        );

        const route =
            practiceRoutes[selectedSubject]?.topics[selectedTopic]?.route;

        if (route) {
            router.push(route);
        }
    };

    const handleStart = () => {
        if (!canStart) return;
        setShowConfirm(true);
    };

    return (
        <>
            <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-xl p-8">

            <h2 className="text-2xl font-bold text-center mb-6">
                Quick Practice শুরু করো
            </h2>

            {/* Name */}
            <div className="mb-4">
                <label className="block font-semibold mb-2">
                    পরীক্ষার্থীর নাম
                </label>

                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full border-2 rounded-lg px-4 py-3"
                />
            </div>

            {/* Subject */}
            <div className="mb-4">
                <label className="block font-semibold mb-2">
                    Subject
                </label>

                <select
                    value={selectedSubject}
                    onChange={(e) => {
                        setSelectedSubject(e.target.value);
                        setSelectedTopic('');
                    }}
                    className="w-full border-2 rounded-lg px-4 py-3"
                >
                    <option value="">-- Select --</option>

                    {Object.entries(practiceRoutes).map(([id, subject]) => (
                        <option key={id} value={id}>
                            {subject.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Topic */}
            {selectedSubject && practiceRoutes[selectedSubject] && (

                <div className="mb-6">

                    <label className="block font-semibold mb-2">
                        Topic
                    </label>

                    <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="w-full border-2 rounded-lg px-4 py-3"
                    >
                        <option value="">-- Select --</option>

                        {Object.entries(
                            practiceRoutes[selectedSubject].topics
                        ).map(([id, topic]) => (

                            <option
                                key={id}
                                value={id}
                                disabled={!topic.active}
                            >
                                {topic.label}
                                {topic.active
                                    ? " ✅ Active"
                                    : " 🔒 Coming Soon"}
                            </option>

                        ))}

                    </select>

                </div>

            )}
            {/* start button */}
            <button
                onClick={handleStart}
                disabled={!canStart}
                className={`w-full py-4 rounded-lg font-bold text-white transition ${canStart
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
            >
                Start Practice 🚀
            </button>

        </div>

        {/* ====== Match Ready Confirmation Popup ====== */}
        {showConfirm && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                onClick={() => {
                    sessionStorage.removeItem("quickPracticeRetry");
                    setShowConfirm(false);
                }}
            >
                <div
                    className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div
                        className="px-6 py-5 text-white text-center"
                        style={{
                            background: 'linear-gradient(135deg, #E95420 0%, #F9A825 100%)'
                        }}
                    >
                        <h3 className="text-xl font-extrabold leading-snug">
                            তুমি কি ম্যাচ খেলতে প্রস্তুত?
                        </h3>
                        {userName.trim() && (
                            <p className="text-sm opacity-90 mt-1">
                                {userName.trim()} 🏏
                            </p>
                        )}
                    </div>

                    {/* Rules List */}
                    <div className="px-6 py-5">
                        <p className="font-bold text-gray-700 mb-3">
                            খেলার নিয়মঃ 
                        </p>
                        <ul className="space-y-3 text-gray-800">
                            <li className="flex items-start gap-2">
                                <span>⏱️</span>
                                <span>
                                    পরীক্ষার সময়: <strong>{topicConfig.timeLimit} সেকেন্ড</strong>
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>🎯</span>
                                <span>
                                    মোট প্রশ্নসংখ্যা: <strong>{topicConfig.questionLimit}টি</strong>
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>⚠️</span>
                                <span>
                                    নেগেটিভ মার্কিং: প্রতিটি ভুল উত্তরের জন্য{' '}
                                    <strong>{topicConfig.negativeMarking.toFixed(2)} নম্বর</strong> কাটা যাবে!
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-6 pb-6 flex flex-col gap-3">
                        <button
                            onClick={proceed}
                            className="w-full py-3 rounded-lg font-bold text-white transition hover:opacity-90"
                            style={{
                                background: 'linear-gradient(135deg, #E95420 0%, #F9A825 100%)'
                            }}
                        >
                            🔥 হ্যাঁ! খেলা হবে
                        </button>
                        <button
                            onClick={() => {
                                sessionStorage.removeItem("quickPracticeRetry");
                                setShowConfirm(false);
                            }}
                            className="w-full py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 border-2 border-gray-300 transition hover:bg-gray-200"
                        >
                            🏃‍♂️ না, পরে খেলি
                        </button>
                    </div>
                </div>
            </div>
        )}

    </>
    );
}