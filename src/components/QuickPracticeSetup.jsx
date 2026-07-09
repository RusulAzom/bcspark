'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import practiceRoutes from '@/data/practiceRoutes';

export default function QuickPracticeSetup() {

    const router = useRouter();

    const [userName, setUserName] = useState('BCSpark');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const canStart = userName.trim().length > 0 && selectedSubject && selectedTopic;
    const handleStart = () => {

        if (!canStart) return;

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

    return (
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
            {selectedSubject && (

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
    );
}