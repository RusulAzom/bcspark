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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Quick Practice শুরু করো</h2>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">পরীক্ষার্থীর নাম: *</label>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="তোমার নাম লেখো" className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none" />
                </div>

                <div className="mb-4">
                    <label className="block font-semibold mb-2">Subject সিলেক্ট করো ▼</label>
                    <select value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); setSelectedTopic(''); }} className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none">
                        <option value="">-- সিলেক্ট করো --</option>
                        <option value="English">Ok English</option>
                        <option value="Bangla">Bangla</option>
                        <option value="Math">Math</option>
                        <option value="GK">GK</option>

                    </select>
                </div>

                {selectedSubject === 'English' && (
                    <div className="mb-6">
                        <label className="block font-semibold mb-2">Topic সিলেক্ট করো ▼</label>
                        <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none">
                            <option value="">-- সিলেক্ট করো --</option>
                            <option value="Spelling Test">Ok Grammar &gt; Spelling Test ✅ Active</option>
                        </select>
                    </div>
                )}

                {/* GK - TEST ER JONNO LAL TITLE */}
                {selectedSubject === 'GK' && (
                    <div className="mb-6">
                        <label className="block font-semibold mb-2 text-red-600">GK Topic সিলেক্ট করো ▼ NEW</label>
                        <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} className="w-full border-2 border-red-500 rounded-lg px-4 py-3 focus:border-red-500 outline-none">
                            <option value="">-- সিলেক্ট করো --</option>
                            <option value="All GK">GK &gt; All Topics ✅ Active</option>
                            <option value="Bangladesh Affairs" disabled>GK &gt; বাংলাদেশ বিষয়াবলি 🔒 Coming Soon</option>
                            <option value="Language Movement" disabled>GK &gt; ভাষা আন্দোলন -- মুক্তিযুদ্ধ 🔒 Coming Soon</option>
                            <option value="Bangladesh Economy" disabled>GK &gt; বাংলাদেশের অর্থনীতি 🔒 Coming Soon</option>
                            <option value="Bangladesh Census" disabled>GK &gt; বাংলাদেশের জনশুমারি 🔒 Coming Soon</option>
                            <option value="Industry & Commerce" disabled>GK &gt; বাংলাদেশের শিল্প ও বাণিজ্য 🔒 Coming Soon</option>
                            <option value="Constitution" disabled>GK &gt; বাংলাদেশের সংবিধান 🔒 Coming Soon</option>
                            <option value="International Affairs" disabled>GK &gt; আন্তর্জাতিক বিষয়াবলি 🔒 Coming Soon</option>
                            <option value="World History" disabled>GK &gt; বৈশ্বিক ইতিহাস 🔒 Coming Soon</option>
                            <option value="Recent Events" disabled>GK &gt; সাম্প্রতিক ও ঘটনাপ্রবাহ 🔒 Coming Soon</option>
                        </select>
                    </div>
                )}

                <button onClick={handleStart} disabled={!canStart} className={`w-full py-4 rounded-lg font-bold text-white transition ${canStart ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}>
                    Start Practice 🚀
                </button>
            </div>
        </div>
    )
}