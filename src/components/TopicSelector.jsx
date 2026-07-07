'use client'
import { useState } from 'react'

export default function TopicSelector({ onStart }) {
    const [userName, setUserName] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')
    const [selectedTopic, setSelectedTopic] = useState('')

    const canStart = userName.trim() && selectedSubject && selectedTopic

    const handleStart = () => {
        if (canStart) {
            onStart({ userName, selectedSubject, selectedTopic })
        }
    }

    return (                                          // <-- return এখান থেকে শুরু
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Quick Practice শুরু করো</h2>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">পরীক্ষার্থীর নাম: *</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="তোমার নাম লেখো"
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Subject সিলেক্ট করো ▼</label>
                    <select
                        value={selectedSubject}
                        onChange={(e) => { setSelectedSubject(e.target.value); setSelectedTopic(''); }}
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                    >
                        <option value="">-- সিলেক্ট করো --</option>
                        <option value="English">English</option>
                        <option value="Bangla">Bangla</option>
                        <option value="Math">Math</option>
                        <option value="GK">GK</option>
                    </select>
                </div>

                {selectedSubject === 'English' && (
                    <div className="mb-6">
                        <label className="block font-semibold mb-2">Topic সিলেক্ট করো ▼</label>
                        <select
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                        >
                            <option value="">-- সিলেক্ট করো --</option>
                            <option value="Spelling Test">Grammar &gt; Spelling Test ✅ Active</option>
                            <option value="Synonyms" disabled>Grammar &gt; Synonyms 🔒 Coming Soon</option>
                            <option value="Antonyms" disabled>Antonyms 🔒 Coming Soon</option>
                            <option value="One Word" disabled>Vocabulary &gt; One Word Substitution 🔒 Coming Soon</option>
                        </select>
                    </div>
                )}

                <button
                    onClick={handleStart}
                    disabled={!canStart}
                    className={`w-full py-4 rounded-lg font-bold text-white transition ${canStart ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                    Start Practice 🚀
                </button>
            </div>
        </div>
    )                                                   // <-- return এখানে শেষ )
}