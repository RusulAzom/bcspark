// src/components/PsychologyModal.jsx
"use client";
import React, { useState, useMemo, useRef } from 'react';
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [formErrors, setFormErrors] = useState({});

    // ৪. সিলেক্টেড ক্যাটাগরি অবজেক্ট খুঁজে বের করা
    const selectedCategoryObj = psychologyCategories.find(c => c.id === selectedCategory);
    const hasSubTests = selectedCategoryObj?.subTests && selectedCategoryObj.subTests.length > 0;

    // বর্তমানে সিলেক্ট করা টেস্টের ডেটা
    const activeTestData = psychologyTests[selectedTest];
    const totalQuestions = activeTestData?.questions?.length || 0;

    // ৫. সর্বোচ্চ সম্ভাব্য স্কোর নির্ণয় (প্রশ্ন সংখ্যা × সর্বোচ্চ অপশন ভ্যালু)
    const maxPossibleScore = useMemo(() => {
        if (!activeTestData?.questions?.length) return totalQuestions;
        const allValues = activeTestData.questions.flatMap(q => q.options?.map(o => o.value) || [0]);
        if (allValues.length === 0) return totalQuestions;
        const maxVal = Math.max(...allValues);
        return totalQuestions * maxVal;
    }, [activeTestData, totalQuestions]);

    // ৬. স্কোর ক্যালকুলেশন
    const totalScore = useMemo(() => {
        if (!userAnswers.length) return 0;
        return userAnswers.reduce((sum, val) => sum + (val || 0), 0);
    }, [userAnswers]);

    // ৭. স্কোর অনুযায়ী সিভিয়ারিটি ডেটা বের করা
    const severityResult = useMemo(() => {
        if (!activeTestData?.scoring) return null;
        const matched = activeTestData.scoring.find(
            (range) => totalScore >= range.min && totalScore <= range.max
        );
        return matched || activeTestData.scoring[activeTestData.scoring.length - 1];
    }, [totalScore, activeTestData]);

    // ৮. অপশন ক্লিক হ্যান্ডেলার
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

    const SHEETDB_API = "https://sheetdb.io/api/v1/hyafyjkys9216";

    // ৯. লিড ফর্ম সাবমিট হ্যান্ডেলার (Google Sheets via SheetDB)
    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");
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

        if (Object.keys(errors).length > 0) return;

        setIsSubmitting(true);
        const payload = {
            data: {
                name: leadName.trim(),
                contact: leadContact.trim(),
                test: activeTestData?.name || "",
                testId: activeTestData?.id || "",
                score: totalScore.toString(),
                maxScore: maxPossibleScore.toString(),
                severity: severityResult?.status || "",
                responses: JSON.stringify(userAnswers),
                date: new Date().toISOString(),
            },
        };

        try {
            const res = await fetch(SHEETDB_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`Server responded with ${res.status}`);
            console.log("📋 Lead saved to Google Sheets:", payload.data);
            setIsLeadSubmitted(true);
        } catch (err) {
            console.error("❌ Failed to save lead to SheetDB:", err);
            setSubmitError("ডেটা সংরক্ষণে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ১০. মডাল রিসেট (আবার পরীক্ষা করুন)
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

    // ১১. স্কোর অনুযায়ী কালার ক্লাস ম্যাপিং
    const getScoreColorClasses = (color) => {
        const map = {
            green: {
                bg: "bg-green-100",
                text: "text-green-700",
                ring: "ring-green-400",
                gradient: "from-green-400 to-emerald-500",
                solid: "#22c55e",
                scoreBg: "bg-green-500",
            },
            blue: {
                bg: "bg-blue-100",
                text: "text-blue-700",
                ring: "ring-blue-400",
                gradient: "from-blue-400 to-indigo-500",
                solid: "#3b82f6",
                scoreBg: "bg-blue-500",
            },
            orange: {
                bg: "bg-orange-100",
                text: "text-orange-700",
                ring: "ring-orange-400",
                gradient: "from-orange-400 to-amber-500",
                solid: "#f97316",
                scoreBg: "bg-orange-500",
            },
            red: {
                bg: "bg-red-100",
                text: "text-red-700",
                ring: "ring-red-400",
                gradient: "from-red-400 to-rose-500",
                solid: "#ef4444",
                scoreBg: "bg-red-500",
            },
        };
        return map[color] || map.green;
    };

    const colorClasses = getScoreColorClasses(severityResult?.color);

    // ১২. লিনিয়ার রেঞ্জ ইন্ডিকেটরের জন্য কনফিগারেশন
    const rangeConfig = activeTestData?.scoring
        ? activeTestData.scoring.map((r) => ({
              ...r,
              startPercent: (r.min / maxPossibleScore) * 100,
              endPercent: ((r.max + 1) / maxPossibleScore) * 100,
          }))
        : [];

    const scorePercent = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

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
                                🧠 সাইকোলজিক্যাল টেস্ট / মানসিক স্বাস্থ্য পরীক্ষা সেন্টার  
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
                                        const newCat = e.target.value;
                                        setSelectedCategory(newCat);
                                        // ক্যাটাগরি পরিবর্তন করলে টেস্ট রিসেট
                                        setSelectedTest("");
                                        // যদি এই ক্যাটাগরির কোনো সাব-টেস্ট না থাকে, তাহলে অটো-সিলেক্ট করি
                                        const catObj = psychologyCategories.find(c => c.id === newCat);
                                        if (catObj && (!catObj.subTests || catObj.subTests.length === 0)) {
                                            // parentId ম্যাচ করে প্রথম টেস্টটি অটো-সিলেক্ট করুন
                                            const matchingTest = Object.values(psychologyTests).find(t => t.parentId === newCat);
                                            if (matchingTest) {
                                                setSelectedTest(matchingTest.id);
                                            }
                                        }
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

                            {/* ২য় লেয়ার ড্রপডাউন — শুধুমাত্র সাব-টেস্ট আছে এমন ক্যাটাগরির জন্য */}
                            {selectedCategory && hasSubTests && (
                                <div className="space-y-1 animate-in slide-in-from-top-3 duration-200">
                                    <label className="block text-lg font-bold text-gray-800">
                                        ২. আপনার কাঙ্খিত মানসিক স্বাস্থ্য পরীক্ষাটি নির্বাচন করুন:
                                    </label>
                                    <select
                                        value={selectedTest}
                                        onChange={(e) => setSelectedTest(e.target.value)}
                                        className="w-full p-3.5 border-2 rounded-xl bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-700 transition font-medium"
                                    >
                                        <option value="">-- এখানে ক্লিক করে টেস্টটি সিলেক্ট করুন --</option>
                                        {selectedCategoryObj.subTests.map((sub) => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.name}
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
                            {activeTestData.questions[currentQuestionIndex]?.options?.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(option.value)}
                                    className="w-full text-left p-4 rounded-xl border-2 border-gray-150 hover:border-blue-500 hover:bg-blue-50/30 text-gray-700 hover:text-blue-700 font-semibold transition active:scale-[0.99] flex justify-between items-center group"
                                >
                                    <span>{option.text}</span>
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

                            {/* সাবমিট এরর */}
                            {submitError && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 text-xs text-red-600 text-center">
                                    ❌ {submitError}
                                </div>
                            )}

                            {/* সাবমিট বাটন */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-3.5 px-5 text-base font-bold text-white rounded-xl transition shadow-lg active:scale-[0.98] ${isSubmitting
                                            ? 'bg-blue-400 cursor-not-allowed shadow-none'
                                            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            সংরক্ষণ করা হচ্ছে...
                                        </span>
                                    ) : (
                                        'ফলাফল দেখুন 📊'
                                    )}
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
                            <div
                                data-score-circle
                                className={`relative w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-br ${colorClasses.gradient} shadow-lg ring-4 ${colorClasses.ring} ring-offset-2`}
                            >
                                <div className="text-center">
                                    <span className="block text-3xl font-black text-white">
                                        {totalScore}
                                    </span>
                                    <span className="block text-xs font-semibold text-white/80">
                                        / {maxPossibleScore}
                                    </span>
                                </div>
                            </div>
                            <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-bold ${colorClasses.bg} ${colorClasses.text}`}>
                                {severityResult.status}
                            </div>
                        </div>

                        {/* লিনিয়ার রেঞ্জ গ্রাফ */}
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <p className="text-xs font-bold text-gray-600 mb-3 text-center">📊 রিস্ক রেঞ্জ চার্ট</p>
                            <div className="relative h-6 w-full bg-gray-200 rounded-full overflow-hidden">
                                {/* রেঞ্জ সেগমেন্টগুলো */}
                                {rangeConfig.map((range, idx) => (
                                    <div
                                        key={idx}
                                        className="absolute top-0 h-full"
                                        style={{
                                            left: `${range.startPercent}%`,
                                            width: `${range.endPercent - range.startPercent}%`,
                                            backgroundColor:
                                                range.color === 'green' ? '#22c55e' :
                                                range.color === 'blue' ? '#3b82f6' :
                                                range.color === 'orange' ? '#f97316' : '#ef4444',
                                            opacity: 0.85,
                                        }}
                                    ></div>
                                ))}
                                {/* স্কোর ইন্ডিকেটর পয়েন্টার */}
                                <div
                                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-700 rounded-full shadow-md z-10 transition-all duration-500"
                                    style={{
                                        left: `calc(${scorePercent}% - 10px)`,
                                    }}
                                >
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-700 whitespace-nowrap">
                                        {totalScore}
                                    </div>
                                </div>
                            </div>
                            {/* রেঞ্জ লেজেন্ড */}
                            <div className="flex justify-between mt-2 text-[9px] text-gray-400 px-0.5">
                                <span>০ (নিরাপদ)</span>
                                <span>{maxPossibleScore} (ঝুঁকিপূর্ণ)</span>
                            </div>
                            {/* কালার লেজেন্ড */}
                            <div className="flex flex-wrap gap-2 mt-3 justify-center">
                                {activeTestData.scoring.map((range, idx) => (
                                    <div key={idx} className="flex items-center gap-1 text-[9px] text-gray-500">
                                        <span
                                            className="inline-block w-2.5 h-2.5 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    range.color === 'green' ? '#22c55e' :
                                                    range.color === 'blue' ? '#3b82f6' :
                                                    range.color === 'orange' ? '#f97316' : '#ef4444',
                                            }}
                                        ></span>
                                        {range.status.split(' (')[0]}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* নোট: কম স্কোর নিরাপদ, বেশি স্কোর বিপজ্জনক (রেঞ্জ চার্টের পরে) */}
                        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-700 text-center leading-relaxed">
                            ⚠️ <strong>নোট:</strong> এই টেস্টে <strong>কম স্কোর</strong> মানে তুলনামূলকভাবে <strong>নিরাপদ</strong>, আর <strong>বেশি স্কোর</strong> মানে <strong>ঝুঁকি বেশি</strong>।
                        </div>

                        {/* সাজেশন / এডভাইস - হাইলাইটেড */}
                        <div className={`rounded-2xl p-5 border-2 ${colorClasses.bg} border-${colorClasses.text.replace('text-', '')}/30 shadow-lg`}>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl shrink-0 mt-0.5">💡</span>
                                <div>
                                    <h4 className="text-base font-black text-gray-800 mb-1.5">বিশেষজ্ঞ পরামর্শ</h4>
                                    <p className="text-sm leading-relaxed text-gray-700">
                                        {severityResult.suggestion}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* বিবরণ */}
                        <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-500 space-y-1.5 border border-gray-100">
                            <p><strong>পরীক্ষার নাম:</strong> {activeTestData?.name}</p>
                            <p><strong>মোট স্কোর:</strong> {totalScore} / {maxPossibleScore}</p>
                            <p><strong>পরিস্থিতি:</strong> {severityResult.status}</p>
                        </div>

                        {/* ক্রেডেনশিয়াল ফুটার */}
                        <div className="text-center text-[10px] text-gray-300 pt-1 pb-3 border-t border-gray-100">
                            T Tested on :<span className="font-semibold text-gray-400">BCSpark.bd</span> - বাংলাদেশের ক্যারিয়ার প্ল্যাটফর্ম
                        </div>

                        {/* সিটিএ বাটন */}
                        <div className="pt-2 flex gap-3">
                            <button
                                onClick={handleReset}
                                className="flex-1 py-3 px-4 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition active:scale-[0.98]"
                            >
                                🔄 আবার পরীক্ষা করুন
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 px-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                            >
                                🏠 হোম পেজে যান
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}