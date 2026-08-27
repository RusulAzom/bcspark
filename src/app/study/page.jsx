'use client';

// Dedicated Study Mode page (/study).
//
// Read-only browsing of the question pools behind the practice routes:
//   - Cascading Subject -> Topic selectors driven by src/data/practiceRoutes.js
//     (inactive topics are filtered out everywhere).
//   - Client-side pagination (20 questions per page) so 500+ question pools
//     render without DOM lag — only the current page is mounted at a time.
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import practiceRoutes from "@/data/practiceRoutes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PAGE_SIZE = 20;
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const OPT_LETTERS = ["ক", "খ", "গ", "ঘ", "ঙ", "চ"];

// ── Mock test handoff (mirrors MockModelTestCard.jsx protocol) ──────────
// QuickPracticeEngine validates ?total=&exam= against this sessionStorage
// entry, then pulls exactly `total` questions from `apiPath` and starts a
// timed exam. Normal visits without params are unaffected.
const SECONDS_PER_QUESTION = 36;
const MOCK_EXAM_STORE_KEY = "bcsparkMockExam";

// Slugs with a dedicated combined-quiz endpoint (/api/quiz/{slug}/all);
// an "/all" selection under one of these queries that endpoint directly.
const COMBINED_API_SLUGS = new Set([
    "gk",
    "gk-international",
    "bangla",
    "english",
    "ict",
    "sadharon-biggan",
    "vugol-poribesh-dm",
    "noitikota-mullobodh-sushahon",
]);

function apiPathFor(subjectId, topic) {
    if (topic.isAll) {
        const match = (topic.route || "").match(/^\/t20\/([^/]+)\/all$/);
        if (match && COMBINED_API_SLUGS.has(match[1])) {
            return `/api/quiz/${match[1]}/all`;
        }
    }
    return `/api/t20/questions?key=${encodeURIComponent(`${subjectId}:${topic.id}`)}`;
}


const toBn = (value) => String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

// Static, module-level derivation of the selectable subject/topic tree.
const SUBJECTS = Object.entries(practiceRoutes)
    .map(([id, subject]) => ({
        id,
        label: (subject.label || id).replace(/^👉\s*/, ""),
        topics: Object.entries(subject.topics || {})
            .filter(([, t]) => t && t.active)
            .map(([topicId, t]) => ({
                id: topicId,
                label: t.label || topicId,
                route: typeof t.route === "string" ? t.route : "",
                isAll: topicId === "all",
                // Exam size for the mock-test handoff: topic config wins,
                // then the subject default, then the global default of 20.
                questionLimit:
                    Number.isInteger(t.config?.questionLimit) && t.config.questionLimit > 0
                        ? t.config.questionLimit
                        : Number.isInteger(subject.defaultQuestionLimit) &&
                          subject.defaultQuestionLimit > 0
                        ? subject.defaultQuestionLimit
                        : 20,
            })),
    }))
    .filter((s) => s.topics.length > 0);

function pageWindow(current, total, span = 5) {
    let start = Math.max(1, current - Math.floor(span / 2));
    const end = Math.min(total, start + span - 1);
    start = Math.max(1, end - span + 1);
    const pages = [];
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
}

