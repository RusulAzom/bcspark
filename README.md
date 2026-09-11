This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 🚀 BCSpark QuickPracticeEngine v2

This guide explains how to add a new quiz to the **QuickPracticeEngine**.

---

# 📂 Step 1: Create Question JSON

Create a new JSON file inside the appropriate topic folder.

Example:

```
src/data/t20/english/grammar/synonyms/synonyms.json
```

Each question must follow this structure:

```json
{
  "id": 1,
  "q": "মহাস্থানগড় কোন নদীর তীরে অবস্থিত?",
  "options": [
    "পদ্মা",
    "করতোয়া",
    "মেঘনা",
    "যমুনা"
  ],
  "ans": 1,
  "source": "BCS 38th",
  "topicsId": 111,
  "explain": "প্রাচীন পুণ্ড্রবর্ধন ভুক্তির রাজধানী মহাস্থানগড় করতোয়া নদীর পশ্চিম তীরে অবস্থিত।"
}
```

## Question Fields

| Field | Type | Description |
|------|------|-------------|
| id | Number | Unique Question ID |
| q | String | Question |
| options | Array | Answer options |
| ans | Number | Correct answer index (0-based) |
| source | String | Question source |
| topicsId | Number | Topic ID |
| explain | String | Explanation shown after submission |

---

# 📄 Step 2: Create Quiz Page

Create a new page inside the App Router.

Example:

```
src/app/t20/english/synonyms/page.jsx
```

Example:

```jsx
import questions from "@/data/t20/english/grammar/synonyms/synonyms.json";
import QuickPracticeEngine from "@/components/QuickPracticeEngine";

export default function SynonymsPage() {

    const randomQuestions = [...questions]
        .sort(() => 0.5 - Math.random())
        .slice(0, 20);

    return (
        <QuickPracticeEngine
            questions={randomQuestions}
            config={{
                title: "Grammar - Synonyms",
                questionLimit: 20,
                timeLimit: 120,
                timerDisplay: "seconds"
            }}
        />
    );
}
```

---

# 🛣 Step 3: Register Route

Open

```
src/data/practiceRoutes.js
```

Add the new quiz inside the correct subject.

Example:

```javascript
synonyms: {
    label: "Grammar - Synonyms",
    route: "/t20/english/synonyms",
    active: true,
},
```

If `active` is set to `false`, the quiz will appear as **Coming Soon**.

---

# ⚙️ Config Options

| Property | Description | Example |
|----------|-------------|---------|
| title | Quiz title | "Spelling Test" |
| questionLimit | Number of questions | 20 |
| timeLimit | Time in seconds | 120 |
| timerDisplay | Timer style | "seconds" / "clock" |

Example:

```jsx
config={{
    title: "Model Test 01",
    questionLimit: 200,
    timeLimit: 7200,
    timerDisplay: "clock"
}}
```

---

# ⏱ Timer Modes

### T20 Practice

```jsx
timerDisplay: "seconds"
```

Shows:

```
118s
```

---

### Model Test

```jsx
timerDisplay: "clock"
```

Shows:

```
02:00:00
01:35:45
00:08:21
```

---

# 📁 Recommended Folder Structure

```
src/
│
├── app/
│   └── t20/
│       ├── english/
│       └── gk/
│
├── components/
│   └── QuickPracticeEngine.jsx
│
└── data/
    ├── practiceRoutes.js
    └── t20/
        ├── english/
        └── GK/
```

---

# ✅ Current Features

- Random Question Selection
- Config Driven Quiz
- Auto Route Registration
- Negative Marking
- Skip Detection
- Question Explanation
- Source Display
- Timer
- Screenshot Result Card
- Reusable Quiz Engine

---

# 🔮 Future Support

The engine is designed to support:

- Chapter Practice
- 50 Question Tests
- 100 Question Tests
- 200 Question Model Tests
- Multiple JSON Question Banks
- AI Explanation
- Weak Topic Analysis
- Analytics Dashboard

---

## 🎉 Done!

After completing these three steps:

1. Create Question JSON
2. Create `page.jsx`
3. Register the route

Your new quiz will automatically work with the **QuickPracticeEngine**.

## Sylebus Topics Code
1. GK বাংলাদেশ বিষয়াবলি 	২৫ 
2. GK আন্তজার্তিক বিষয়াবলি 	২৫ 
3. বাংলা ভাষা ও সাহিত্য 	৩০ 
4. English Language and Literature	৩০ 
5. ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা 	১০ 
6. সাধারণ বিজ্ঞান 	১৫ 
7. কম্পিউটার ও তথ্য প্রযুক্তি 	১৫ 
8. গাণিতিক যুক্তি 	২০ 
8.9. মানসিক দক্ষতা 	১৫ 
9. নৈতিকতা, মূল্যবোধ ও সু-শাসন 	১৫

