"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, X } from "lucide-react";
import practiceRoutes from "@/data/practiceRoutes";

// Seconds allotted per question (BCS preliminary pace).
const SECONDS_PER_QUESTION = 36;

// sessionStorage key carrying the mock-exam handoff to the target quiz page
// (QuickPracticeEngine validates the URL params against this on mount).
const MOCK_EXAM_STORE_KEY = "bcsparkMockExam";

// Slugs that have a dedicated combined-quiz endpoint (/api/quiz/{slug}/all).
// If the chosen topic is an "/all" route under one of these slugs we query
// that endpoint directly; every other selection falls back to the generic
// practice resolver /api/t20/questions?key=<subjectId>:<topicId>.
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

// Issue 1 — parse subjects and sub-topics straight out of practiceRoutes.js.
// Only topics with active:true are offered, and subjects left without any
// active topic are skipped entirely.
const SUBJECT_OPTIONS = Object.entries(practiceRoutes)
  .map(([id, subject]) => ({
    id,
    label: String(subject.label || id).replace(/👉\s*/g, "").trim(),
    topics: Object.entries(subject.topics || {})
      .filter(([, topic]) => topic && topic.active && topic.route)
      .map(([key, topic]) => ({
        key,
        label: String(topic.label || key),
        route: topic.route,
        isAll: key === "all",
      })),
  }))
  .filter((subject) => subject.topics.length > 0);

// API equivalent for a given selection: prefer the subject's dedicated
// /all endpoint when one exists, otherwise resolve via /api/t20/questions.
const apiPathFor = (subjectId, topic) => {
  if (topic.isAll) {
    const match = topic.route.match(/^\/t20\/([^/]+)\/all$/);
    if (match && COMBINED_API_SLUGS.has(match[1])) {
      return `/api/quiz/${match[1]}/all`;
    }
  }
  return `/api/t20/questions?key=${encodeURIComponent(
    `${subjectId}:${topic.key}`
  )}`;
};

// Question count options for the model test.
const QUESTION_OPTIONS = [20, 40, 70, 100];

// Rules shown in the interactive modal before starting an exam.
const EXAM_RULES = [
  "প্রতিটি ভুল উত্তরে ০.৫ নম্বর কাটা যাবে (নেগেটিভ মার্কিং)।",
  "উত্তর না দিলে অর্থাৎ স্কিপ করলে নম্বর কাটা বা যোগ হবে না।",
  `প্রতিটি প্রশ্নের জন্য ${SECONDS_PER_QUESTION} সেকেন্ড করে সময় গণনা করা হয়েছে।`,
  "সময় শেষ হলে পরীক্ষা স্বয়ংক্রিয়ভাবে জমা হয়ে ফলাফল দেখানো হবে।",
  "পরীক্ষা চলাকালীন পেজ রিফ্রেশ করলে আপনার উত্তরপত্র হারিয়ে যাবে।",
  "ফলাফল জমা দেওয়ার পর ব্যাখ্যা সহ উত্তরপত্র রিভিউ ও JPEG ডাউনলোড করতে পারবেন।",
];

// ── Bangla number helpers ──────────────────────────────────────────────
const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBn = (value) =>
  String(value).replace(/\d/g, (digit) => BN_DIGITS[Number(digit)]);

// Auto time calculation: count * SECONDS_PER_QUESTION, rendered in Bangla.
const formatDuration = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0 && seconds > 0)
    return `${toBn(minutes)} মিনিট ${toBn(seconds)} সেকেন্ড`;
  if (minutes > 0) return `${toBn(minutes)} মিনিট`;
  return `${toBn(seconds)} সেকেন্ড`;
};

const CARD_CLASS =
  "flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow min-h-[460px]";