export default function StudyPage() {
    const router = useRouter();

    const [subjectId, setSubjectId] = useState(SUBJECTS[0]?.id || "");
    const [topicId, setTopicId] = useState(SUBJECTS[0]?.topics[0]?.id || "");

    const [questions, setQuestions] = useState(null); // null = not loaded yet
    const [status, setStatus] = useState("idle"); // idle | loading | ready | error
    const [errorMessage, setErrorMessage] = useState("");
    const [reloadToken, setReloadToken] = useState(0);

    const [page, setPage] = useState(1);
    const resultsRef = useRef(null);

    // Reset pagination whenever the question set changes identity.
    const poolKey = `${subjectId}:${topicId}`;

    useEffect(() => {
        if (!poolKey.includes(":")) {
            setStatus("error");
            setErrorMessage("বিষয় নির্বাচন করুন।");
            return;
        }

        const controller = new AbortController();
        setPage(1);
        setStatus("loading");
        setErrorMessage("");

        fetch(`/api/study/questions?key=${encodeURIComponent(poolKey)}`, {
            signal: controller.signal,
        })
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || res.statusText);
                return data;
            })
            .then((data) => {
                setQuestions(Array.isArray(data.questions) ? data.questions : []);
                setStatus("ready");
            })
            .catch((err) => {
                if (controller.signal.aborted) return;
                setQuestions(null);
                setErrorMessage(err.message || "প্রশ্ন লোড করা যায়নি।");
                setStatus("error");
            });

        return () => controller.abort();
    }, [poolKey, reloadToken]);

    const activeSubject = useMemo(
        () => SUBJECTS.find((s) => s.id === subjectId) || null,
        [subjectId]
    );
    const topics = activeSubject?.topics || [];

    const totalPages = questions ? Math.max(1, Math.ceil(questions.length / PAGE_SIZE)) : 1;
    const safePage = Math.min(page, totalPages);
    const pageItems = useMemo(
        () =>
            status === "ready" && Array.isArray(questions)
                ? questions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
                : [],
        [questions, safePage, status]
    );

    const handleSubjectChange = (e) => {
        const nextSubject = SUBJECTS.find((s) => s.id === e.target.value);
        setSubjectId(e.target.value);
        // Cascade: jump to this subject's first active topic.
        setTopicId(nextSubject?.topics[0]?.id || "");
    };

    const goToPage = (next) => {
        if (next < 1 || next > totalPages || next === safePage) return;
        setPage(next);
        // Keep the freshly rendered page in view on long mobile scrolls.
        requestAnimationFrame(() =>
            resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        );
    };

    const offsetStart = questions?.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
    const offsetEnd = Math.min(safePage * PAGE_SIZE, questions?.length || 0);

    // ── Mock test handoff ────────────────────────────────────────────────
    // Safe routing: the CTA is only offered when the selected topic is an
    // active practiceRoutes topic whose route resolves to a real /t20 page
    // (every active route ships a dedicated page — verified at data level).
    const activeTopic = topics.find((t) => t.id === topicId) || null;
    const canStartMockTest =
        status === "ready" &&
        (questions?.length || 0) > 0 &&
        Boolean(activeTopic && activeTopic.route.startsWith("/t20/"));

    const handleStartMockTest = () => {
        if (!activeTopic || !activeTopic.route.startsWith("/t20/")) return;
        const examKey = `${subjectId}:${topicId}`;
        try {
            sessionStorage.setItem(
                MOCK_EXAM_STORE_KEY,
                JSON.stringify({
                    examKey,
                    total: activeTopic.questionLimit,
                    secondsPerQuestion: SECONDS_PER_QUESTION,
                    apiPath: apiPathFor(subjectId, activeTopic),
                })
            );
        } catch (err) {
            // Without the stored handoff the engine ignores ?total=&exam=
            // and simply starts a default quiz — still a safe destination.
            console.error("Failed to persist mock exam handoff:", err);
        }
        router.push(
            `${activeTopic.route}?total=${activeTopic.questionLimit}&exam=${encodeURIComponent(examKey)}`
        );
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
            <Navbar />

            <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
                {/* Header */}
                <header className="text-center mb-6 sm:mb-8">
                    <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                        📖 স্টাডি মোড
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                        প্রশ্ন পড়ুন,{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                            উত্তর ও ব্যাখ্যা
                        </span>{" "}
                        জানুন
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        বিষয় ও টপিক বেছে নিয়ে হাজারো MCQ-এর উত্তরসহ স্টাডি কার্ডে ঘাঁটুন — কোনো
                        সময়সীমা বা চাপ নেই।
                    </p>
                </header>

                {/* Cascading selectors */}
                <section className="rounded-xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
                    <label className="block">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                            বিষয় (Subject)
                        </span>
                        <select
                            value={subjectId}
                            onChange={handleSubjectChange}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
                        >
                            {SUBJECTS.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                            টপিক (Topic)
                        </span>
                        <select
                            key={subjectId}
                            value={topicId}
                            onChange={(e) => setTopicId(e.target.value)}
                            disabled={topics.length === 0}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition disabled:bg-slate-100 disabled:text-slate-400"
                        >
                            {topics.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </section>

                {/* Result meta bar */}
                {status === "ready" && Array.isArray(questions) && questions.length > 0 && (
                    <div
                        ref={resultsRef}
                        className="flex flex-wrap items-center justify-between gap-2 mb-4 scroll-mt-24"
                    >
                        <p className="text-sm font-semibold text-slate-700">
                            মোট{" "}
                            <span className="text-indigo-600 font-black">
                                {toBn(questions.length)}
                            </span>{" "}
                            টি প্রশ্ন
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500">
                            দেখানো হচ্ছে {toBn(offsetStart)}–{toBn(offsetEnd)} • পৃষ্ঠা{" "}
                            {toBn(safePage)}/{toBn(totalPages)}
                        </p>
                    </div>
                )}

                {/* Content states */}
                {status === "loading" && (
                    <div className="space-y-3" aria-live="polite">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse"
                            >
                                <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
                                <div className="h-8 bg-emerald-100 rounded w-40"></div>
                            </div>
                        ))}
                    </div>
                )}

                {status === "error" && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                        <p className="text-red-700 font-semibold">⚠️ {errorMessage}</p>
                        <button
                            onClick={() => setReloadToken((t) => t + 1)}
                            className="mt-3 inline-block bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow transition"
                        >
                            আবার চেষ্টা করুন
                        </button>
                    </div>
                )}

                {status === "ready" && pageItems.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
                        <p className="text-3xl mb-2">🗂️</p>
                        <p className="font-semibold text-slate-700">
                            এই টপিকের জন্য কোনো প্রশ্ন পাওয়া যায়নি।
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                            অন্য একটি টপিক বা বিষয় নির্বাচন করে দেখুন।
                        </p>
                    </div>
                )}

                {/* Study cards */}
                {status === "ready" && pageItems.length > 0 && (
                    <>
                        <ol className="space-y-3 sm:space-y-4 list-none">
                            {pageItems.map((q, i) => {
                                const globalNo = (safePage - 1) * PAGE_SIZE + i + 1;
                                const options = Array.isArray(q.options) ? q.options : [];
                                const parsedAns =
                                    Number.isInteger(q.ans) && q.ans >= 0
                                        ? q.ans
                                        : Number.parseInt(q.ans, 10);
                                const ansIdx =
                                    Number.isInteger(parsedAns) &&
                                    parsedAns >= 0 &&
                                    parsedAns < options.length
                                        ? parsedAns
                                        : null;
                                const answerText = ansIdx !== null ? String(options[ansIdx]) : "";
                                const explain =
                                    typeof q.explain === "string" && q.explain.trim()
                                        ? q.explain.trim()
                                        : "";

                                return (
                                    <li
                                        key={globalNo}
                                        className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-shadow"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="shrink-0 inline-flex items-center justify-center h-7 min-w-[1.75rem] px-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold">
                                                {toBn(globalNo)}
                                            </span>
                                            <p className="flex-1 text-[15px] sm:text-base font-semibold text-slate-900 leading-relaxed break-words">
                                                {q.q}
                                            </p>
                                        </div>

                                        {/* Options (for context while studying) */}
                                        {options.length > 0 && (
                                            <ul className="mt-3 space-y-1.5 pl-1">
                                                {options.map((opt, oi) => (
                                                    <li
                                                        key={oi}
                                                        className={
                                                            oi === ansIdx
                                                                ? "text-sm font-semibold text-emerald-800"
                                                                : "text-sm text-slate-500"
                                                        }
                                                    >
                                                        <span className="inline-block min-w-[1.5rem] font-bold">
                                                            {OPT_LETTERS[oi] || toBn(oi + 1)}.
                                                        </span>{" "}
                                                        {String(opt)}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {/* Direct answer extracted from options[q.ans] */}
                                        {answerText && (
                                            <p className="mt-3.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 break-words">
                                                — সঠিক উত্তর: {answerText}
                                            </p>
                                        )}

                                        {/* Styled explanation box */}
                                        {explain && (
                                            <div className="mt-3 rounded-r-lg border-l-4 border-amber-400 bg-amber-50 px-3.5 py-3">
                                                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">
                                                    💡 ব্যাখ্যা
                                                </p>
                                                <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-line break-words">
                                                    {explain}
                                                </p>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>


                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav
                                aria-label="পৃষ্ঠা নেভিগেশন"
                                className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
                            >
                                <button
                                    onClick={() => goToPage(safePage - 1)}
                                    disabled={safePage === 1}
                                    className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    ‹ পূর্ববর্তী
                                </button>

                                {pageWindow(safePage, totalPages).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => goToPage(p)}
                                        aria-current={p === safePage ? "page" : undefined}
                                        className={
                                            p === safePage
                                                ? "min-w-9 h-9 px-2 rounded-lg bg-indigo-600 text-white text-sm font-bold shadow"
                                                : "min-w-9 h-9 px-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition"
                                        }
                                    >
                                        {toBn(p)}
                                    </button>
                                ))}

                                <button
                                    onClick={() => goToPage(safePage + 1)}
                                    disabled={safePage === totalPages}
                                    className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    পরবর্তী ›
                                </button>
                            </nav>
                        )}

                        {/* Full-width mock-test conversion CTA (bottom of study list) */}
                        {canStartMockTest && (
                            <div className="mt-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 p-[1.5px] shadow-lg">
                                <button
                                    onClick={handleStartMockTest}
                                    className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 px-4 py-4 sm:py-5 text-center text-white transition-transform hover:brightness-110 active:scale-[0.99]"
                                >
                                    <span className="block text-base sm:text-lg font-black">
                                        প্রস্তুতি সম্পন্ন? এই টপিকের মক টেস্ট দিন ⚡
                                    </span>
                                    <span className="mt-1 block text-xs sm:text-sm text-blue-100">
                                        {toBn(activeTopic.questionLimit)}টি প্রশ্ন • নেগেটিভ মার্কিং সহ •
                                        ফলাফল ও ব্যাখ্যা সাথে সাথে
                                    </span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Sticky bottom CTA — always reachable while studying */}
            {canStartMockTest && (
                <div className="sticky bottom-0 z-40 border-t border-indigo-100 bg-white/95 backdrop-blur px-3 sm:px-6 py-3 shadow-[0_-4px_16px_rgba(15,23,42,0.08)]">
                    <button
                        onClick={handleStartMockTest}
                        className="mx-auto flex w-full max-w-4xl items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-3 text-sm sm:text-base font-bold text-white shadow transition hover:brightness-110 active:scale-[0.99]"
                    >
                        প্রস্তুতি সম্পন্ন? এই টপিকের মক টেস্ট দিন ⚡
                    </button>
                </div>
            )}

            <Footer />
        </div>
    );
}

