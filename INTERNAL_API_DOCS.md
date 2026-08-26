# BCSpark Internal API — Optimization Documentation

> **Status:** ✅ Implemented for all combined `/t20/{subject}/all` pages (August 2026)
> **Created:** August 2026
> **Purpose:** Internal API design that keeps combined quiz JSON on the server. Client pages fetch ~10-15 KB of questions from `/api/quiz/{subject}/all` instead of bundling megabytes of JSON. Config lives in `src/data/quizSources/`, the shared engine in `src/lib/quizSourceServer.js`.

---

## 1. Why This Documentation Exists

### The Problem (Measured)

The combined "All Topics" quiz pages (e.g., `/t20/gk/all`) import **all** topic JSON files via static ES module imports:

```js
// src/app/t20/gk/all/page.jsx (current approach)
import jatiyoBisoyaboli from '../../../../../data/t20/GK/jatiyaBisoyboli/jatiyoBisoyaboli.json';
import krishijSompod from '../../../../../data/t20/GK/krisijSompod/krishij_sompod.json';
// ... 17 total imports
```

Because these are `'use client'` components, **the entire content of every imported JSON is bundled into the JavaScript sent to the browser** — even though only 20 questions are shown.

### Measured Data (GK Subject — as of August 2026)

| Metric | Value |
|--------|-------|
| Total JSON size bundled by `/t20/gk/all` | **2.99 MB** |
| Largest single file | `muktijhdhdo1971.json` (476 KB) |
| Smallest file | `prothom_mohilaBD.json` (40 KB) |
| Number of JSON files imported | 14 |
| Questions shown to user | 20 (~10 KB worth) |
| **Wasted bandwidth per page load** | **~2.98 MB** |

### When to Implement

| Trigger | Action |
|---------|--------|
| Concurrent traffic < 1K | ❌ Keep current static system — it works fine |
| Concurrent traffic 1K–5K | ⚠️ Consider implementing for combined pages only |
| Concurrent traffic > 5K | ✅ Implement API route for all combined "All Topics" pages |
| Any single subject's JSON total > 1 MB | ✅ Implement for that subject |
| Adding custom question count feature | ✅ Implement (API supports `?total=N` query param) |

---

## 2. Architecture Overview

### Current System (Static Import)

```
Build Time                          Runtime (Browser)
┌─────────────────┐                ┌──────────────────────┐
│ Next.js Build    │                │  User's Browser      │
│                 │                │                      │
│ Bundles ALL     │ ──────────────►│  Receives 3 MB JS    │
│ 17 JSON files   │  3 MB JS file  │  Picks 20 random     │
│ into client JS  │                │  Shows 20 questions  │
└─────────────────┘                └──────────────────────┘
```

**Pros:** Zero server cost, CDN-cacheable, scales infinitely
**Cons:** 3 MB download for 20 questions

### Future System (Internal API Route)

```
Browser (Client)                        Server (API Route)
┌──────────────────────┐               ┌────────────────────────────┐
│ /t20/gk/all/page.jsx │               │ /api/quiz/gk/all/route.js  │
│                      │  GET request  │                            │
│  fetch('/api/...')   │ ─────────────►│  Reads config              │
│                      │               │  Imports all JSONs         │
│  Receives 20 Qs      │ ◄─────────────│  (server-side only)        │
│  (~10 KB)            │  JSON: 20 Qs  │  Randomly picks 20         │
│  QuickPracticeEngine │               │  Returns 20 questions      │
└──────────────────────┘               └────────────────────────────┘
```

**Pros:** Only 10 KB sent to browser, supports custom counts, config-driven
**Cons:** Server processes each request (small cost), less CDN-cacheable

---

## 3. What Is an Internal API?

An **internal API** (also called **first-party API**) is when your own frontend calls your own backend — both living in the same Next.js project.

| Type | Example | Who Calls Whom |
|------|---------|----------------|
| **Internal / First-party** | `fetch('/api/quiz/gk/all')` | Your frontend → Your backend |
| **External / Third-party** | `fetch('https://maps.google.com/api')` | Your app → Google's servers |

Both use the same HTTP + JSON technique. The only difference is *who is calling whom*.

### Key Point for Next.js

Notice the URL has **no domain** — just `/api/...`. This means:
- The browser requests it from **the same server** that served the page
- It's not a cross-domain external call
- It's just "my frontend talking to my backend, over HTTP, within the same Next.js app"

