'use client';
import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useRouter } from 'next/navigation';

// Seconds allotted per question for mock model tests launched from the
// homepage card via ?total=N&exam=<subject>:<topic> URL params plus a
// sessionStorage handoff. Normal visits carry no params and are unaffected.
const SECONDS_PER_QUESTION = 36;
const MOCK_EXAM_STORE_KEY = "bcsparkMockExam";

export default function QuickPracticeEngine({
    questions,
    config = {},
    renderChrome = true // set false when embedded inside another page/card (skips Navbar & Footer)
}) {
    const router = useRouter();
    const {
        title = "Quick Practice",
        category = "Quiz",
        subject = "",
        step = "01",
        passMark = 50,
        questionLimit = 20,
        timeLimit = 120,
        timerDisplay = "seconds",
    } = config;

    const [userName, setUserName] = useState("BCSpark");
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [showResultPopup, setShowResultPopup] = useState(false);
    const [time, setTime] = useState(timeLimit);
    const resultRef = useRef(null);
    const reviewRef = useRef(null);

    // ===== Mock Model Test handoff state =====
    const [mockLoad, setMockLoad] = useState(false); // replacement questions loading
    const [mockQuestions, setMockQuestions] = useState(null);
    const [mockTotal, setMockTotal] = useState(null);

    // Helper: if source has multiple separated by /, show only the first one + superscript count
    const getDisplaySource = (source) => {
        if (!source) return { display: '', hiddenCount: 0 };
        try {
            // source is an array like ["২৩তম বিসিএস/অডিটর পদে নিয়োগ..."]
            let str = '';
            if (Array.isArray(source)) {
                str = source[0] || '';
            } else if (typeof source === 'string') {
                str = source;
            } else {
                str = String(source);
            }
            const parts = str.split('/').map(s => s.trim()).filter(s => s);
            const display = parts[0] || str;
            const hiddenCount = parts.length - 1;
            return { display, hiddenCount };
        } catch {
            return { display: String(source), hiddenCount: 0 };
        }
    };

    // =======quiz time keeper ========
    const [timeTaken, setTimeTaken] = useState(0);
    const [submittedByTime, setSubmittedByTime] = useState(false);


    // ================negative merking============
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const activeQuestions = mockQuestions || questions;
    const effTimeLimit = mockTotal
        ? mockTotal * SECONDS_PER_QUESTION
        : timeLimit;
    const skippedCount = activeQuestions.length - Object.keys(answers).length;

    // ==========sessionStorage=============
    useEffect(() => {
        const savedSetup = sessionStorage.getItem("quickPracticeSetup");

        if (!savedSetup) return;

        const setup = JSON.parse(savedSetup);

        if (setup.name) {
            setUserName(setup.name);
        }
    }, []);

    // ====== টাইমার ======
    useEffect(() => {
        if (submitted || mockLoad) return;

        if (time <= 0) {
            setSubmitted(true);
            setSubmittedByTime(true);
            setShowResultPopup(true);
            return;
        }

        const timer = setInterval(() => setTime((t) => t - 1), 1000);
        return () => clearInterval(timer);
    }, [time, submitted]);

    // ===== Calculate total time taken =====
    useEffect(() => {
        if (submitted) {
            setTimeTaken(effTimeLimit - time);
        }
    }, [submitted, time, effTimeLimit]);

    // ===== Resolve the Mock Model Test handoff once per mount =====
    // The homepage card writes { examKey, total, apiPath } to sessionStorage
    // then routes to the designated practice page with ?total=&exam=. Here we
    // validate the pair, pull exactly `total` questions from the API
    // equivalent and re-initialise the countdown accordingly.
    useEffect(() => {
        let cancelled = false;

        try {
            const params = new URLSearchParams(window.location.search);
            const urlTotal = Number(params.get("total"));
            const urlExam = params.get("exam");

            if (!Number.isInteger(urlTotal) || urlTotal <= 0 || !urlExam) return;

            const stored = JSON.parse(
                sessionStorage.getItem(MOCK_EXAM_STORE_KEY) || "null"
            );
            if (!stored || stored.examKey !== urlExam) return;

            setMockTotal(urlTotal);
            setMockLoad(true);

            (async () => {
                try {
                    const separator = stored.apiPath.includes("?") ? "&" : "?";
                    const response = await fetch(
                        `${stored.apiPath}${separator}total=${urlTotal}`
                    );
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const payload = await response.json();
                    if (
                        !cancelled &&
                        Array.isArray(payload.questions) &&
                        payload.questions.length > 0
                    ) {
                        setMockQuestions(payload.questions);
                    }
                } catch (err) {
                    console.error("Failed to load mock exam questions:", err);
                    if (!cancelled) setMockTotal(null); // graceful fallback to page defaults
                } finally {
                    if (!cancelled) setMockLoad(false);
                }
            })();
        } catch {
            // Malformed handoff data — silently fall back to normal behaviour.
        }

        return () => {
            cancelled = true;
        };
    }, []);

    // Re-initialise the countdown (timer init) once the mock setup resolves.
    useEffect(() => {
        if (!mockLoad && mockTotal) {
            setTime(mockTotal * SECONDS_PER_QUESTION);
        }
    }, [mockLoad, mockTotal]);

    // ===== Format submit date & time (e.g. 06-07-2026 | 2:54 AM) =====
    const formatDateTime = (d = new Date()) => {
        const pad = (n) => String(n).padStart(2, "0");
        const date = `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
        let hours = d.getHours();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        const time = `${hours}:${pad(d.getMinutes())} ${ampm}`;
        return `${date} | ${time}`;
    };

    const handleSelect = (qIndex, optionIndex) => {
        if (submitted) return;

        setAnswers(prev => ({
            ...prev,
            [qIndex]: optionIndex,
        }));
    };

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

                const resultSheet = clonedDoc.getElementById('resultSheet');
                if (resultSheet) {
                    resultSheet.style.width = '1080px';
                    resultSheet.style.maxWidth = 'none';
                }

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
        link.download = `BCSparkT20-${finalScore.toFixed(2)}-${activeQuestions.length}.jpg`;
        link.href = dataURL;
        link.click();
    };

    //  score and result review
    const finalScore = correctCount - (wrongCount * 0.5);

    const scorePercentage = activeQuestions.length > 0 ? (finalScore / activeQuestions.length) * 100 : 0;
    const passed = scorePercentage >= passMark;
    const correctPct = activeQuestions.length > 0 ? Math.round((correctCount / activeQuestions.length) * 100) : 0;
    const wrongPct = activeQuestions.length > 0 ? Math.round((wrongCount / activeQuestions.length) * 100) : 0;

    const scrollToReview = () => {
        setShowResultPopup(false);
        setTimeout(() => {
            reviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };

    const getResultMessage = (name, score, totalQuestions) => {
        const percentage = (score / totalQuestions) * 100;

        if (percentage >= 95)
            return [
                `🔥 ${name}! আগুন লাগায় দিলা!`,
                "অসাধারণ! তোমাকে দিয়ে হবে, থেমে থাকা যাবে না!",
                "এভাবেই চালিয়ে যাও! 🚀"
            ];

        if (percentage >= 80)
            return [
                `💪 ${name}! দারুণ করেছো!`,
                "আর একটু চর্চা করলে টপার!",
                "চালিয়ে যাও 📚 এগিয়ে যাও স্বপনের পথে"
            ];

        if (percentage >= 60)
            return [
                `😎 ${name}! বিশেষ বিবেচনায় পাশ!`,
                "আরেকটু মনোযোগ দিলে আরও ভালো হবে।",
                "হাল ছেড়ো না, মেধা আছে কিন্তু পড়ে না 💯"
            ];

        if (percentage >= 35)
            return [
                `🙂 ${name} ফেল্টুস!`,
                "ভালো করে পড়, নিয়মিত প্র্যাকটিস করো।",
                "লেগে থাকলে তুমি নিশ্চয়ই পারবে! 💪"
            ];

        return [
            `⚠️ সর্বনাশ, ${name} ফেল্টুস!`,
            "লেখাপড়া বাদ দিয়া বিয়ের প্ল্যান নাকি?",
            "এভাবে চললে কপালে দুঃখ আছে ...... ভালো করে পড় 💪"
        ];
    };

    // ======== Timer Formatter =========
    const formatTimer = (seconds) => {

        // T20 Mode (show seconds)
        if (timerDisplay === "t20") {
            return `${seconds}s`;
        }

        // Clock Mode
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        // 1 hour or more → HH:MM:SS
        if (hours > 0) {
            return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        }

        // Less than 1 hour → MM:SS
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };
    // warning color 
    const timerColor = time <= 10 ? 'bg-red-200 text-red-900 animate-pulse' : 'bg-red-100 text-red-900';

    // =============Score Calculation============
    const calculateResults = () => {
        let correct = 0;
        let wrong = 0;

        Object.entries(answers).forEach(([questionIndex, selectedOption]) => {
            const question = activeQuestions[questionIndex];

            if (Number(selectedOption) === question.ans) {
                correct++;
            } else {
                wrong++;
            }
        });

        setCorrectCount(correct);
        setWrongCount(wrong);
    };

    // Auto-calculate score whenever the quiz is submitted (manual OR by timer)
    useEffect(() => {
        if (submitted) {
            calculateResults();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitted]);

    // submit handeler 
    const handleSubmit = () => {
        setSubmitted(true);
        setShowResultPopup(true);
    };

    return (
        <>
            {renderChrome && <Navbar />}
            {/* Mock Model Test handoff: block the clock while replacement questions load */}
            {mockLoad && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <p className="text-xl font-bold animate-pulse">প্রশ্ন প্রস্তুত হচ্ছে...</p>
                        <p className="mt-2 text-xs text-gray-500">মক মডেল টেস্ট সেটআপ করা হচ্ছে</p>
                    </div>
                </div>
            )}
            <div className="max-w-6xl mx-auto p-6">

                {/* কুইজ */}
                <>
                    {/* ==================Top Branding header================= */}
                    <div className="flex items-center justify-between mb-6 pb-4">

                        <div className={`fixed top-20 right-4 z-50 text-xl font-mono px-4 py-2 rounded-lg font-bold shadow-lg ${timerColor}`}>
                            ⏱️ {formatTimer(time)}
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold mb-6 text-center">{title}</h1>

                    {/* Top quiz grid is hidden once submitted to avoid redundant duplicate of the review sheet below */}
                    {!submitted && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {activeQuestions.map((q, i) => {
                            const correctOptionIndex = q.ans;
                            const selectedOptionIndex = answers[i];

                            return (
                                <div key={`${getDisplaySource(q.source).display}-${q.id}-${i}`} className="bg-white p-4 rounded-xl shadow border">
                                    <p className="font-semibold text-2xl mb-2">Q{i + 1}: {q.q}</p>

                                    <p className="mb-4 text-base italic opacity-30">
                                        {getDisplaySource(q.source).display}
                                        {getDisplaySource(q.source).hiddenCount > 0 && (
                                            <sup className="ml-0.5 text-[7px]">{getDisplaySource(q.source).hiddenCount}+</sup>
                                        )}
                                    </p>

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
                    )}

                    {/* Answer Submint Button */}
                    {!submitted ? (
                        <button
                            onClick={handleSubmit}
                            className="mt-8 w-full bg-blue-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-blue-700"
                        >
                            Submit করো
                        </button>
                        // ============Result Page============
                    ) : (
                        <div ref={resultRef} id="resultSheet" className="w-full max-w-[1080px] mx-auto mt-8 bg-white p-1 rounded-xl shadow relative overflow-hidden">

                            <img
                                src="/logo/logo.png"
                                alt="watermark"
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-7 w-300 pointer-events-none select-none"
                            />

                            <div className="mt-6 p-2 mb-4 rounded-2xl text-white shadow-2xl relative z-10"
                                style={{
                                    background: 'linear-gradient(135deg, #E95420 0%, #F9A825 60%, #e956208e 50%)'
                                }}>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                    <div className="text-left space-y-3">
                                        <div className="space-y-2">
                                            {getResultMessage(userName, finalScore, activeQuestions.length).map((line, index) => (
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
                                            আমোলনামা: {finalScore.toFixed(2)} / {activeQuestions.length}
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
                                        <p className="text-[10px] opacity-60 border-t border-white/20 pt-2 mt-2">
                                            Subjects: {category} / {subject}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* ===================Answer Sheets====================== */}
                            <div ref={reviewRef} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 relative z-10">
                                {activeQuestions.map((q, i) => (
                                    <div key={`${getDisplaySource(q.source).display}-${q.id}-${i}`} className="border rounded-lg p-2 bg-gray-30">
                                        <p className="font-semibold text-xs mb-1">প্রশ্ন {i + 1}: {q.q}</p>
                                        {/* to show question source */}
                                        <p className="text-[9px] italic opacity-20 mb-1">
                                            {getDisplaySource(q.source).display}
                                            {getDisplaySource(q.source).hiddenCount > 0 && (
                                                <sup className="ml-0.5 text-[8px]">{getDisplaySource(q.source).hiddenCount}+</sup>
                                            )}
                                        </p>
                                        {/* <p className="text-[11px]">উত্তর: {q.options[answers[i]] || 'দাও নাই'}
                                            <span className={`ml-1 font-bold ${answers[i] === q.ans ? 'text-green-600' : 'text-red-600'}`}>
                                                {answers[i] === q.ans ? '✓' : `✗ ${q.options[q.ans]}`}
                                            </span>
                                        </p> */}
                                        {/* উত্তর দেখা skipped, correct, worong ans */}
                                        {answers[i] === undefined ? (
                                            <>
                                                <p className="text-[11px] text-red-600 font-semibold">
                                                    ✗ Your Ans: Skipped 
                                                </p>
                                                <p className="text-[11px] text-green-600 font-semibold">
                                                    ✓ Correct Ans: {q.options[q.ans]}
                                                </p>
                                            </>
                                        ) : answers[i] === q.ans ? (
                                            <p className="text-[11px] text-green-600 font-semibold">
                                                ✓ Your Ans: {q.options[q.ans]}
                                            </p>
                                        ) : (
                                            <>
                                                <p className="text-[11px] text-red-600 font-semibold">
                                                    ✗ Your Ans: {q.options[answers[i]]}
                                                </p>
                                                <p className="text-[11px] text-green-600 font-semibold">
                                                    ✓ Correct Ans: {q.options[q.ans]}
                                                </p>
                                            </>
                                        )}
                                        {/* Hitnts or explain of answer */}
                                        <p className="text-[9px] text-gray-500 mt-0.5">explain: {q.explain}</p>
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

                                <button
                                    onClick={() => {
                                        sessionStorage.setItem("quickPracticeRetry", "true");
                                        router.push('/t20');
                                    }}
                                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                                >
                                    🔄 আবার Practice দাও
                                </button>

                            </div>

                            <div className="mt-6 pt-4 border-t text-center relative z-10">
                                <p className="text-xs text-gray-400">Generated by BCSpark.bd | Quick Practice Tool</p>
                            </div>
                        </div>
                    )}
                </>

                {/* ============ Result Preview Popup ============ */}
                {submitted && showResultPopup && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
                        <div className="w-full max-w-md my-8 bg-white rounded-2xl shadow-2xl overflow-hidden">

                            {/* Header (Result State) */}
                            <div
                                className="px-6 py-5 text-white text-center"
                                style={{
                                    background: passed
                                        ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)'
                                        : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
                                }}
                            >
                                <h3 className="text-xl font-extrabold leading-snug">
                                    {passed
                                        ? `🎉 অভিনন্দন! আপনি পাস করেছেন`
                                        : `⚡ অল্পের জন্য মিস! আবার চেষ্টা করুন`}
                                </h3>
                            </div>

                            {/* Core Quiz Results (Metadata) */}
                            <div className="px-6 py-4 text-sm text-gray-800 space-y-1">
                                <p><span className="text-gray-500">Category:</span> <strong>{category}</strong></p>
                                <p><span className="text-gray-500">Subject:</span> <strong>{subject || title}</strong></p>
                                <p><span className="text-gray-500">Date &amp; Time:</span> <strong>{formatDateTime()}</strong></p>
                                <p><span className="text-gray-500">Step:</span> <strong>{step}</strong></p>

                                <div className="my-2 border-t pt-2 space-y-1">
                                    <p>
                                        <span className="text-gray-500">আপনার সর্বমোট স্কোর:</span>{' '}
                                        <strong>{finalScore.toFixed(2)} / {activeQuestions.length}</strong>
                                    </p>
                                    <p>
                                        <span className="text-gray-500">সঠিক উত্তর:</span>{' '}
                                        <strong className="text-green-600">{correctCount} ({correctPct}%)</strong>
                                    </p>
                                    <p>
                                        <span className="text-gray-500">ভুল উত্তর:</span>{' '}
                                        <strong className="text-red-600">{wrongCount} ({wrongPct}%)</strong>
                                    </p>
                                    <p>
                                        <span className="text-gray-500">Time Expended:</span>{' '}
                                        <strong>{formatTimer(timeTaken)}</strong>
                                    </p>
                                </div>
                            </div>

                            {/* Promotional Message (Call-out Box) */}
                            <div className="mx-6 mb-4 rounded-xl p-3 bg-orange-50 border border-orange-200 text-xs text-gray-700 leading-relaxed">
                                <p className="font-semibold text-orange-700 mb-1">ওহে! মানবতার মানবটার বিড়িওলা!</p>
                                <p>
                                    এটি একটি সম্পূর্ণ অবাণিজ্যিক বিজ্ঞানপনমুক্ত প্রোজেক্ট; আপনার একটা কফির/বিড়ির টাকা প্রজেক্টটা বাঁচিয়ে রাখবে। {' '}
                                    <a
                                        href="https://bcspark.vercel.app/donate"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline font-semibold"
                                    >
                                        ডোনেট করি! 
                                    </a>
                                </p>
                            </div>

                            {/* Action Button */}
                            <div className="px-6 pb-6">
                                <button
                                    onClick={scrollToReview}
                                    className="w-full py-3 rounded-lg font-bold text-white transition hover:opacity-90"
                                    style={{
                                        background: 'linear-gradient(135deg, #E95420 0%, #F9A825 100%)'
                                    }}
                                >
                                    Answer Review &amp; Download🔍
                                </button>
                            </div>

                        </div>
                    </div>
                )}

            </div>
            {renderChrome && <Footer />}
        </>
    )
}