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
421 = The Pronoun
422 = The Adjective
423 = The Preposition
424 = The Conjunction

440 = Parts of Speech: The Verb Part-1
441 = The Finite
442 = transitive
443 = intransitive
444 = The Non-finite
445 = participles
446 = infinitives
447 = gerunds

450 = Parts of Speech: The Verb Part-2 & The Adverb
451 = The Linking Verb
452 = The Phrasal Verb
453 = Modals
454 = The Adverb

460 = Idioms & Phrases
461 = Meanings of Phrases
462 = Kinds of Phrases
463 = Identifying Phrases

470 = Clauses
471 = The Principal Clause
472 = The Subordinate Clause
473 = The Noun Clause
474 = The Adjective Clause
475 = The Adverbial Clause & its types

480 = Corrections
481 = The Tense
482 = The Verb
483 = The Preposition
484 = The Determiner
485 = The Gender
486 = The Number
487 = Subject-Verb Agreement

490 = Sentences & Transformations
491 = The Simple Sentence
492 = The Compound Sentence
493 = The Complex Sentence
494 = The Active Voice
495 = The Passive Voice
496 = The Positive Degree
497 = The Comparative Degree
498 = The Superlative Degree

430 = Words
431 = Meanings
432 = Synonyms
433 = Antonyms
434 = Spellings
435 = Usage of words as various parts of speech
436 = Formation of new words by adding prefixes and suffixes
437 = vocabulary 

499 = Composition & Names of parts of paragraphs/letters/applications

## 500 = ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা

510 = ভূগোল
511 = বাংলাদেশ ও অঞ্চলভিত্তিক ভৌগোলিক অবস্থান
512 = সীমানা
513 = পারিবেশিক গুরুত্ব
514 = আর্থ-সামাজিক গুরুত্ব
515 = ভূ-রাজনৈতিক গুরুত্ব

520 = ভৌত পরিবেশ ও ভূ-প্রাকৃতিক সম্পদ
521 = অঞ্চলভিত্তিক ভৌত পরিবেশ (ভূ-প্রাকৃতিক)
522 = সম্পদের বণ্টন ও গুরুত্ব

530 = বাংলাদেশের পরিবেশ
531 = প্রকৃতি ও সম্পদ
532 = প্রধান চ্যালেঞ্জসমূহ

540 = বাংলাদেশ ও বৈশ্বিক পরিবেশ পরিবর্তন
541 = আবহাওয়া ও জলবায়ু নিয়ামকসমূহের সেক্টরভিত্তিক স্থানীয় প্রভাব
542 = আবহাওয়া ও জলবায়ু নিয়ামকসমূহের সেক্টরভিত্তিক আঞ্চলিক প্রভাব
543 = আবহাওয়া ও জলবায়ু নিয়ামকসমূহের সেক্টরভিত্তিক বৈশ্বিক প্রভাব (অভিবাসন, কৃষি, শিল্প, মৎস্য ইত্যাদি)

550 = প্রাকৃতিক দুর্যোগ ও ব্যবস্থাপনা
551 = দুর্যোগের ধরন
552 = দুর্যোগের প্রকৃতি
553 = দুর্যোগ ব্যবস্থাপনা

## 600 = সাধারণ বিজ্ঞান  
600 = সাধারণ বিজ্ঞান

=== 610 & 620 ভৌত বিজ্ঞান (Physics) ===
610 = ভৌত বিজ্ঞান (Physics)
611 = ভৌত রাশি এবং এর পরিমাপ
612 = ভৌত বিজ্ঞানের উন্নয়ন
613 = চৌম্বকত্ব
614 = তরঙ্গ এবং শব্দ
615 = তাপ ও তাপগতি বিদ্যা
616 = আলোর প্রকৃতি
617 = স্থির এবং চল তড়িৎ
618 = ইলেকট্রনিক্স
619 = আধুনিক পদার্থবিজ্ঞান
620 = শক্তির উৎস এবং এর প্রয়োগ
621 = নবায়নযোগ্য শক্তির উৎস
622 = পারমাণবিক শক্তি
623 = শক্তির রূপান্তর
624 = আলোক যন্ত্রপাতি
625 = মৌলিক কণা
626 = তড়িৎ চৌম্বক
627 = ট্রান্সফরমার
628 = এক্সরে
629 = তেজস্ক্রিয়তা