---

## 4. API Endpoint Specification

### Endpoint: `GET /api/quiz/gk/all`

Returns a random selection of questions from all GK Bangladesh topics.

#### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `total` | number | 20 | Total questions to return |
| `topic1` | number | 4 | Quota from জাতীয় বিষয়াবলী |
| `topic2` | number | 2 | Quota from কৃষিজ সম্পদ |
| `topic3` | number | 2 | Quota from জনশুমারি |
| `topic4` | number | 2 | Quota from বাংলাদেশের অর্থনীতি |
| `topic5` | number | 2 | Quota from শিল্প ও বাণিজ্য |
| `topic6` | number | 2 | Quota from বাংলাদেশের সংবিধান |
| `topic7` | number | 2 | Quota from রাজনৈতিক ও সরকার ব্যবস্থা |
| `topic8` | number | 1 | Quota from জাতীয় অর্জন |
| `topic9` | number | 1 | Quota from গুরুত্বপূর্ণ প্রতিষ্ঠানসমূহ |
| `topic10` | number | 1 | Quota from খেলাধুলা ও চলচ্চিত্র |
| `topic11` | number | 1 | Quota from গণমাধ্যম ও প্রযুক্তি |

#### Example Requests

```
# Default: 20 questions with default distribution
GET /api/quiz/gk/all

# Custom total: 30 questions (scales quotas proportionally)
GET /api/quiz/gk/all?total=30

# Custom per-topic quotas
GET /api/quiz/gk/all?total=20&topic1=5&topic2=3&topic3=3&topic4=3&topic5=2&topic6=2&topic7=2
```

#### Response Format

```json
{
  "questions": [
    {
      "id": 1,
      "topicsId": 120,
      "q": "নিম্নোক্ত কোন সালে কৃষিশুমারী অনুষ্ঠিত হয়নি ?",
      "options": ["১৯৭৭", "২০০৮", "২০১৫", "২০১৯"],
      "ans": 2,
      "explain": "বাংলাদেশে এ পর্যন্ত মোট ৬ বার...",
      "source": ["৪৩তম বিসিএস"]
    }
  ],
  "total": 20,
  "subject": "GK - বাংলাদেশ বিষয়াবলী"
}
```

---

## 5. Config-Driven Design

### File: `src/data/quizSources/gkBangladesh.js`

```js
// Central config for GK Bangladesh quiz sources
// Adding a new topic = add one entry here, everything else is automatic

export const gkBangladeshAllSources = {
  subject: "GK - বাংলাদেশ বিষয়াবলী",
  defaultTotal: 20,
  topics: [
    {
      name: "jatiyaBisoyboli",
      label: "জাতীয় বিষয়াবলী",
      folder: "jatiyaBisoyboli",
      files: [
        { file: "jatiyoBisoyaboli.json", quota: 1 },
        { file: "kistiSongskriti.json", quota: 1 },
        { file: "muktijhdhdo1971.json", quota: 1 },
        { file: "vashaAnddolon.json", quota: 1 }
      ]
    },
    {
      name: "krisijSompod",
      label: "কৃষিজ সম্পদ",
      folder: "krisijSompod",
      files: [
        { file: "krishij_sompod.json", quota: 2 }
      ]
    },
    {
      name: "jonosumari",
      label: "জনশুমারি",
      folder: "jonosumari",
      files: [
        { file: "jonosumari.json", quota: 2 }
      ]
    },
    {
      name: "orthoniti",
      label: "বাংলাদেশের অর্থনীতি",
      folder: "orthoniti",
      files: [
        { file: "orthonitibd.json", quota: 2 }
      ]
    },
    {
      name: "shilpoBanijjo",
      label: "শিল্প ও বাণিজ্য",
      folder: "shilpoBanijjo",
      files: [
        { file: "shilpo_banijjo.json", quota: 2 }
      ]
    },
    {
      name: "bangladesherSongbidhan",
      label: "বাংলাদেশের সংবিধান",
      folder: "bangladesherSongbidhan",
      files: [
        { file: "bangladeher_songbidhan.json", quota: 2 }
      ]
    },
    {
      name: "rajnoitikOsorkarBabostha",
      label: "রাজনৈতিক ও সরকার ব্যবস্থা",
      folder: "rajnoitikOsorkarBabostha",
      files: [
        { file: "rajnoitikSorkar_babostha.json", quota: 2 }
      ]
    },
    {
      name: "jatiyoOrjon",
      label: "জাতীয় অর্জন",
      folder: "jatiyoOrjon",
      files: [
        { file: "jatiyoOrjonBD.json", quota: 1 }
      ]
    },
    {
      name: "prothisthanSomuho",
      label: "গুরুত্বপূর্ণ প্রতিষ্ঠানসমূহ",
      folder: "prothisthanSomuho",
      files: [
        { file: "protisthan_somuho.json", quota: 1 }
      ]
    },
    {
      name: "kheladhulaCholochitra",
      label: "খেলাধুলা ও চলচ্চিত্র",
      folder: "kheladhulaCholochitra",
      files: [
        { file: "kheladhula_colochitra.json", quota: 1 }
      ]
    },
    {
      name: "gonomadhomProjukti",
      label: "গণমাধ্যম ও প্রযুক্তি",
      folder: "gonomadhomProjukti",
      files: [
        { file: "gonomadhom_projukti.json", quota: 1 }
      ]
    }
  ]
};
```

