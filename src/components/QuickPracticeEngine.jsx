'use client';
import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function QuickPracticeEngine({ questions, title }) {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [time, setTime] = useState(120);
    const resultRef = useRef(null);

    // ====== পপআপ এর জন্য নতুন state ======
    const [showSetup, setShowSetup] = useState(true);
    const [userName, setUserName] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');

    const canStart = userName.trim().length > 0 && selectedSubject && selectedTopic;

    const handleStart = () => {
        if (canStart) setShowSetup(false);
    };
    // ====== পপআপ state শেষ ======

    useEffect(() => {
        if (submitted) return;
        const timer = setInterval(() => {
            setTime(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setSubmitted(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [submitted]);

    const handleSelect = (qIndex, optionIndex) => {
        if (submitted) return;
        setAnswers({ ...answers, [qIndex]: optionIndex });
    };

    const score = questions.filter((q, i) => answers[i] === q.ans).length;
    const showPracticeBtn = (score / questions.length) < 0.9;

    const downloadJPEG = async () => {
        if (!resultRef.current) return;
        const canvas = await html2canvas(resultRef.current, {
            scale: 2,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
                clonedDoc.body.style.background = '#ffffff';
                const allElements = clonedDoc.querySelectorAll('*');
                allElements.forEach(el => {
                    const style = window.getComputedStyle(el);
                    if (style.backgroundColor.includes('lab') || style.backgroundColor.includes('oklch')) {
                        el.style.backgroundColor = '#ffffff';
                    }
                    if (style.color.includes('lab') || style.color.includes('oklch')) {
                        el.style.color = '#000';
                    }
                    if (style.borderColor.includes('lab') || style.borderColor.includes('oklch')) {
                        el.style.borderColor = '#d1d5db';
                    }
                });
            }
        });
        const dataURL = canvas.toDataURL('image/jpeg', 0.9);
        const link = document.createElement('a');
        link.download = `spelling-${score}-${questions.length}.jpg`;
        link.href = dataURL;
        link.click();
    };

    const getResultMessage = () => {
        if (score === 20) return "20 e 20 Pele tui to agun.... Hbe tore diye hbe, chaliye jai boss 🔥";
        if (score >= 14) return "14 theke 19, Valo Porte hbe... Nokol ar hbe na 📚";
        if (score >= 10) return "10 theke 14 Pele Valo, kintu ETA diye cadare hotel parbi na 😅";
        if (score >= 5) return "10 er Kom hole tui fail, Valo kore pore ay 💀";
        return "5 er Kom hole, tor vobissot Andhra lekhapora bad de tui 🪦";
    };

    const timerColor = time <= 10 ? 'bg-red-200 text-red-900 animate-pulse' : 'bg-red-100 text-red-900';

    return (
        <div className="max-w-6xl mx-auto p-6">

            {/* পপআপ মডাল */}
            {showSetup && (
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
                                    <option value="Antonyms" disabled>Grammar &gt; Antonyms 🔒 Coming Soon</option>
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
            )}

            {/* কুইজ শুধু পপআপ বন্ধ হলে দেখাবে */}
            {!showSetup && (
                <>
                    {/* ====== 1. টপ ব্র্যান্ডিং হেডার ====== */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b">
                        <div className="flex items-center gap-3">
                            <img src="/logo/logo_hr.png" alt="BCSpark" className="h-10" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">BCSpark Quick Practice</h2>
                                <p className="text-xs text-gray-500">Spelling Test Engine</p>
                            </div>
                        </div>
                        <div className={`text-xl font-mono px-4 py-2 rounded-lg font-bold ${timerColor}`}>
                            ⏱️ {time}s
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>

                    <div className="grid md:grid-cols-2 gap-6">
                        {questions.map((q, i) => {
                            const correctOptionIndex = q.ans;
                            const selectedOptionIndex = answers[i];

                            return (
                                <div key={q.id} className="bg-white p-4 rounded-xl shadow border">
                                    <div className="flex justify-between items-start mb-3">
                                        <p className="font-semibold text-lg">প্রশ্ন {i + 1}</p>
                                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{q.source}</span>
                                    </div>

                                    <p className="mb-4 text-base">{q.q}</p>

                                    <div className="grid grid-cols-2 gap-2">
                                        {q.options.map((opt, idx) => {
                                            const isSelected = selectedOptionIndex === idx;
                                            const isCorrect = submitted && idx === correctOptionIndex;
                                            const isWrong = submitted && isSelected && idx !== correctOptionIndex;

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSelect(i, idx)}
                                                    disabled={submitted}
                                                    className={`p-3 rounded-full border-2 text-center transition-all font-medium disabled:cursor-not-allowed
                        ${isCorrect ? 'bg-green-200 border-green-600 text-green-900' : ''}
                        ${isWrong ? 'bg-red-200 border-red-600 text-red-900' : ''}
                        ${isSelected && !submitted ? 'bg-blue-200 border-blue-600' : 'bg-white border-gray-300 hover:border-blue-400'}
                      `}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {!submitted ? (
                        <button
                            onClick={() => setSubmitted(true)}
                            className="mt-8 w-full bg-blue-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-blue-700"
                        >
                            Submit করো
                        </button>
                    ) : (
                        <div ref={resultRef} className="mt-8 bg-white p-8 rounded-xl shadow relative overflow-hidden">

                            {/* ওয়াটারমার্ক লোগো - মাঝখানে ঘোলা */}
                            <img
                                src="/logo/logo.png"
                                alt="watermark"
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 w-96 pointer-events-none select-none"
                            />

                            <h2 className="text-3xl font-bold mb-2 text-center relative z-10">⏰ টাইম শেষ!</h2>
                            <h3 className="text-4xl font-bold mb-2 text-center relative z-10">রেজাল্ট: {score}/{questions.length}</h3>
                            <p className="text-xl text-center mb-6 relative z-10">{getResultMessage()}</p>

                            <div className="space-y-3 mb-6 relative z-10">
                                {questions.map((q, i) => (
                                    <div key={q.id} className="border-b pb-2">
                                        <p className="font-semibold">প্রশ্ন {i + 1}: {q.q}</p>
                                        <p className="text-sm">তোমার উত্তর: {q.options[answers[i]] || 'দাও নাই'}
                                            <span className={`ml-2 font-bold ${answers[i] === q.ans ? 'text-green-600' : 'text-red-600'}`}>
                                                {answers[i] === q.ans ? '✓' : `✗ সঠিক: ${q.options[q.ans]}`}
                                            </span>
                                        </p>
                                        <p className="text-xs text-gray-500">Source: {q.source}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4 relative z-10">
                                <button
                                    onClick={downloadJPEG}
                                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
                                >
                                    📥 JPEG ডাউনলোড করো
                                </button>

                                {showPracticeBtn && (
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                                    >
                                        🔄 আবার Practice দাও
                                    </button>
                                )}
                            </div>

                            {/* ====== 3. ফুটার ব্র্যান্ডিং ====== */}
                            <div className="mt-6 pt-4 border-t text-center relative z-10">
                                <p className="text-xs text-gray-400">Generated by BCSpark.com | Quick Practice Tool</p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}