export default function MockModelTestCard() {
  const router = useRouter();
  const [subjectId, setSubjectId] = useState(SUBJECT_OPTIONS[0].id);
  const [topicKey, setTopicKey] = useState(SUBJECT_OPTIONS[0].topics[0].key);
  const [questionCount, setQuestionCount] = useState(20);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const selectedSubject =
    SUBJECT_OPTIONS.find((s) => s.id === subjectId) || SUBJECT_OPTIONS[0];
  const selectedTopic =
    selectedSubject.topics.find((t) => t.key === topicKey) ||
    selectedSubject.topics[0];

  const totalSeconds = questionCount * SECONDS_PER_QUESTION;
  const examKey = `${selectedSubject.id}:${selectedTopic.key}`;

  // Cascaded dropdowns: whenever the subject changes, snap the topic
  // selection onto a topic that actually belongs to the new subject.
  useEffect(() => {
    if (!selectedSubject.topics.some((t) => t.key === topicKey)) {
      setTopicKey(selectedSubject.topics[0].key);
    }
  }, [selectedSubject, topicKey]);

  // Close the rules modal with Escape for better UX.
  useEffect(() => {
    if (!showRulesModal) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowRulesModal(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showRulesModal]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowRulesModal(true);
  };

  // Issue 2 — clean routing: instead of mounting the quiz engine over the
  // homepage, persist the exam setup handoff and navigate to the designated
  // practice route with ?total=&exam=. The QuickPracticeEngine mounted by
  // that page validates the pair, pulls exactly `total` questions from the
  // resolved API equivalent and initialises the countdown at total * 36s.
  const handleConfirmStartExam = () => {
    try {
      sessionStorage.setItem(
        MOCK_EXAM_STORE_KEY,
        JSON.stringify({
          examKey,
          total: questionCount,
          secondsPerQuestion: SECONDS_PER_QUESTION,
          apiPath: apiPathFor(selectedSubject.id, selectedTopic),
        })
      );
      router.push(
        `${selectedTopic.route}?total=${questionCount}&exam=${encodeURIComponent(examKey)}`
      );
      setShowRulesModal(false);
    } catch (err) {
      console.error("Failed to start the mock model test:", err);
    }
  };

  // (Issue 2) Navigation happens via router.push in handleConfirmStartExam —
  // the quiz itself renders on the target practice page, never over this one.

  return (
    <>
      {/* ===== Setup card (replaces the hardcoded InfoRow column 2) ===== */}
      <div className={CARD_CLASS}>
        <div>
          {/* Header */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <Play className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary leading-tight">মক মডেল টেস্ট</h3>
              <p className="text-xs text-gray-500">পরীক্ষার সেটআপ ও প্রস্তুতি</p>
            </div>
          </div>

          <form id="mockTestForm" onSubmit={handleFormSubmit} className="space-y-4">
            {/* Subject Select — parsed from practiceRoutes.js */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">বিষয়</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-blue-400 focus:outline-none"
              >
                {SUBJECT_OPTIONS.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Select — cascaded from the selected subject (active topics only) */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">টপিক</label>
              <select
                value={topicKey}
                onChange={(e) => setTopicKey(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-blue-400 focus:outline-none"
              >
                {selectedSubject.topics.map((topic) => (
                  <option key={topic.key} value={topic.key}>
                    {topic.isAll ? `★ ${topic.label}` : topic.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Questions Select */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">প্রশ্ন সংখ্যা</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-blue-400 focus:outline-none"
              >
                {QUESTION_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}টি প্রশ্ন
                  </option>
                ))}
              </select>
            </div>

            {/* Auto-calculated Duration */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">সময় (স্বয়ংক্রিয়)</label>
              <div className="flex items-center gap-2 w-full rounded-xl border border-blue-100 bg-blue-50/60 px-3 py-2 text-sm font-bold text-primary">
                <span>{formatDuration(totalSeconds)}</span>
                <span className="ml-auto text-[10px] font-medium text-gray-500">
                  ({toBn(questionCount)} × {SECONDS_PER_QUESTION}s)
                </span>
              </div>
            </div>

            {/* Target route preview */}
            {/* <div className="rounded-xl bg-indigo-50 px-3 py-2">
              <p className="text-[10px] font-semibold text-indigo-700">টপিক রুট</p>
              <p className="break-all font-mono text-[11px] text-indigo-900">{selectedTopic.route}</p>
            </div> */}
          </form>
        </div>

        {/* Footer: submit button (card footer) + caption below it */}
        <div>
          <p className="mt-2 text-[10px] mb-5 text-center text-gray-400 font-medium">
            মক টেস্ট দিয়ে নিজেকে যাচাই করুন
          </p>
          <button
            type="submit"
            form="mockTestForm"
            onClick={handleFormSubmit}
            className="w-full cursor-pointer mt-2 rounded-xl bg-blue-600 py-3 text-center text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            পরীক্ষা শুরু করুন ⚡
          </button>
        </div>
      </div>

      {/* ===== Rules & Instructions Modal ===== */}
      {showRulesModal && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="পরীক্ষার নিয়মাবলি"
        >
          {/* Backdrop */}
          <button
            aria-label="বন্ধ করুন"
            onClick={() => setShowRulesModal(false)}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Dialog */}
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4">
              <div>
                <h3 className="text-base font-extrabold text-white">পরীক্ষার নিয়মাবলি 📋</h3>
                <p className="mt-0.5 text-[11px] font-medium text-blue-100">
                  {selectedSubject.label} › {selectedTopic.label}
                </p>
              </div>
              <button
                onClick={() => setShowRulesModal(false)}
                className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="বন্ধ করুন"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[55vh] space-y-2.5 overflow-y-auto px-5 py-4">
              {/* Setup summary */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="rounded-xl bg-blue-50 px-2 py-2 text-center">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-blue-500">প্রশ্ন</p>
                  <p className="text-sm font-extrabold text-blue-900">{toBn(questionCount)}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 px-2 py-2 text-center">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-emerald-600">সময়</p>
                  <p className="text-sm font-extrabold text-emerald-900">{formatDuration(totalSeconds)}</p>
                </div>
                <div className="rounded-xl bg-amber-50 px-2 py-2 text-center">
                  <p className="text-[9px] font-semibold uppercase tracking-wide text-amber-600">পাস মার্ক</p>
                  <p className="text-sm font-extrabold text-amber-900">{toBn(50)}%</p>
                </div>
              </div>

              {EXAM_RULES.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-xl bg-gray-50 px-3 py-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-extrabold text-blue-700">
                    {toBn(idx + 1)}
                  </span>
                  <p className="text-[12px] leading-relaxed text-gray-700">{rule}</p>
                </div>
              ))}
            </div>

            {/* Footer actions */}
            <div className="flex gap-3 border-t border-gray-100 px-5 py-4">
              <button
                onClick={() => setShowRulesModal(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50"
              >
                বাতিল করুন
              </button>
              <button
                onClick={handleConfirmStartExam}
                className="flex-1 cursor-pointer rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
              >
                শুরু করুন ⚡
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}