=== 630 & 640 ভৌত বিজ্ঞান (Chemistry) ===
630 = ভৌত বিজ্ঞান (Chemistry)
631 = পদার্থের অবস্থা
632 = এটমের গঠন
633 = কার্বনের বহুমুখী ব্যবহার
634 = এসিড
635 = ক্ষার
636 = লবণ
637 = পদার্থের ক্ষয়
638 = সাবানের কাজ
639 = খনিজ উৎস
640 = ধাতব পদার্থ এবং তাদের যৌগসমূহ
641 = অধাতব পদার্থ
642 = জারণ-বিজারণ
643 = তড়িৎ কোষ
644 = অজৈব যৌগ
645 = জৈব যৌগ

=== 650 & 660 জীববিজ্ঞান ===
650 = জীববিজ্ঞান
651 = জীববিজ্ঞান-বিষয়ক ধর্ম
652 = টিস্যু
653 = জেনেটিকস
654 = জীববৈচিত্র্য
655 = এনিম্যাল ডাইভারসিটি
656 = প্লান্ট ডাইভারসিটি
657 = এনিম্যাল টিস্যু
658 = অর্গান এবং অর্গান সিস্টেম
659 = সালোক সংশ্লেষণ
660 = ভাইরাস
661 = ব্যাকটেরিয়া
662 = জুলোজিক্যাল নমেনক্লেচার
663 = বোটানিক্যাল নমেনক্লেচার
664 = প্রাণিজগৎ
665 = উদ্ভিদ
666 = ফুল
667 = ফল
668 = রক্ত ও রক্ত সঞ্চালন
669 = রক্তচাপ
670 = হৃদপিণ্ড এবং হৃদরোগ
671 = স্নায়ু এবং স্নায়ুরোগ
672 = খাদ্য ও পুষ্টি
673 = ভিটামিন
674 = মাইক্রোবায়োলজি
675 = প্লান্ট নিউট্রেশন
676 = পরাগায়ন ইত্যাদি

=== 680&690 আধুনিক বিজ্ঞান ও অন্যান্য ===
680 = আধুনিক বিজ্ঞান ও অন্যান্য
681 = পৃথিবী সৃষ্টির ইতিহাস
682 = কসমিক রে
683 = ব্লাক হোল
684 = হিগের কণা
685 = বারিমণ্ডল
686 = টাইড
687 = বায়ুমণ্ডল
688 = টেকটোনিক প্লেট
689 = সাইক্লোন
690 = সুনামি
691 = বিবর্তন
692 = সামুদ্রিক জীবন
693 = মানবদেহ
694 = রোগের কারণ ও প্রতিকার
695 = সংক্রামক রোগ
696 = রোগ জীবাণুর জীবনধারণ
697 = মা ও শিশু স্বাস্থ্য
698 = ইম্যুনাইজেশন এবং ভ্যাকসিনেশন
699 = এইচআইভি
601 = এইডস
602 = টিবি
603 = পোলিও
604 = জোয়ার-ভাটা
605 = এপিকালচার
606 = সেরিকালচার
607 = পিসিকালচার
608 = হটিকালচার
609 = ডায়োড
691 = ট্রানজিস্টর
692 = আইসি
693 = আপেক্ষিক তত্তা
694 = ফোটন কণা ইত্যাদি

## 700 = কম্পিউটার ও তথ্য প্রযুক্তি 10 marks 

======= কম্পিউটার Theory 711 to 759 ======== 5 marks

710 = কম্পিউটার পেরিফেরালস (Computer Peripherals)
711 = কি-বোর্ড (Keyboard)
712 = মাউস (Mouse)
713 = ওসিআর (OCR) ইত্যাদি

720 = কম্পিউটারের অঙ্গসংগঠন (Computer Architecture)
721 = সিপিইউ (CPU)
722 = হার্ড ডিস্ক (Hard Disk)
723 = এএলইউ (ALU)
724 = কম্পিউটারের Performance

730 = দৈনন্দিন জীবনে কম্পিউটার (Computer in Practical Fields)
731 = কৃষি
732 = যোগাযোগ
733 = শিক্ষা
734 = স্বাস্থ্য
735 = খেলাধুলা ইত্যাদি

