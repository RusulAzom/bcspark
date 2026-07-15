// src/components/PsychologyModal.jsx
"use client";
import React, { useState, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import { psychologyCategories, psychologyTests } from '../app/frontApp/psychologyData';

// 🎯 এখানে { onClose } প্রোপটি সঠিকভাবে রিসিভ করা হলো
export default function PsychologyModal({ onClose }) {
    // ০. রেজাল্ট ক্যাপচার রেফারেন্স
    const resultRef = useRef(null);

    // ১. ড্রপডাউন ও সিলেকশন স্টেট
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTest, setSelectedTest] = useState("");

    // ২. কুইজ ফ্লো কন্ট্রোল স্টেট
    const [isTestStarted, setIsTestStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [isTestCompleted, setIsTestCompleted] = useState(false);

    // ৩. লিড ফর্ম স্টেট
    const [leadName, setLeadName] = useState("");
    const [leadContact, setLeadContact] = useState("");
    const [isLeadSubmitted, setIsLeadSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // ৪. সিলেক্টেড ক্যাটাগরির টেস্ট ফিল্টার করার লজিক
    const availableTests = Object.values(psychologyTests).filter(
        (test) => test.parentId === selectedCategory
    );

    // বর্তমানে সিলেক্ট করা টেস্টের ডেটা
    const activeTestData = psychologyTests[selectedTest];
    const totalQuestions = activeTestData?.questions?.length || 0;

    // ৫. স্কোর ক্যালকুলেশন
    const totalScore = useMemo(() => {
        if (!userAnswers.length) return 0;
        return userAnswers.reduce((sum, val) => sum + (val || 0), 0);
    }, [userAnswers]);

    // ৬. স্কোর অনুযায়ী সিভিয়ারিটি ডেটা বের করা
    const severityResult = useMemo(() => {
        if (!activeTestData?.scoring) return null;
        const matched = activeTestData.scoring.find(
            (range) => totalScore >= range.min && totalScore <= range.max
        );
        return matched || activeTestData.scoring[activeTestData.scoring.length - 1];
    }, [totalScore, activeTestData]);

    // ৭. অপশন ক্লিক হ্যান্ডেলার
    const handleOptionSelect = (score) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[currentQuestionIndex] = score;
        setUserAnswers(updatedAnswers);

        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            setIsTestCompleted(true);
        }
    };

    // ৮. লিড ফর্ম সাবমিট হ্যান্ডেলার
    const handleLeadSubmit = (e) => {
        e.preventDefault();
        const errors = {};

        if (!leadName.trim()) {
            errors.name = "অনুগ্রহ করে আপনার নাম লিখুন";
        }
        if (!leadContact.trim()) {
            errors.contact = "অনুগ্রহ করে আপনার মোবাইল নম্বর বা ইমেইল দিন";
        } else if (
            !/^01[3-9]\d{8}$/.test(leadContact.trim()) &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadContact.trim())
        ) {
            errors.contact = " valid একটি মোবাইল নম্বর (01XXXXXXXXX) বা ইমেইল দিন";
        }

        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            // ডিবাগ লগ
            console.log("📋 Lead Data Submitted:", {
                name: leadName.trim(),
                contact: leadContact.trim(),
                testId: selectedTest,
                testName: activeTestData?.name,
                totalScore,
                severity: severityResult?.status,
            });
            setIsLeadSubmitted(true);
        }
    };

    // ৯. মডাল রিসেট (আবার পরীক্ষা করুন)
    const handleReset = () => {
        setSelectedCategory("");
        setSelectedTest("");
        setIsTestStarted(false);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setIsTestCompleted(false);
        setLeadName("");
        setLeadContact("");
        setIsLeadSubmitted(false);
        setFormErrors({});
    };

    // ১০. জেপিজি হিসেবে সেভ করার ফাংশন
    const handleSaveAsJPG = async () => {
        if (!resultRef.current) return;
        try {
            const canvas = await html2canvas(resultRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true,
                logging: false,
            });
            const link = document.createElement('a');
            link.download = `BCSpark_Psychology_Report_${activeTestData?.id || 'test'}.jpg`;
            link.href = canvas.toDataURL('image/jpeg', 0.95);
            link.click();
        } catch (err) {
            console.error('Failed to save result as JPG:', err);
        }
    };

    // ১১. স্কোর অনুযায়ী কালার ক্লাস ম্যাপিং
    const getScoreColorClasses = (color) => {
        const map = {
            green: {
                bg: "bg-green-100",
                text: "text-green-700",
                ring: "ring-green-400",
                badge: "bg-green-500",
                gradient: "from-green-400 to-emerald-500",
            },
            blue: {
                bg: "bg-blue-100",
                text: "text-blue-700",
                ring: "ring-blue-400",
                badge: "bg-blue-500",
                gradient: "from-blue-400 to-indigo-500",
            },
            orange: {
                bg: "bg-orange-100",
                text: "text-orange-700",
                ring: "ring-orange-400",
                badge: "bg-orange-500",
                gradient: "from-orange-400 to-amber-500",
            },
            red: {
                bg: "bg-red-100",
                text: "text-red-700",
                ring: "ring-red-400",
                badge: "bg-red-500",
                gradient: "from-red-400 to-rose-500",
            },
        };
        return map[color] || map.green;
    };

    const colorClasses = getScoreColorClasses(severityResult?.color);

    return (
        /* 🎯 কালো ব্যাকড্রপ এরিয়ায় ক্লিক করলে যেন মডাল বন্ধ হয় (onClose), কিন্তু ভেতরের সাদা বক্সে ক্লিক করলে যেন বন্ধ না হয় (e.stopPropagation) */
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            >

                {/* ================= সেকশন ১: সিলেকশন ড্রপডাউন স্ক্রিন ================= */}
                {!isTestStarted && (
                    <>
                        <div className="flex justify-center items-center border-b pb-4 mb-5">
                            <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                                🧠 সাইকোলজিক্যাল টেস্ট জোন
                            </h3>
                        </div>

                        <div className="space-y-5">
                            {/* ১ম লেয়ার ড্রপডাউন */}
                            <div className="space-y-1">
                                <label className="block text-lg font-bold text-gray-800">
                                    ১. আপনি কি ধরনের মানসিক সমস্যায় ভুগছেন?
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        setSelectedTest("");
                                    }}
                                    className="w-full p-3.5 border-2 rounded-xl bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-700 transition font-medium"
                                >
                                    <option value="">-- এখানে ক্লিক করে নির্বাচন করুন --</option>
                                    {psychologyCategories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nameBN} ({cat.nameEN})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* ২য় লেয়ার ড্রপডাউন */}
                            {selectedCategory && (
                                <div className="space-y-1 animate-in slide-in-from-top-3 duration-200">
                                    <label className="block text-lg font-bold text-gray-800">
                                        ২. আপনার কাঙ্খিত পরীক্ষাটি নির্বাচন করুন:
                                    </label>
                                    <select
                                        value={selectedTest}
                                        onChange={(e) => setSelectedTest(e.target.value)}
                                        className="w-full p-3.5 border-2 rounded-xl bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-700 transition font-medium"
                                    >
                                        <option value="">-- এখানে ক্লিক করে টেস্টটি সিলেক্ট করুন --</option>
                                        {availableTests.map((test) => (
                                            <option key={test.id} value={test.id}>
                                                {test.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* ডেসক্রিপশন কার্ড */}
                            {selectedTest && activeTestData && (
                                <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 mt-4 text-sm text-gray-700 space-y-2 max-h-[180px] overflow-y-auto animate-in zoom-in-95 duration-200">
                                    <p className="leading-relaxed"><strong>টেস্টের বিবরণ:</strong> {activeTestData.description}</p>
                                    <div className="text-xs text-gray-500 border-t border-blue-100/50 pt-2 space-y-1">
                                        <p>📍 <strong>মূল বৈজ্ঞানিক সোর্স:</strong> {activeTestData.source}</p>
                                        <p>🇧🇩 <strong>বাংলাদেশি রিসার্চ ভ্যালিডেশন:</strong> {activeTestData.localResearch}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* শুরু করুন বাটন */}
                        <div className="mt-6 border-t pt-4">
                            <button
                                onClick={() => setIsTestStarted(true)}
                                disabled={!selectedTest}
                                className={`w-full py-3 px-5 text-base font-bold text-white rounded-xl transition-all duration-200 ${!selectedTest
                                        ? 'bg-gray-300 cursor-not-allowed shadow-none'
                                        : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] shadow-lg shadow-emerald-600/20'
                                    }`}
                            >
                                শুরু করুন 🚀
                            </button>
                        </div>
                    </>
                )}

                {/* ================= সেকশন ২: একটির পর একটি প্রশ্ন রেন্ডারিং স্ক্রিন ================= */}
                {isTestStarted && !isTestCompleted && activeTestData && (
                    <div className="animate-in fade-in duration-300">

                        {/* কুইজ হেডার ও প্রোগ্রেস বার */}
                        <div className="border-b pb-4 mb-5">
                            <div className="flex justify-between items-center text-sm font-semibold text-gray-500 mb-2">
                                <span>পরীক্ষা: {activeTestData.name}</span>
                                <span>প্রশ্ন: {currentQuestionIndex + 1}/{totalQuestions}</span>
                            </div>
                            {/* প্রোগ্রেস বার অ্যানিমেশন */}
                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* কুইজ মেইন প্রশ্ন কার্ড */}
                        <div className="min-h-[100px] mb-6 flex items-center justify-center">
                            <h4 className="text-xl font-bold text-gray-900 text-center leading-relaxed">
                                {activeTestData.questions[currentQuestionIndex]?.text}
                            </h4>
                        </div>

                        {/* কুইজ অপশন বাটন সমূহ */}
                        <div className="space-y-3">
                            {activeTestData.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(option.value)}
                                    className="w-full text-left p-4 rounded-xl border-2 border-gray-150 hover:border-blue-500 hover:bg-blue-50/30 text-gray-700 hover:text-blue-700 font-semibold transition active:scale-[0.99] flex justify-between items-center group"
                                >
                                    <span>{option.text || option}</span>
                                    <span className="opacity-0 group-hover:opacity-100 text-blue-500 font-bold transition">➔</span>
                                </button>
                            ))}
                        </div>

                    </div>
                )}

                {/* ================= সেকশন ৩: লিড ফর্ম (টেস্ট শেষে) ================= */}
                {isTestCompleted && !isLeadSubmitted && (
                    <div className="animate-in zoom-in-95 duration-300">
                        {/* হেডার */}
                        <div className="text-center border-b pb-4 mb-5">
                            <div className="text-4xl mb-2">🎉</div>
                            <h3 className="text-xl font-black text-gray-800">
                                আপনি সফলভাবে টেস্টটি সম্পন্ন করেছেন!
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                                আপনার উত্তরগুলো বিশ্লেষণ করে রিপোর্ট তৈরি করা হচ্ছে
                            </p>
                        </div>

                        {/* লিড ফর্ম */}
                        <form onSubmit={handleLeadSubmit} className="space-y-4">
                            {/* প্রাইভেসি নোটিশ */}
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 flex items-start gap-2">
                                <span className="text-base shrink-0">🔒</span>
                                <p className="leading-relaxed">
                                    আপনার গোপনীয়তা আমাদের কাছে সম্পূর্ণ সুরক্ষিত। ফলাফল দেখতে নিচের তথ্যগুলো পূরণ করুন। আপনার তথ্য কখনো কারো সাথে শেয়ার করা হবে না।
                                </p>
                            </div>

                            {/* নাম ইনপুট */}
                            <div className="space-y-1">
                                <label className="block text-sm font-bold text-gray-700">
                                    আপনার নাম <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={leadName}
                                    onChange={(e) => setLeadName(e.target.value)}
                                    placeholder="e.g., আপনার পুরো নাম"
                                    className={`w-full p-3.5 border-2 rounded-xl bg-gray-50 outline-none text-gray-700 transition font-medium ${formErrors.name
                                            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                        }`}
                                />
                                {formErrors.name && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                                )}
                            </div>

                            {/* মোবাইল/ইমেইল ইনপুট */}
                            <div className="space-y-1">
                                <label className="block text-sm font-bold text-gray-700">
                                    মোবাইল নম্বর / ইমেইল <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={leadContact}
                                    onChange={(e) => setLeadContact(e.target.value)}
                                    placeholder="e.g., 017XXXXXXXX বা email@example.com"
                                    className={`w-full p-3.5 border-2 rounded-xl bg-gray-50 outline-none text-gray-700 transition font-medium ${formErrors.contact
                                            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                        }`}
                                />
                                {formErrors.contact && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.contact}</p>
                                )}
                            </div>

                            {/* সাবমিট বাটন */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full py-3.5 px-5 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                                >
                                    ফলাফল দেখুন 📊
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ================= সেকশন ৪: রেজাল্ট ও রিপোর্ট কার্ড (লিড সাবমিটের পর) ================= */}
                {isLeadSubmitted && severityResult && (
                    <div
                        ref={resultRef}
                        className="animate-in zoom-in-95 duration-300 space-y-5 relative overflow-hidden"
                    >
                        {/* ওয়াটারমার্ক লোগো (ব্যাকগ্রাউন্ড) */}
                        <div
                            className="absolute inset-0 pointer-events-none opacity-[0.06] bg-no-repeat bg-center"
                            style={{
                                backgroundImage: 'url(/logo/logo.png)',
                                backgroundSize: '180px auto',
                            }}
                        ></div>

                        {/* হেডার */}
                        <div className="text-center border-b pb-4">
                            <h3 className="text-2xl font-black text-gray-800">
                                📋 ডায়াগনস্টিক রিপোর্ট
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                                {activeTestData?.name} - আপনার ফলাফল বিশ্লেষণ
                            </p>
                        </div>

                        {/* স্কোর সার্কেল */}
                        <div className="flex flex-col items-center justify-center py-4">
                            <div className={`relative w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-br ${colorClasses.gradient} shadow-lg ring-4 ${colorClasses.ring} ring-offset-2`}>
                                <div className="text-center">
                                    <span className="block text-3xl font-black text-white">
                                        {totalScore}
                                    </span>
                                    <span className="block text-xs font-semibold text-white/80">
                                        / {activeTestData?.totalQuestions || totalQuestions}
                                    </span>
                                </div>
                            </div>
                            <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-bold ${colorClasses.bg} ${colorClasses.text}`}>
                                {severityResult.status}
                            </div>
                        </div>

                        {/* সাজেশন / এডভাইস */}
                        <div className={`rounded-2xl p-5 border ${colorClasses.bg} border-opacity-40`}>
                            <p className="text-sm leading-relaxed text-gray-700">
                                <strong>💡 পরামর্শ:</strong> {severityResult.suggestion}
                            </p>
                        </div>

                        {/* বিবরণ */}
                        <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-500 space-y-1.5 border border-gray-100">
                            <p><strong>পরীক্ষার নাম:</strong> {activeTestData?.name}</p>
                            <p><strong>মোট স্কোর:</strong> {totalScore} / {activeTestData?.totalQuestions || totalQuestions}</p>
                            <p><strong>পরিস্থিতি:</strong> {severityResult.status}</p>
                        </div>

                        {/* ক্রেডেনশিয়াল ফুটার */}
                        <div className="text-center text-[10px] text-gray-300 pt-1 pb-3 border-t border-gray-100">
                            পরীক্ষিত: <span className="font-semibold text-gray-400">BCSpark.bd</span> - বাংলাদেশের ক্যারিয়ার ও মানসিক স্বাস্থ্য প্ল্যাটফর্ম
                        </div>

                        {/* সিটিএ বাটন */}
                        <div className="space-y-3 pt-2">
                            <button className="w-full py-3.5 px-5 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition shadow-lg shadow-blue-600/30 active:scale-[0.98] animate-pulse">
                                🧑‍⚕️ বিশেষজ্ঞের পরামর্শ নিন (বুকিং অ্যাপয়েন্টমেন্ট)
                            </button>
                            <button
                                onClick={handleSaveAsJPG}
                                className="w-full py-3 px-5 text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 11l5 5 5-5M12 4v12" />
                                </svg>
                                ফলাফল ফোনে সেভ করুন (JPG)
                            </button>
                            <button
                                onClick={handleReset}
                                className="w-full py-3 px-5 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition active:scale-[0.98]"
                            >
                                🔄 আবার পরীক্ষা করুন
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}