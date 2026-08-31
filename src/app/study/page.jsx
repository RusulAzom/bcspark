'use client';

// Dedicated Study Mode page (/study).
//
// 3-tier cascading filtering (Subject > Topic > Micro-topic) sourced from
// data/microTopics.json and served by /api/study/questions:
//   - Level 1: root keys of microTopics.json (labelled via practiceRoutes).
//   - Level 2: specific topics only — aggregated "(All)" topics are excluded
//     by design; users enter Study Mode for targeted topic preparation.
//   - Level 3: micro-topic strings, each mapped to a specific JSON file.
// Cards render blog/cheatsheet style — Question -> Direct Answer ->
// Explanation — with MCQ options hidden, so 40 items fit per page.
// Client-side pagination keeps 500+ question pools lag-free — only the
// current page is mounted at a time.
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import practiceRoutes from "@/data/practiceRoutes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PAGE_SIZE = 40; // cards are compact revision notes (no MCQ options)
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

// Level 3 "whole topic" choice: pools every micro-topic file of the selected
// specific topic. Cross-topic "(All)" aggregates stay excluded.
const MICRO_ALL = "__all__";

// ── Mock test handoff (mirrors MockModelTestCard.jsx protocol) ──────────
// QuickPracticeEngine validates ?total=&exam= against this sessionStorage
// entry, then pulls exactly `total` questions from `apiPath` and starts a
// timed exam. Normal visits without params are unaffected.
const SECONDS_PER_QUESTION = 36;
const MOCK_EXAM_STORE_KEY = "bcsparkMockExam";

// Issue 2 — the /study exam CTA always starts the standard mock exam with
// fixed parameters: exactly 20 questions over 12 minutes (720 seconds).
const MOCK_EXAM_FIXED_TOTAL = 20;
const MOCK_EXAM_FIXED_TIME = 720; // seconds (12 minutes)

const toBn = (value) => String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

// Defensive display guard: the API already maps Subject/Topic keys to clean
// labels, but if any raw camelCase/PascalCase key ever slips through, render
// it as readable Title Case (e.g. "bangladesherSongbidhan" -> "Bangladesher
// Songbidhan") so users never see an unformatted key.
function formatKeyLike(label) {
    if (typeof label !== "string" || label.trim() === "") return "";
    const trimmed = label.trim();
    // Already looks human (contains a space or a digit-separated pattern).
    if (/\s/.test(trimmed)) return trimmed;
    // No spaces — check for a camelCase boundary or snake/underscore or digit.
    if (!/[a-z\d][A-Z]|[_-]/.test(trimmed)) return trimmed;
    return trimmed
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_\-]+/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

// topic folder ("bangla Sahitto/19thSahittik") -> practice route info, used
// by the mock-test CTA. Built from practiceRoutes (active topics only).
const ROUTE_BY_FOLDER = Object.entries(practiceRoutes).reduce((index, [subjectId, subject]) => {
    Object.entries(subject.topics || {}).forEach(([topicId, t]) => {
        if (!t || !t.active || typeof t.folder !== "string") return;
        const questionLimit =
            Number.isInteger(t.config?.questionLimit) && t.config.questionLimit > 0
                ? t.config.questionLimit
                : Number.isInteger(subject.defaultQuestionLimit) &&
                  subject.defaultQuestionLimit > 0
                ? subject.defaultQuestionLimit
                : 20;
        index[t.folder] = {
            subjectId,
            topicId,
            route: typeof t.route === "string" ? t.route : "",
            questionLimit,
        };
    });
    return index;
}, {});

function pageWindow(current, total, span = 5) {
    let start = Math.max(1, current - Math.floor(span / 2));
    const end = Math.min(total, start + span - 1);
    start = Math.max(1, end - span + 1);
    const pages = [];
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
}

function StudyPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Issue 1 — first-render snapshot of the deep-link filters
    // (?subject=&topic=&micro_topic=). Frozen in a ref so our own
    // router.push updates can never re-trigger filter hydration.
    const initialQueryRef = useRef(null);
    if (initialQueryRef.current === null) {
        initialQueryRef.current = {
            subject: searchParams.get("subject") || "",
            topic: searchParams.get("topic") || "",
            micro: searchParams.get("micro_topic") || "",
        };
    }

    // 3-tier cascading selection (sourced from microTopics.json via the API)
    const [subjects, setSubjects] = useState(null); // null = filter tree loading
    const [subjectKey, setSubjectKey] = useState("");
    const [topicKey, setTopicKey] = useState("");
    const [microFile, setMicroFile] = useState(MICRO_ALL); // MICRO_ALL = whole topic

    const [questions, setQuestions] = useState(null); // null = not loaded yet
    const [status, setStatus] = useState("idle"); // idle | loading | ready | error
    const [errorMessage, setErrorMessage] = useState("");
    const [reloadToken, setReloadToken] = useState(0);

    const [page, setPage] = useState(1);
    const resultsRef = useRef(null);

    const activeSubject = useMemo(
        () => (subjects || []).find((s) => s.id === subjectKey) || null,
        [subjects, subjectKey]
    );
    const topics = activeSubject?.topics || [];
    const activeTopic = topics.find((t) => t.id === topicKey) || null;
    const microOptions = activeTopic?.microTopics || [];

    // Load the Subject > Topic > Micro-topic tree once (microTopics.json).
    useEffect(() => {
        let cancelled = false;
        fetch("/api/study/questions")
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || res.statusText);
                return data;
            })
            .then((data) => {
                if (cancelled) return;
                const list = Array.isArray(data.subjects) ? data.subjects : [];
                setSubjects(list);

                // Issue 1 — hydrate the cascading filters from the incoming
                // URL (?subject=&topic=&micro_topic=); fall back to defaults.
                const wanted = initialQueryRef.current || {};
                const urlSubject = wanted.subject
                    ? list.find((s) => s.id === wanted.subject)
                    : null;
                const chosenSubject = urlSubject || list[0] || null;
                setSubjectKey(chosenSubject?.id || "");

                const topicList = chosenSubject?.topics || [];
                const urlTopic = wanted.topic
                    ? topicList.find((t) => t.id === wanted.topic)
                    : null;
                const chosenTopic = urlTopic || topicList[0] || null;
                setTopicKey(chosenTopic?.id || "");

                if (
                    wanted.micro &&
                    wanted.micro !== MICRO_ALL &&
                    (chosenTopic?.microTopics || []).some((m) => m.file === wanted.micro)
                ) {
                    setMicroFile(wanted.micro);
                }
            })
            .catch((err) => {
                if (cancelled) return;
                setSubjects([]);
                setStatus("error");
                setErrorMessage(err.message || "ফিল্টার তালিকা লোড করা যায়নি।");
            });
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!subjectKey || !topicKey) return;

        const controller = new AbortController();
        setPage(1);
        setStatus("loading");
        setErrorMessage("");

        const params = new URLSearchParams({ subject: subjectKey, topic: topicKey });
        if (microFile !== MICRO_ALL) params.set("micro", microFile);

        fetch(`/api/study/questions?${params.toString()}`, {
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
    }, [subjectKey, topicKey, microFile, reloadToken]);

    const totalPages = questions ? Math.max(1, Math.ceil(questions.length / PAGE_SIZE)) : 1;
    const safePage = Math.min(page, totalPages);
    const pageItems = useMemo(
        () =>
            status === "ready" && Array.isArray(questions)
                ? questions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
                : [],
        [questions, safePage, status]
    );


    // Issue 1 — mirror filter selections into the URL for SEO & deep-linking.
    // { scroll: false } keeps long study lists from jumping to the top.
    const syncUrlFilters = (next) => {
        const params = new URLSearchParams();
        if (next.subject) params.set("subject", next.subject);
        if (next.topic) params.set("topic", next.topic);
        if (next.micro && next.micro !== MICRO_ALL)
            params.set("micro_topic", next.micro);
        const qs = params.toString();
        router.push(qs ? `/study?${qs}` : "/study", { scroll: false });
    };

    // Cascading resets: a Subject change snaps to its first specific topic and
    // clears the micro-topic; a Topic change clears the micro-topic.
    const handleSubjectChange = (e) => {
        const nextSubject = (subjects || []).find((s) => s.id === e.target.value);
        const nextTopic = nextSubject?.topics[0]?.id || "";
        setSubjectKey(e.target.value);
        setTopicKey(nextTopic);
        setMicroFile(MICRO_ALL);
        syncUrlFilters({ subject: e.target.value, topic: nextTopic, micro: MICRO_ALL });
    };

    const handleTopicChange = (e) => {
        setTopicKey(e.target.value);
        setMicroFile(MICRO_ALL);
        syncUrlFilters({ subject: subjectKey, topic: e.target.value, micro: MICRO_ALL });
    };

    const handleMicroChange = (e) => {
        setMicroFile(e.target.value);
        syncUrlFilters({ subject: subjectKey, topic: topicKey, micro: e.target.value });
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

    // ── Mock test handoff (micro-topic targeted) ─────────────────────────
    // Safe routing: the CTA is only offered when the selected microTopics
    // topic maps to an active practiceRoutes topic with a real /t20 page.
    const routeInfo = ROUTE_BY_FOLDER[`${subjectKey}/${topicKey}`] || null;

    // When a specific micro-topic is active, the exam is served strictly
    // from that micro-topic's JSON file via the study endpoint and runs on
    // the exact loaded pool; otherwise the topic's configured limit applies.
    const activeMicro =
        microFile !== MICRO_ALL
            ? microOptions.find((m) => m.file === microFile) || null
            : null;
    const studyApiPath = `/api/study/questions?subject=${encodeURIComponent(
        subjectKey
    )}&topic=${encodeURIComponent(topicKey)}${
        activeMicro ? `&micro=${encodeURIComponent(microFile)}` : ""
    }&total=${MOCK_EXAM_FIXED_TOTAL}&rand=${Date.now()}`;

    const canStartMockTest =
        status === "ready" &&
        (questions?.length || 0) > 0 &&
        Boolean(routeInfo && routeInfo.route.startsWith("/t20/"));

    // Dynamic CTA label: surface the active micro-topic when one is selected
    // (e.g. "কারক বিভক্তি — মক টেস্ট দিন ⚡").
    const mockCtaLabel = activeMicro
        ? `${activeMicro.label} — মক টেস্ট দিন ⚡`
        : "প্রস্তুতি সম্পন্ন? এই টপিকের মক টেস্ট দিন ⚡";

    const handleStartMockTest = () => {
        if (!routeInfo || !routeInfo.route.startsWith("/t20/")) return;
        const examKey = `${routeInfo.subjectId}:${routeInfo.topicId}`;
        try {
            sessionStorage.setItem(
                MOCK_EXAM_STORE_KEY,
                JSON.stringify({
                    examKey,
                    // Issue 2 — the /study CTA always starts the standard mock
                    // exam: exactly 20 questions over a fixed 12-minute timer,
                    // scoped to the active filters via the study endpoint.
                    total: MOCK_EXAM_FIXED_TOTAL,
                    secondsPerQuestion: SECONDS_PER_QUESTION,
                    // Dataset reference: the engine fetches strictly from
                    // this study endpoint — the specific micro-topic file
                    // when one is selected, else the whole topic folder.
                    apiPath: studyApiPath,
                    dataset: {
                        source: "microTopics",
                        subject: subjectKey,
                        topic: topicKey,
                        microTopic: activeMicro?.label || null,
                        microFile: activeMicro ? microFile : null,
                    },
                })
            );
        } catch (err) {
            // Without the stored handoff the engine ignores ?total=&exam=
            // and simply starts a default quiz — still a safe destination.
            console.error("Failed to persist mock exam handoff:", err);
        }
        router.push(
            `${routeInfo.route}?total=${MOCK_EXAM_FIXED_TOTAL}&time=${MOCK_EXAM_FIXED_TIME}&exam=${encodeURIComponent(examKey)}`
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
                        নিচে থেকে প্রথমে সাবজেক্ট সিলেক্ট করুন, এরপর টপিক এবং পরিশেষে মাইক্রো-টপিক বেছে
                        নিয়ে নির্দিষ্ট বিষয়ের ওপর পড়াশোনা করুন ও মক টেস্ট দিন।
                    </p>
                </header>

                {/* 3-tier cascading selectors: Subject > Topic > Micro-topic */}
                <section className="rounded-xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
                    <label className="block">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                            বিষয় (Subject)
                        </span>
                        <select
                            value={subjectKey}
                            onChange={handleSubjectChange}
                            disabled={!subjects}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition disabled:bg-slate-100 disabled:text-slate-400"
                        >
                            {(subjects || []).map((s) => (
                                <option key={s.id} value={s.id}>
                                    {formatKeyLike(s.label)}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Level 2: specific topics only — "(All)" aggregates are
                        intentionally never offered in Study Mode. */}
                    <label className="block">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                            টপিক (Topic)
                        </span>
                        <select
                            key={subjectKey}
                            value={topicKey}
                            onChange={handleTopicChange}
                            disabled={topics.length === 0}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition disabled:bg-slate-100 disabled:text-slate-400"
                        >
                            {topics.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {formatKeyLike(t.label)}
                                </option>
                            ))}
                        </select>
                    </label>

                    {/* Level 3: micro-topic -> loads its specific JSON file */}
                    <label className="block sm:col-span-2">
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                            মাইক্রো-টপিক (Micro-topic)
                        </span>
                        <select
                            key={topicKey}
                            value={microFile}
                            onChange={handleMicroChange}
                            disabled={microOptions.length === 0}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition disabled:bg-slate-100 disabled:text-slate-400"
                        >
                            <option value={MICRO_ALL}>সব মাইক্রো-টপিক (পুরো টপিক)</option>
                            {microOptions.map((m) => (
                                <option key={m.file} value={m.file}>
                                    {m.label}
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
                                        {/* Question */}
                                        <div className="flex items-start gap-3">
                                            <span className="shrink-0 inline-flex items-center justify-center h-7 min-w-[1.75rem] px-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold">
                                                {toBn(globalNo)}
                                            </span>
                                            <p className="flex-1 text-[15px] sm:text-base font-semibold text-slate-900 leading-relaxed break-words">
                                                {q.q}
                                            </p>
                                        </div>

                                        {/* Direct answer — MCQ options are intentionally
                                            hidden; Study Mode renders revision-note style
                                            cards (Question -> Answer -> Explanation). */}
                                        {answerText && (
                                            <p className="mt-3.5 inline-block max-w-full rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 break-words">
                                                👉 সঠিক উত্তর: {answerText}
                                            </p>
                                        )}

                                        {/* Explanation box */}
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
                                        {mockCtaLabel}
                                    </span>
                                    <span className="mt-1 block text-xs sm:text-sm text-blue-100">
                                        {activeMicro
                                            ? `${activeMicro.label} এর স্কোপ করা ${toBn(MOCK_EXAM_FIXED_TOTAL)}টি প্রশ্ন • ${toBn(12)} মিনিট`
                                            : `${toBn(MOCK_EXAM_FIXED_TOTAL)}টি প্রশ্ন • ${toBn(12)} মিনিট (৭২০ সেকেন্ড) • নেগেটিভ মার্কিং সহ`}
                                    </span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}

// Issue 1 — useSearchParams() requires a Suspense boundary for static/SSR
// generation of the /study route (Next.js build requirement).
export default function StudyPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                    <div className="text-xl font-bold animate-pulse text-slate-600">
                        স্টাডি মোড লোড হচ্ছে...
                    </div>
                </div>
            }
        >
            <StudyPageContent />
        </Suspense>
    );
}