740 = Systems of Computer
741 = কম্পিউটারের নম্বর ব্যবস্থা
742 = অপারেটিং সিস্টেমস (Operating Systems)
743 = এমবেডেড কম্পিউটার (Embedded Computer)
744 = ভাইরাস (VIRUS)
745 = ফায়ারওয়াল (Firewall) ইত্যাদি
746 = কম্পিউটারের ইতিহাস (History of Computer)
747 = কম্পিউটারের প্রকারভেদ (Types of Computers)

750 = কম্পিউটার প্রোগ্রাম
751 = Computer Program
752 = ডেটাবেইস সিস্টেম (Database System)

=========== তথ্য প্রযুক্তি 761 to 799 ===All Done====== 5 marks 

======= কম্পিউটার Theory 711 to 759 ======== 5 marks
701 = কম্পিউটার রক্ষণাবেক্ষণ, Virus, Cyber Security, firewall, software, Operating System ect.
 
704 = কম্পিউটারের ইতিহাস, প্রকারভেদ, প্রজন্ম  

705 = কম্পিউটার নেটওয়ার্ক & Data communications 

706 = Machine Code (ASCII, BCD, Unicode ..oth)
710 = কম্পিউটার পেরিফেরালস (Computer Peripherals, কি-বোর্ড, মাউস, OCR )
711 = কি-বোর্ড (Keyboard)
712 = মাউস (Mouse)
713 = ওসিআর (OCR) ইত্যাদি

720 = কম্পিউটারের অঙ্গসংগঠন (CPU, Hard Disk, ALU, RAM, ROM)
721 = সিপিইউ (CPU)
722 = হার্ড ডিস্ক (Hard Disk)
723 = এএলইউ (ALU)
724 = কম্পিউটারের Performance

730 = দৈনন্দিন জীবনে কম্পিউটার (কৃষি, যোগাযোগ, শিক্ষা, স্বাস্থ্য, খেলাধুলা ইত্যাদি)
731 = কৃষি
732 = যোগাযোগ
733 = শিক্ষা
734 = স্বাস্থ্য
735 = খেলাধুলা ইত্যাদি

740 = Computer Number System (বাইনারি, অক্টাল, হেক্সা ডেসিমল ও রুপান্তর)
741 = কম্পিউটারের নম্বর ব্যবস্থা
742 = অপারেটিং সিস্টেমস (Operating Systems)
743 = এমবেডেড কম্পিউটার (Embedded Computer)
744 = ভাইরাস (VIRUS)
745 = ফায়ারওয়াল (Firewall) ইত্যাদি

750=  ডেটাবেইস সিস্টেম (Database Management System)


## 800 = গাণিতিক যুক্তি  20 marks 
800 = গাণিতিক যুক্তি

810 = প্রাথমিক গনিত
811 = বাস্তব সংখ্যা
812 = ল.সা.গু
813 = গ.সা.গু
814 = শতকরা
815 = সরল মুনাফা
816 = যৌগিক মুনাফা
817 = অনুপাত ও সমানুপাত
818 = লাভ ও ক্ষতি

820 = বীজগাণিতি
821 = বীজগাণিতিক সূত্রাবলি
822 = বহুপদী উৎপাদক
823 = সরল সমীকরণ
824 = দ্বিপদী সমীকরণ
825 = সরল অসমতা
826 = দ্বিপদী অসমতা
827 = সরল সহসমীকরণ

830 = ক্যালকুলাস 
831 = সূচক
832 = লগারিদম
833 = সমান্তর অনুক্রম
834 = সমান্তর ধারা
835 = গুণোত্তর অনুক্রম
836 = গুণোত্তর ধারা

840 = জ্যামিতি - উপপাদ্য
841 = রেখা সংক্রান্ত উপপাদ্য
842 = কোণ সংক্রান্ত উপপাদ্য
843 = ত্রিভুজ সংক্রান্ত উপপাদ্য
844 = চতুর্ভুজ সংক্রান্ত উপপাদ্য
845 = পিথাগোরাসের উপপাদ্য
846 = বৃত্ত সংক্রান্ত উপপাদ্য

850 = পরিমিতি
851 = সরলক্ষেত্রের পরিমিতি
852 = ঘনবস্তুর পরিমিতি

860 = পরিসংখ্যান ও সম্ভাব্যতা
861 = সেট
862 = বিন্যাস
863 = সমাবেশ
864 = পরিসংখ্যান
865 = সম্ভাব্যতা