## 100 = GK বাংলাদেশ বিষয়াবলি 	২৫ 
টপিক ১: 110 = বাংলাদেশের জাতীয় বিষয়াবলি - ০৬ নম্বর
111 = বাংলাদেশের প্রাচীনকাল হতে সম-সাময়িক কালের ইতিহাস
112 = কৃষ্টি ও সংস্কৃতি
113 = ভাষা আন্দোলন
114 = ১৯৫৪ সালের নির্বাচন
115 = গণ অভ্যুত্থান ১৯৬৯
116 = বাংলাদেশের স্বাধীনতা সংগ্রাম ও মহান মুক্তিযুদ্ধের ইতিহাস
117 = মুক্তিযুদ্ধের রণকৌশল
118 = মুক্তিযুদ্ধে বৃহৎ শক্তিবর্গের ভূমিকা
119 = পাকিস্তানী বাহিনীর আত্মসমর্পণ এবং বাংলাদেশের অভ্যুদয়

টপিক ২: 120 = বাংলাদেশের কৃষিজ সম্পদ - ০২ নম্বর
121 = শস্য উৎপাদন এবং এর বহুমুখীকরণ
122 = খাদ্য উৎপাদন ও ব্যবস্থাপনা

টপিক ৩: 130 = বাংলাদেশের জনশুমারি - ০২ নম্বর
131 = জনসংখ্যা
132 = জাতি
133 = গোষ্ঠী
134 = ক্ষুদ্র নৃগোষ্ঠী সংক্রান্ত বিষয়াদি

টপিক ৪: 140 = বাংলাদেশের অর্থনীতি - ০২ নম্বর
141 = উন্নয়ন পরিকল্পনা প্রেক্ষিত
142 = জাতীয় আয়-ব্যয়
143 = রাজনীতি ও বার্ষিক উন্নয়ন কর্মসূচি
144 = দারিদ্র্য বিমোচন ইত্যাদি

টপিক ৫: 150 = বাংলাদেশের শিল্প ও বাণিজ্য - ০২ নম্বর
151 = শিল্প উৎপাদন
152 = পণ্য আমদানি ও রপ্তানিকরণ
153 = গার্মেন্টস শিল্প ও এর সার্বিক ব্যবস্থাপনা
154 = অন্যান্য শিল্পসমূহ
155 = বৈদেশিক লেন-দেন
156 = অর্থ প্রেরণ
157 = ব্যাংক ও বীমা ব্যবস্থাপনা ইত্যাদি

টপিক ৬: 160 = বাংলাদেশের সংবিধান - ০৩ নম্বর
161 = প্রস্তাবনা ও বৈশিষ্ট্য
162 = মৌলিক অধিকারসহ রাষ্ট্র পরিচালনার মূলনীতিসমূহ
163 = সংবিধানের সংশোধনীসমূহ

টপিক ৭: 170 = বাংলাদেশের রাজনৈতিক ব্যবস্থা - ০৩ নম্বর
171 = রাজনৈতিক দলসমূহের গঠন, ভূমিকা ও কার্যক্রম
172 = ক্ষমতাসীন ও বিরোধী দলের পারস্পরিক সম্পর্কাদি
173 = সুশীল সমাজ ও চাপ সৃষ্টিকারী গোষ্ঠীসমূহ এবং এদের ভূমিকা

টপিক ৮: 180 = বাংলাদেশের সরকার ব্যবস্থা - ০৩ নম্বর
181 = আইন, শাসন ও বিচার বিভাগসমূহ
182 = আইন প্রণয়ন
183 = নীতি নির্ধারণ
184 = জাতীয় ও স্থানীয় পর্যায়ের প্রশাসনিক ব্যবস্থাপনা কাঠামো
185 = প্রশাসনিক পুনর্বিন্যাস ও সংস্কার
186 = স্থানীয় সরকার ব্যবস্থাপনা

টপিক ৯: 190 = বাংলাদেশের জাতীয় অর্জন - ০২ নম্বর
191 = বিশিষ্ট ব্যক্তিত্ব
192 = গুরুত্বপূর্ণ প্রতিষ্ঠানসমূহ
193 = জাতীয় পুরস্কার
194 = বাংলাদেশের খেলাধুলাসহ চলচ্চিত্র
195 = গণমাধ্যম-সংশ্লিষ্ট বিষয়াদি

