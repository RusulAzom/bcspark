'use client';
import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useSearchParams } from 'next/navigation'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function QuickPracticeEngine({ questions, title }) {
    const searchParams = useSearchParams()
    const [userName, setUserName] = useState('');

    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [time, setTime] = useState(120);
    const resultRef = useRef(null);

    // =======quiz time keeper ========
    const [timeTaken, setTimeTaken] = useState(120);
    const [submittedByTime, setSubmittedByTime] = useState(false);
    // ====== পপআপ এর জন্য নতুন state ======
    const [showSetup, setShowSetup] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');

    // ================negative merking============
    const [correctCount, setCorrectCount] = useState(0)
    const [wrongCount, setWrongCount] = useState(0)
    const [skippedCount, setSkippedCount] = useState(0)

    // ==============user name defult setting=============
    useEffect(() => {
        setUserName(searchParams.get('user') || 'BCSpark');
    }, [searchParams]);

    const canStart = userName.trim().length > 0 && selectedSubject && selectedTopic;

    const handleStart = () => {
        if (canStart) setShowSetup(false);
    };

    // ====== টাইমার ======
    useEffect(() => {
        if (submitted || showSetup) return;

        if (time <= 0) {
            setSubmitted(true);
            setSubmittedByTime(true);
            return;
        }

        const timer = setInterval(() => setTime((t) => t - 1), 1000);
        return () => clearInterval(timer);
    }, [time, submitted, showSetup]);

    // টাইম নেওয়া ক্যালকুলেট
    useEffect(() => {
        if (submitted) {
            setTimeTaken(120 - time);
        }
    }, [submitted, time]);

    // handle secelt option
    const handleSelect = (qIndex, optionIndex) => {
        if (submitted) return;
        setAnswers({ ...answers, [qIndex]: optionIndex });
        const currentQ = questions[qIndex]
        if (optionIndex === currentQ.ans) {
            setCorrectCount(prev => prev + 1)
        } else {
            setWrongCount(prev => prev + 1)
        }
    };

    const score = questions.filter((q, i) => answers[i] === q.ans).length;
    const showPracticeBtn = (score / questions.length) < 0.9;

    // =============Download JPEG============
    const downloadJPEG = async () => {
        if (!resultRef.current) return;

        const canvas = await html2canvas(resultRef.current, {
            scale: 2,
            width: 1080,
            height: 1350,
            backgroundColor: '#ffffff',
            windowWidth: 1080,
            useCORS: true,
            onclone: (clonedDoc) => {
                clonedDoc.body.style.background = '#ffffff';
                clonedDoc.body.style.width = '1080px';

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

        const dataURL = canvas.toDataURL('image/jpeg', 0.92);
        const link = document.createElement('a');
        link.download = `BCSparkT20-${score}-${questions.length}.jpg`;
        link.href = dataURL;
        link.click();
    };

    const getResultMessage = (name) => {
        if (score === 20) return [`${name}!🔥 আগুন লাগায় দিলা!`, "পুরা ২০ এ ২০!", "তোরে দিয়েই হবে বস, চালায় যা! 🔥"];
        if (score >= 16) return [`${name}!💪 ভালো স্কোর!`, "আরেকটু পড়লেই টপার।", "নকল ছাইড়া দে এবার 📚"];
        if (score >= 12) return [`${name}!😎তুই মোটামুটি পাস!`, "কিন্তু এই স্কোরে ক্যাডার হওয়া টাফ আছে", "মামা রাগ করলা নাকি? 😅"];
        if (score >= 5) return [`${name}!💀 তুই... ফেইল!`, "ভবিষ্যৎ ফকফকা আন্ধার", "সময় আছে, পড়তে বসো এখনই 📖"];
        return [`🪦 সর্বনাশ, ${name}!`, "লেখাপড়া বাদ দিয়া বিয়ের প্ল্যান নাকি?", "মজা করলাম! উঠো দাঁড়াও! নিচের রিসোর্স দেখো 💪"];
    };

    const timerColor = time <= 10 ? 'bg-red-200 text-red-900 animate-pulse' : 'bg-red-100 text-red-900';

    return (
        <>
            <Navbar />
            <div className="max-w-6xl mx-auto p-6">
                {/* পপআপ মডাল */}
                {showSetup && (
                    <div className="fixed inset-x-0 bottom-0 top-16 bg-black/60 z-30 flex items-center justify-center p-4">                        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
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
                                    <option value="Spelling Test">Grammar - Spelling Test ✅ Active</option>
                                    <option value="Synonyms" disabled>Grammar - Synonyms 🔒 Coming Soon</option>
                                    <option value="One Word" disabled>Vocabulary - One Word Substitution 🔒 Coming Soon</option>
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

                {/* কুইজ */}
                {!showSetup && (
                    <>
                        {/* ==================Top Branding header================= */}
                        <div className="flex items-center justify-between mb-6 pb-4">

                            <div className={`fixed top-4 right-4 z-50 text-xl font-mono px-4 py-2 rounded-lg font-bold shadow-lg ${timerColor}`}>
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
                            <div ref={resultRef} className="w-[1080px] mt-8 bg-white p-1 rounded-xl shadow relative overflow-hidden">

                                <img
                                    src="/logo/logo.png"
                                    alt="watermark"
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 w-300 pointer-events-none select-none"
                                />

                                <div className="mt-6 p-2 mb-4 rounded-2xl text-white shadow-2xl relative z-10"
                                    style={{
                                        background: 'linear-gradient(135deg, #E95420 0%, #F9A825 60%, #e956208e 50%)'
                                     }}>

                                    <div className="grid grid-cols-2 gap-4 items-center">
                                        <div className="text-left space-y-3">
                                            <div className="space-y-2">
                                                {getResultMessage(userName).map((line, index) => (
                                                    <p key={index} className={`font-bold ${index === 0 ? "text-2xl" : "text-lg opacity-90"}`}>
                                                        {line}
                                                    </p>
                                                ))}
                                            </div>

                                            <h4 className="text-xl mt-2">
                                                {submittedByTime ? "⏰ টাইম শেষ!" : `⏰সময় নিয়েছো: ${timeTaken} সেকেন্ড`}
                                            </h4>
                                            <p className="flex gap-6 text-xl">
                                                <span>✅ সঠিক: {correctCount}</span>
                                                <span>❌ ভুল: {wrongCount}</span>
                                                <span>⏭️ স্কিপ: {skippedCount}</span>
                                            </p>
                                            <h3 className="text-2xl font-bold">
                                                আমোলনামা: {(correctCount - (wrongCount * 0.5)).toFixed(2)} / {questions.length}
                                            </h3>
                                        </div>

                                        <div className="text-center md:text-right border-l-0 md:border-l md:border-white/20 md:pl-6">
                                            <h2 className="text-3xl font-extrabold mb-2 tracking-wide">
                                                T20 QUICK QUIZ
                                            </h2>
                                            <img
                                                src="/logo/logo.png"
                                                alt="BCSpark Logo"
                                                className="w-30 h-30 mx-auto md:ml-auto md:mr-0 bg-none p-0 rounded-xl shadow-lg"
                                            />
                                            <p className="text-sm opacity-80 mb-4">Powered by BCSpark</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                                    {questions.map((q, i) => (
                                        <div key={q.id} className="border rounded-lg p-2 bg-gray-50">
                                            <p className="font-semibold text-xs mb-1">প্রশ্ন {i + 1}: {q.q}</p>
                                            <p className="text-[11px]">উত্তর: {q.options[answers[i]] || 'দাও নাই'}
                                                <span className={`ml-1 font-bold ${answers[i] === q.ans ? 'text-green-600' : 'text-red-600'}`}>
                                                    {answers[i] === q.ans ? '✓' : `✗ ${q.options[q.ans]}`}
                                                </span>
                                            </p>
                                            <p className="text-[9px] text-gray-500 mt-0.5">Source: {q.source}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4 relative z-10">
                                    <button
                                        onClick={downloadJPEG}
                                        className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700"
                                    >
                                        📥 উত্তরপত্র ডাউনলোড করো
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

                                <div className="mt-6 pt-4 border-t text-center relative z-10">
                                    <p className="text-xs text-gray-400">Generated by BCSpark.com | Quick Practice Tool</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </>
    )
}