## 890 = মানসিক দক্ষতা 15 marks 
891 = ভাষাগত যৌক্তিক বিচার (Verbal Reasoning)
892 = সমস্যা সমাধান (Problem Solving)
893 = বানান ও ভাষা (Spelling and Language)
894 = যান্ত্রিক দক্ষতা (Mechanical Reasoning)
895 = স্থানাঙ্ক সম্পর্ক (Space Relation)
896 = সংখ্যাগত ক্ষমতা (Numerical Ability)

## 900 = নৈতিকতা, মূল্যবোধ ও সু-শাসন 15 marks 

910 = Definition of Values and Good Governance (মূল্যবোধ ও সু-শাসনের সংজ্ঞা)
911 = Definition of Values (মূল্যবোধের সংজ্ঞা)
912 = Definition of Good Governance (সু-শাসনের সংজ্ঞা)

920 = Relation between Values and Good Governance (মূল্যবোধ ও সু-শাসনের সম্পর্ক)
921 = Relation between Values and Good Governance (মূল্যবোধ ও সু-শাসনের সম্পর্ক)

930 = General Perception of Values and Good Governance (মূল্যবোধ ও সু-শাসন সম্পর্কে সাধারণ ধারণা)
931 = General Perception of Values (মূল্যবোধ সম্পর্কে সাধারণ ধারণা)
932 = General Perception of Good Governance (সু-শাসন সম্পর্কে সাধারণ ধারণা)

940 = Importance of Values and Good Governance in the life of an individual as a citizen (নাগরিক হিসেবে ব্যক্তিজীবনে মূল্যবোধ ও সু-শাসনের গুরুত্ব)
941 = Importance of Values in the life of an individual as a citizen (নাগরিক হিসেবে ব্যক্তিজীবনে মূল্যবোধের গুরুত্ব)
942 = Importance of Good Governance in the life of an individual as a citizen (নাগরিক হিসেবে ব্যক্তিজীবনে সু-শাসনের গুরুত্ব)

950 = Importance of Values and Good Governance in the making of society and national ideals (সমাজ ও জাতীয় আদর্শ গঠনে মূল্যবোধ ও সু-শাসনের গুরুত্ব)
951 = Importance of Values in the making of society (সমাজ গঠনে মূল্যবোধের গুরুত্ব)
952 = Importance of Good Governance in the making of society (সমাজ গঠনে সু-শাসনের গুরুত্ব)
953 = Importance of Values in national ideals (জাতীয় আদর্শে মূল্যবোধের গুরুত্ব)
954 = Importance of Good Governance in national ideals (জাতীয় আদর্শে সু-শাসনের গুরুত্ব)

960 = Impact of Values and Good Governance in National Development (জাতীয় উন্নয়নে মূল্যবোধ ও সু-শাসনের প্রভাব)
961 = Impact of Values in National Development (জাতীয় উন্নয়নে মূল্যবোধের প্রভাব)
962 = Impact of Good Governance in National Development (জাতীয় উন্নয়নে সু-শাসনের প্রভাব)

970 = How the elements of Good Governance and Values can be established in society in a given social context (প্রদত্ত সামাজিক প্রেক্ষাপটে সমাজে সু-শাসন ও মূল্যবোধের উপাদানসমূহ কীভাবে প্রতিষ্ঠা করা যায়)
971 = Elements of Good Governance (সু-শাসনের উপাদানসমূহ)
972 = Elements of Values (মূল্যবোধের উপাদানসমূহ)
973 = Establishment of Good Governance in society (সমাজে সু-শাসন প্রতিষ্ঠা)
974 = Establishment of Values in society (সমাজে মূল্যবোধ প্রতিষ্ঠা)

980 = The benefit of Values and Good Governance (মূল্যবোধ ও সু-শাসনের সুবিধা)
981 = Benefit of Values (মূল্যবোধের সুবিধা)
982 = Benefit of Good Governance (সু-শাসনের সুবিধা)

990 = The cost society pays adversely in their absence (এদের অনুপস্থিতিতে সমাজ যে বিরূপ মূল্য দেয়)
991 = Cost of absence of Values (মূল্যবোধের অনুপস্থিতির ক্ষতি)
992 = Cost of absence of Good Governance (সু-শাসনের অনুপস্থিতির ক্ষতি)