## 200 = আন্তজার্তিক বিষয়াবলি 	২৫ 
টপিক ১: 210 = বৈশ্বিক ইতিহাস, আঞ্চলিক ও আন্তর্জাতিক ব্যবস্থা, ভূ-রাজনীতি - ০৫ নম্বর
211 = বৈশ্বিক ইতিহাস
212 = আঞ্চলিক ও আন্তর্জাতিক ব্যবস্থা
213 = বৈশ্বিক ভূ-রাজনীতি

টপিক ২: 220 = আন্তর্জাতিক নিরাপত্তা ও আন্তরাষ্ট্রীয় ক্ষমতা সম্পর্ক - ০৫ নম্বর
221 = আন্তর্জাতিক নিরাপত্তা
222 = আন্তরাষ্ট্রীয় ক্ষমতা সম্পর্ক

টপিক ৩: 230 = বিশ্বের সাম্প্রতিক ও চলমান ঘটনাপ্রবাহ - ০৫ নম্বর
231 = বিশ্বের সাম্প্রতিক ও চলমান ঘটনাপ্রবাহ

টপিক ৪: 240 = আন্তর্জাতিক পরিবেশগত ইস্যু ও কূটনীতি - ০৫ নম্বর
241 = আন্তর্জাতিক পরিবেশগত ইস্যু
242 = আন্তর্জাতিক কূটনীতি

টপিক ৫: 250 = আন্তর্জাতিক সংগঠনসমূহ এবং বৈশ্বিক অর্থনৈতিক প্রতিষ্ঠানাদি - ০৫ নম্বর
251 = আন্তর্জাতিক সংগঠনসমূহ
252 = বৈশ্বিক অর্থনৈতিক প্রতিষ্ঠানাদি

 ## 300 = বাংলা ভাষা ও সাহিত্য

টপিক ১: ভাষা - ০৭ নম্বর
310 = ভাষা
311 = প্রয়োগ-অপ্রয়োগ
312 = বানান ও বাক্য শুদ্ধি
313 = পরিভাষা
314 = সমার্থক ও বিপরীতার্থক

টপিক ২: ভাষাতত্ত্ব - ০৮ নম্বর
320 = ভাষাতত্ত্ব
321 = শব্দ
322 = ধ্বনি
323 = বর্ণ
324 = পদ
325 = বাক্য
326 = প্রত্যয়
327 = সন্ধি
328 = সমাস

টপিক ৩: বাংলা ভাষাসাহিত্য (classic & Modern) - ০৫ নম্বর
350 = বাংলা সাহিত্য (classic  & Modern )
351 = বাংলা সাহিত্য প্রাচীন যুগ
352 = বাংলা সাহিত্য মধ্যযুগ
355 = বাংলা সাহিত্য আধুনিক যুগ (১৮০০–বর্তমান পর্যন্ত)

 ## 400 = English Grammer &  Language
=== English Literature ===
401 = English Literature
402 = writers names 
403 = Quotations from drama of different ages
404 = Quotations from poetry of different ages

=== English Language ===

410 = Parts of Speech: The Noun
411 = The Determiner
412 = The Gender
413 = The Number

420 = Parts of Speech: The Pronoun, The Adjective, The Preposition, The Conjunction

## Central Model Test Architecture & Usage Guide

### 1. Data Schema & JSON Format Example

Central model tests currently use local source files. There is no Firestore collection, central-model-tests API route, or admin CRUD screen for this feature.

The listing at `src/data/centralModelTests.js` exports an array named `CENTRAL_MODEL_TESTS`. Each listing object is expected to contain:

```js
{
    examId: 'cmt-001',
    title: 'Exam title',
    scheduledDateTime: '2026-09-04T22:00:00+06:00',
    questions: 70,
    marks: 70,
    description: 'Short description',
    route: '/question-bank/DSS/combinedModelTest',
    status: 'scheduled',
    isCombined: true
}
```

`examId`, `title`, `scheduledDateTime`, `questions`, `marks`, and `route` are the practical minimum fields for a card to render and link correctly. `description` and `status` are currently not rendered by the central-test page. `isCombined` is optional; when true, the item is placed in the “Today's Combined Model Test” section, otherwise it is placed in “Upcoming Model Tests”.

The `route` must resolve to a question-bank JSON file under `data/questionBank/<type>/<exam>.json`. That file must have this shape:

```json
{
    "examInfo": {
        "examName": "১ম সাপ্তাহিক মডেল টেস্ট - ইউনিয়ন সমাজকর্মী",
        "examType": "preliminary",
        "examCategory": "সমাজসেবা",
        "examDate": "2026-09-04",
        "totalMarks": 70,
        "totalQuestions": 70,
        "timeLimitMinutes": 60
    },
    "questions": [
        {
            "id": 1,
            "subject": "বাংলা",
            "topics": "কারক ও বিভক্তি",
            "q": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "ans": 0,
            "explain": "Explanation shown during review",
            "source": ["Source label"]
        }
    ]
}
```

