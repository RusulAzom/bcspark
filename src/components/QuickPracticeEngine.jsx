'use client';
import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function QuickPracticeEngine({
    questions,
    config = {}
}) {
    const {
        title = "Quick Practice",
        questionLimit = 20,
        timeLimit = 120,
        timerDisplay = "seconds",
    } = config;

    const [userName, setUserName] = useState("BCSpark");
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [time, setTime] = useState(timeLimit);
    const resultRef = useRef(null);

    // =======quiz time keeper ========
    const [timeTaken, setTimeTaken] = useState(0);
    const [submittedByTime, setSubmittedByTime] = useState(false);


    // ================negative merking============
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const skippedCount = questions.length - Object.keys(answers).length;

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
        if (submitted) return;

        if (time <= 0) {
            setSubmitted(true);
            setSubmittedByTime(true);
            return;
        }

        const timer = setInterval(() => setTime((t) => t - 1), 1000);
        return () => clearInterval(timer);
    }, [time, submitted]);

    // ===== Calculate total time taken =====
    useEffect(() => {
        if (submitted) {
            setTimeTaken(timeLimit - time);
        }
    }, [submitted, time, timeLimit]);

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
        link.download = `BCSparkT20-${finalScore.toFixed(2)}-${questions.length}.jpg`;
        link.href = dataURL;
        link.click();
    };

    //  score and result review
    const finalScore = correctCount - (wrongCount * 0.5);

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

    // submit handeler 
    const handleSubmit = () => {
        let correct = 0;
        let wrong = 0;

        Object.entries(answers).forEach(([questionIndex, selectedOption]) => {
            const question = questions[questionIndex];

            if (Number(selectedOption) === question.ans) {
                correct++;
            } else {
                wrong++;
            }
        });

        setCorrectCount(correct);
        setWrongCount(wrong);

        setSubmitted(true);
    };

    return (
        <>
            <Navbar />
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
                        <div ref={resultRef} className="w-[1080px] mt-8 bg-white p-1 rounded-xl shadow relative overflow-hidden">

                            <img
                                src="/logo/logo.png"
                                alt="watermark"
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-7 w-300 pointer-events-none select-none"
                            />

                            <div className="mt-6 p-2 mb-4 rounded-2xl text-white shadow-2xl relative z-10"
                                style={{
                                    background: 'linear-gradient(135deg, #E95420 0%, #F9A825 60%, #e956208e 50%)'
                                }}>

                                <div className="grid grid-cols-2 gap-4 items-center">
                                    <div className="text-left space-y-3">
                                        <div className="space-y-2">
                                            {getResultMessage(userName, finalScore, questions.length).map((line, index) => (
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
                                            আমোলনামা: {finalScore.toFixed(2)} / {questions.length}
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
                            {/* ===================Answer Sheets====================== */}
                            <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                                {questions.map((q, i) => (
                                    <div key={q.id} className="border rounded-lg p-2 bg-gray-30">
                                        <p className="font-semibold text-xs mb-1">প্রশ্ন {i + 1}: {q.q}
                                            {/* to show question source */}
                                            <span className="text-[9px] text-gray-500 mt-0.5"> {q.source} </span>
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
                                    onClick={() => window.location.reload()}
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

            </div>
            <Footer />
        </>
    )
}