### Why Config-Driven?

| Scenario | Without Config | With Config |
|----------|---------------|-------------|
| Add new topic JSON | Edit page.jsx: add import + quota + array | Add 1 line to config file |
| Change question distribution | Edit page.jsx: change numbers | Change numbers in config |
| Add custom question count feature | Rewrite page logic | API reads `?total=N` from config |

---

## 6. Next.js 16 Route Handler Conventions

> **Verified against `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`**

This project uses **Next.js 16.2.10** with Turbopack. The API route conventions are:

### File Location
```
src/app/api/quiz/gk/all/route.js
```

### Basic Structure

```js
// src/app/api/quiz/gk/all/route.js

import { NextRequest } from 'next/server';

// Server-side JSON imports (NOT bundled into client)
import jatiyoBisoyaboli from '../../../../../data/t20/GK/jatiyaBisoyboli/jatiyoBisoyaboli.json';
import krishijSompod from '../../../../../data/t20/GK/krisijSompod/krishij_sompod.json';
// ... all other imports

export async function GET(request) {
  const url = request.nextUrl;
  const total = Number(url.searchParams.get('total') || 20);

  // Random selection logic here
  const questions = pickRandomQuestions(total);

  return Response.json({
    questions,
    total: questions.length,
    subject: "GK - বাংলাদেশ বিষয়াবলী"
  });
}
```

### Key Points (Next.js 16 Specific)

1. **`params` is a Promise** — must be awaited:
   ```js
   export async function GET(request, { params }) {
     const { subject } = await params;  // ✅ await required in Next.js 16
   }
   ```

2. **Use `Response.json()`** — not `NextResponse.json()` (both work, but `Response.json()` is the Web standard)

3. **`request.nextUrl`** — gives parsed URL with `searchParams` access

4. **Route segment config** — can set caching behavior:
   ```js
   export const dynamic = 'force-dynamic';  // always fresh random
   export const revalidate = 0;  // never cache (for random questions)
   ```

---

## 7. Step-by-Step Migration Guide

### For Each Combined "All Topics" Page

#### Step 1: Create the config file
```
src/data/quizSources/{subjectName}.js
```
List all topic folders, files, and default quotas.

#### Step 2: Create the API route
```
src/app/api/quiz/{subjectName}/all/route.js
```
- Import all JSONs server-side
- Import the config file
- Implement `GET(request)` handler
- Read query params for custom counts
- Pick random questions per quota
- Return `Response.json()`

#### Step 3: Rewrite the client page
```
src/app/t20/{subjectPath}/all/page.jsx
```
- Remove all static JSON imports
- Add `fetch('/api/quiz/{subjectName}/all')` in `useEffect`
- Show loading state while fetching
- Pass fetched questions to `QuickPracticeEngine`

#### Step 4: Test
- Visit the page — should show 20 random questions
- Check browser Network tab — API response should be ~10-15 KB
- Verify different questions on each page load

#### Step 5: Build verification
```bash
npm run build
```
- The combined page should change from `○ (Static)` to `ƒ (Dynamic)`
- Individual topic pages should remain `○ (Static)`

---

## 8. Pages That Need Migration (When Ready)

### High Priority (Large Bundles)

| Page | Current Bundle Size | Status |
|------|-------------------|--------|
| `/t20/gk/all` | ~3 MB | ⚠️ Highest priority |
| `/t20/sadharon-biggan/all` | Needs measurement | ⚠️ Measure first |
| `/t20/gk-international/all` | Needs measurement | ⚠️ Measure first |