`examInfo.examName`, `examInfo.totalQuestions`, and a non-empty `questions` array are required for the route to render the engine. The engine directly requires each question's `q`, `options`, and numeric zero-based `ans`; `id`, `subject`, `topics`, `explain`, and `source` support identity, subject filtering, and review display. `totalMarks`, `examCategory`, `examDate`, and `timeLimitMinutes` improve the pre-exam screen and timing behavior.

### 2. Data Flow & Component Hierarchy

```text
/central-model-tests
    -> src/app/central-model-tests/page.jsx
         -> imports CENTRAL_MODEL_TESTS from src/data/centralModelTests.js
         -> renders Navbar, Footer, CountdownTimer, and exam cards
         -> links to /question-bank/[type]/[exam]
                -> src/app/question-bank/[type]/[exam]/page.jsx
                     -> GET /api/question-bank/exam?type=<type>&exam=<exam>
                            -> reads data/questionBank/<type>/<exam>.json on the server
                     -> passes examInfo, questions, and calculated timeLimit
                            -> src/components/BCSExamEngine.jsx
```

The central page does not fetch data. It initializes its state from the imported array, separates entries only by `isCombined`, and considers a test available when `new Date(scheduledDateTime) <= new Date()`. The `status` field is not used for filtering. Dates and times are formatted for the `Asia/Dhaka` timezone, while the countdown uses the parsed timestamp.

The question-bank API exposes the complete parsed JSON object. The dynamic page rejects missing/empty data, calculates the time limit with `getTimeLimit`, and then mounts `BCSExamEngine`. The list API at `/api/question-bank/list` is used by the general question-bank page, not by the central model-test landing page.

### 3. Step-by-Step Guide for Adding New Central Model Tests

1. Add or update a JSON file at `data/questionBank/<type>/<exam>.json`.
2. Add `examInfo` with at least `examName` and `totalQuestions`. Set `examType` when the test should use a specific entry in `src/data/questionBankConfig.js`.
3. Add a non-empty `questions` array. Every question needs `q`, `options`, and a zero-based numeric `ans`; validate that `ans` points to an option.
4. Add an object to `CENTRAL_MODEL_TESTS` with unique `examId`, user-facing `title`, ISO `scheduledDateTime` including the Bangladesh offset, numeric `questions` and `marks`, and the exact `/question-bank/<type>/<exam>` route.
5. Set `isCombined: true` only for tests intended for the combined section. Do not rely on `status` to hide a test; the current page ignores it.
6. Verify the route manually or with the question-bank API, then run `npm run lint` and `npm run build` before publishing.

There is currently no supported admin workflow for these changes. The admin dashboard manages other Firestore-backed data such as circulars and job solutions; it neither edits `centralModelTests.js` nor uploads question-bank JSON files. In practice, publishing requires a code/data change, deployment, and a route check. As of this audit, the registry contains active entries for `/question-bank/BCS/bcsPreliminary1` and `/question-bank/ব্যাংক/bankJob1`, but matching JSON files were not present, so those links will fail until the files are added or the entries are corrected.

### 4. Scoring & Engine Integration Overview

`BCSExamEngine` stores selected option indexes in `answers`. On submission, an answer is correct when `Number(selectedOption) === question.ans`; every answered non-matching option counts as wrong and unanswered questions are skipped. The displayed final score is:

```text
finalScore = correctCount - (wrongCount * negativePerWrong)
```

The default question-bank configuration uses `negativePerWrong: 0.5` and a pass threshold of 70 percent. The engine selects configuration by `examInfo.examType`, falling back to the route `type`, then to the BCS defaults. The pre-exam pass mark is `round(totalQuestions * 0.7)`.

Timing uses `examInfo.timeLimitMinutes` when it is a positive value. Otherwise `getTimeLimit` gives tests with 200 or more questions 80 minutes, tests with 100 or more questions 40 minutes, and smaller tests 2 hours. The central listing's `questions` and `marks` values are display metadata; the engine scores the loaded JSON array and uses `examInfo.totalQuestions` for exam metadata, so those values should be kept consistent.

The engine also groups questions by `subject`, supports subject filtering before submission, shows explanations/source data during review, and provides a JPEG result download. A central-test entry therefore does not contain its own question set or scoring logic: it is a scheduled card and route pointer into the reusable question-bank engine.