### Low Priority (Small Bundles — Keep Static)

| Page | Bundle Size | Status |
|------|------------|--------|
| Individual topic pages (e.g., `/t20/gk/jonosumari`) | ~100 KB each | ✅ Keep static |
| `/t20/vugol-poribesh-dm/all` | Small | ✅ Keep static for now |

### How to Measure

```bash
# Measure any subject's total JSON size
python -c "import os; files=[...]; total=sum(os.path.getsize(f) for f in files); print(f'{total/1024/1024:.2f} MB')"
```

---

## 9. Scaling Notes

### Phase 1: Current (0–1K traffic)
- ✅ All static pages — zero server cost
- ✅ CDN serves everything — scales infinitely
- ✅ No database needed
- ✅ User results in `localStorage` / `sessionStorage`

### Phase 2: Internal API (1K–5K traffic)
- Convert combined "All Topics" pages to API routes
- Add simple in-memory caching (cache random selection for 5–10 seconds)
- Keep individual topic pages static
- Still no database

### Phase 3: Edge Functions (5K–10K traffic)
- Move API routes to Edge runtime (runs at CDN edge, near users)
- Add `export const runtime = 'edge'` to route files
- Reduces server load dramatically
- Still no database

### Phase 4: Database (when needed)
Add a database ONLY when you need:
- User accounts / login
- Leaderboards / cross-user rankings
- Progress saved across devices
- Admin dashboard with user data

**Until then — static + JSON + localStorage is enough.**

---

## 10. Current System Summary (As of August 2026)

### Subjects Live

| Subject | Routes | Combined "All" Page | Notes |
|---------|--------|---------------------|-------|
| English | 7 | ❌ No combined page | Individual topics only |
| GK - বাংলাদেশ বিষয়াবলী | 13 | ✅ `/t20/gk/all` | 3 MB bundle — migrate first |
| GK - আন্তর্জাতিক | 6 | ✅ `/t20/gk-international/all` | Measure bundle size |
| Bangla | 7 | ✅ `/t20/bangla/all` | Small bundle |
| ICT | 10 | ✅ `/t20/ict/all` | Small bundle |
| সাধারণ বিজ্ঞান | 4 | ✅ `/t20/sadharon-biggan/all` | Measure bundle size |
| ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা | 4 | ✅ `/t20/vugol-poribesh-dm/all` | Small bundle |
| নৈতিকতা, মূল্যবোধ ও সুশাসন | 4 | ✅ `/t20/noitikota-mullobodh-sushahon/all` | Small bundle |

### What Stays Static (No Migration Needed)
- All individual topic quiz pages (each imports 1–6 small JSON files)
- All non-quiz pages (home, history, vocabulary, etc.)

### What Migrates to API (When Triggered)
- Only combined "All Topics" pages with large bundles
- Start with `/t20/gk/all` (3 MB)
- Measure others and migrate if > 1 MB

---

## 11. Quick Reference: Internal API vs Static Import

| Aspect | Static Import (Current) | Internal API (Future) |
|--------|------------------------|----------------------|
| Bundle size | All JSON sent to browser | Only N questions sent |
| Server cost | Zero | Small per-request CPU |
| CDN caching | Excellent (static files) | Limited (dynamic response) |
| Randomness | Fresh per page load | Fresh per API request |
| Custom counts | Not supported | `?total=N` query param |
| Adding topics | Edit page.jsx manually | Add 1 line to config |
| Traffic scaling | Infinite (static) | Needs server resources |
| Best for | Small data, low traffic | Large data, high traffic |

---

## 12. Implementation Checklist (When Ready)

```
[ ] Measure bundle size for all combined pages
[ ] Create src/data/quizSources/ directory
[ ] Create config file for GK Bangladesh
[ ] Create src/app/api/quiz/gk/all/route.js
[ ] Rewrite src/app/t20/gk/all/page.jsx to use fetch()
[ ] Test: questions load, random each visit
[ ] Test: browser Network tab shows ~10 KB response
[ ] Build verification: npm run build
[ ] Repeat for other large combined pages
[ ] Add caching if traffic > 5K
[ ] Move to Edge runtime if traffic > 10K
```

---

**Document maintained by:** BCSpark Development
**Last updated:** August 2026
**Next review:** When traffic approaches 1K concurrent users