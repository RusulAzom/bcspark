# T20 Quiz — Topic-level % quotas, server-side composition (stop shipping full JSON)

## Problem
Every `src/app/t20/**/page.jsx` statically `import`s full JSON datasets at build time → bundled into JS → shipped to the browser → renders only 20 via `getRandomItems(...).slice(0,20)`.

Measured waste:
- `gk/all/page.jsx` imports 11 files totaling ~**3.1 MB**, renders 20 of ~300 questions.
- `gk/shilpo-banijjo/page.jsx` imports 1 file of **122 KB** for 20 questions.

Broken/phantom routes: `practiceRoutes.js` marks `bakkototto-oproyog` and `bakaronic-upadan` as `active: true`, but **no `page.jsx` exists** and data lives under different folders (`data/t20/banglaBakaron/...`).

## Goal
Per quiz load, transfer only the ~20 rendered questions (target ≈ 6–8 KB JSON), never the full source JSON. Quotas are **% per topic (sub-item)**, not per microtopic file, per the agreed guideline. Allocation must total exactly `questionLimit` (20).

## Decision (agreed)
- Selection moves to the **server** via an API route (reuses the `/api/history/today` pattern).
- A topic's `share` is its % of the subject's 20-question quiz.
- **"all" quiz = LRM across the subject's sibling topics by `share`**; each topic then pools its `files` and supplies its quota via uniform random sampling.
- **No microtopic-level percentages** — adding a file under an existing topic's pool does not change any quota.

Rejected: per-page dynamic `import()` (still ships the full page dataset); RSC data (equivalent to an API route, more churn).

## Data flow (after)
```
/t20/<subject>/<topic> page (thin) -> T20QuizPage client shim
  -> fetch('/api/t20/questions?key=<subject>:<topic>') on mount
       -> API: resolve topic; if "all", LRM across sibling topics by share;
            else use topic's own targetN; draw quota from each topic's pooled files
       -> { questions:[20], config }
  -> <QuickPracticeEngine questions config />
```

## Data model (refined, topic-level)
`practiceRoutes.js` topics gain `share` (%) and a source specifier; "all" topics have no `share` (they compose siblings):
```js
gk: {
  label:"👉 GK - বাংলাদেশ বিষয়াবলী",
  defaultQuestionLimit: 20,
  topics: {
    all:   { label:"GK > All", route:"/t20/gk/all",   active:true, config:{...} },            // composer
    shilpoBanijjo: { label:"শিল্প ও বাণিজ্য", active:true, share:20,
                     folder:"GK/shilpoBanijjo", config:{...} },            // auto-pool *.json in folder
    ict701: { label:"...", active:true, share:7, files:[{file:"ict/ict701.json"}], config:{...} }, // explicit list (non-folder)
  }
}
```
A topic's source is **`folder`** (API globs `data/t20/<folder>/*.json`) **or** **`files`** (explicit list). `folder` is the default for subjects organized into per-topic subfolders; `files` is used where layout is flat/ scattered (e.g. ICT's exam-code files). `share` optional — omitted ⇒ equal share.

## Allocation algorithm (Largest Remainder, topic-level, no capacity branch)
`allocate(sources[{topic, share, data}], targetN)` where each `data` is a topic's **pooled** files (via `poolFiles`):
1. `totalShare=sum(share)`; `quota_i=(share_i/totalShare)*targetN`.
2. `base_i=floor(quota_i)`; `rem_i=quota_i-base_i`; `leftover=targetN-sum(base)`.
3. Rank by `rem` desc, then **index asc** (deterministic; no RNG in counts).
4. Give `+1` to the top `leftover` sources (assert `base_i+1 <= data.length`, true here — smallest draw is 1, every file has ≥41 rows).
5. Draw `getRandomItems(data_i, base_i)` from each topic's pooled `files`; concat; final shuffle.
**Invariant:** `sum(base) == targetN` whenever `sum(topic capacities) >= targetN`.

### Worked example — `gk/all` (illustrative shares; shilpo=20, songbidhan=15 per your guidance)
| Topic | share% | quota | allocated |
|---|---|---|---|
| jatiyaBisoyboli | 20 | 4.0 | 4 |
| krisijSompod | 10 | 2.0 | 2 |
| jonosumari | 8 | 1.6 | 1 (+0.6 rem) |
| orthoniti | 5 | 1.0 | 1 |
| shilpoBanijjo | 20 | 4.0 | 4 |
| bangladesherSongbidhan | 15 | 3.0 | 3 |
| rajnoitikOsorkarBabostha | 8 | 1.6 | 1 (+0.6 rem) |
| jatiyoOrjon | 5 | 1.0 | 1 |
| prothisthanSomuho | 4 | 0.8 | 0 (+0.8 rem) |
| kheladhulaCholochitra | 3 | 0.6 | 0 (+0.6 rem) |
| gonomadhomProjukti | 2 | 0.4 | 0 (+0.4 rem) |

`base` sums to 17; `leftover=3`. Top remainders: prothisthan(0.8)→+1, jonosumari(0.6,idx<rajnoitik)→+1, rajnoitik(0.6)→+1 → **total = 20**. No seat lost, no rounding drift. (Shares here are illustrative except the two you specified — confirm final GK shares.)

Edge case your question raised: a 7%-style share of 20 → quota 1.4 → base 1, rem 0.4 → competes in the remainder pass; never stranded.

## Alignment & extensibility (resolved by your update)
The `%`-at-topic model applies **uniformly to all subjects**, including the new Bangla/English structure:
- **Bangla** = two subjects on the already-laid-out (currently unused) new data folders:
  - `data/t20/banglaBakaron/` → **Bangla Bacaron** topics: `bakaronicUpadan`, `bakkotottoOproyog`, `shobdarthoObidhito`, `shobdoOruptotto`, `vashaOdhonniBiggan`.
  - `data/t20/bangla Sahitto/` → **Bangla Sahitto** topics: `shahittorDharaObidhito`, `chorjapodPrachinOmodhojug`, `adhunikJugerSuchona`, `19thSahittik`.
  - Current broken pages (`bangla/bacaron/*`, `bangla/shahitto/*`) and orphaned `data/t20/bangla/` → **removed**; phantom topics become real under the new folders.
- **English** = **English Grammar** (pools `data/t20/english/grammar/*`) + **English Literature** (`data/t20/english/literature/literature.json`), each + per-subfolder topics + an `all` composer.
- Topic ↔ file mapping is now uniform everywhere; no ad-hoc exceptions.

**Share values are a content/policy input, not technical.** Default when `share` is omitted: **equal shares** (`100/N`%) across composing topics. Algorithm/LRM/API are independent of specific values; real % (your GK example: shilpoBanijjo 20%, songbidhan 15%) are data-only edits in `practiceRoutes.js`.
- **New microtopic JSON** → append to a topic's `files`; no `%`/rebalancing change; auto-pooled.
- **New topic/sub-item** → add a topic block with `share` to `practiceRoutes.js`; auto-participates in its subject's "all" (LRM) + appears in `QuickPracticeSetup` dropdowns. Reuses `T20QuizPage`.
- **New subject group** → add subject + topics + `share` + an `all` composer topic.
- Dead aggregates (`gkAll.json`, `AtoZbd1.json`, `ictAll.json`, `banglaAll.json`) and the orphan `a2z` route are not topics → naturally excluded.

No blocking question remains — finalizing.

## Activation example: Bangla Shahitto (বাংলা সাহিত্য) — your spec, wired up
Subject id `banglaSahitto`, route prefix `/t20/bangla-sahitto/`. 4 topics (30/20/20/30) + 1 `all` = **5 quizzes**. Each topic auto-pools all `*.json` in its folder; standalone topic quiz draws 20 from its pool; `all` draws 20 via LRM across the 4 shares.

```js
// practiceRoutes.js
BanglaSahitto: {
  label:"👉 বাংলা সাহিত্য",
  defaultQuestionLimit: 20,
  topics: {
    all: { label:"সাহিত্য (All)", route:"/t20/bangla-sahitto/all", active:true,
           config:{ title:"Bangla Sahitto (All)", category:"Bangla", subject:"বাংলা সাহিত্য (All)", passMark:50, questionLimit:20, timeLimit:120, timerDisplay:"t20", negativeMarking:0.5, step:"06" } },
    chorjapod: { label:"চর্যাপদ, প্রাচীন ও মধ্যযুগ", share:30, active:true,
                 route:"/t20/bangla-sahitto/chorjapod", folder:"bangla Sahitto/chorjapodPrachinOmodhojug",
                 config:{ title:"চর্যাপদ, প্রাচীন ও মধ্যযুগ", category:"Bangla", subject:"চর্যাপদ, প্রাচীন ও মধ্যযুগ", passMark:50, questionLimit:20, timeLimit:120, timerDisplay:"t20", negativeMarking:0.5, step:"01" } },
    adhunik: { label:"গদ্য, ফোর্ট উইলিয়াম, সাহিত্য সমাজ ও একাডেমি, রাজা ও বিদ্যাসাগর – আধুনিক যুগের সূচনা", share:20, active:true,
               route:"/t20/bangla-sahitto/adhunik", folder:"bangla Sahitto/adhunikJugerSuchona",
               config:{ title:"আধুনিক যুগের সূচনা", category:"Bangla", subject:"গদ্য, ফোর্ট উইলিয়াম, সাহিত্য সমাজ ও একাডেমি, রাজা ও বিদ্যাসাগর – আধুনিক যুগের সূচনা", passMark:50, questionLimit:20, timeLimit:120, timerDisplay:"t20", negativeMarking:0.5, step:"02" } },
    nineteenth: { label:"রবীন্দ্রনাথ, মীর, মাইকেল, বঙ্কিমচন্দ্র, কায়কোবাদ – ১৯ শতাব্দীর সাহিত্যিক", share:20, active:true,
                 route:"/t20/bangla-sahitto/s19", folder:"bangla Sahitto/19thSahittik",
                 config:{ title:"১৯ শতাব্দীর সাহিত্যিক", category:"Bangla", subject:"রবীন্দ্রনাথ, মীর, মাইকেল, বঙ্কিমচন্দ্র, কায়কোবাদ – ১৯ শতাব্দীর সাহিত্যিক", passMark:50, questionLimit:20, timeLimit:120, timerDisplay:"t20", negativeMarking:0.5, step:"03" } },
    dhara: { label:"কাব্য, ছোটগল্প, উপন্যাস, নাটক ও প্রবন্ধ – সাহিত্যের ধারা ও বিবিধ", share:30, active:true,
              route:"/t20/bangla-sahitto/dhara", folder:"bangla Sahitto/shahittorDharaObidhito",
              config:{ title:"সাহিত্যের ধারা ও বিবিধ", category:"Bangla", subject:"কাব্য, ছোটগল্প, উপন্যাস, নাটক ও প্রবন্ধ – সাহিত্যের ধারা ও বিবিধ", passMark:50, questionLimit:20, timeLimit:120, timerDisplay:"t20", negativeMarking:0.5, step:"04" } },
  }
}
```
Routes produced (each auto-selects via `T20QuizPage`): `/t20/bangla-sahitto/chorjapod`, `/t20/bangla-sahitto/adhunik`, `/t20/bangla-sahitto/s19`, `/t20/bangla-sahitto/dhara`, `/t20/bangla-sahitto/all`. (Route id `s19` avoids a leading-digit segment; adjust if you prefer `19th-sahittik`.) Standalone page config is reused by `QuickPracticeEngine`; `all` overrides category/subject via its own config. LRM for `all` (30/20/20/30 of 20) → 6/4/4/6 (exact, no leftovers).

## Implementation tasks

### 1. Define topics + shares + sources in `src/data/practiceRoutes.js`
For every subject, each topic gets: `label, route, active, config, share?` and a source — **`folder`** (API globs `data/t20/<folder>/*.json`) or **`files`** (explicit list). "all" topics get `config` only (compose siblings). `share` omitted ⇒ equal share.
- **Already-aligned subjects** (GK, ICT, sadharonBiggan, gkInternational, vugolPoribeshDM, noikotaMS): add `share` + `folder`/`files` to each topic; "all" topics get `config` only.
- **Bangla Shahitto** — activated per the worked example above (4 topics 30/20/20/30 + `all`). **Bangla Bacaron** and **English** (Grammar/Literature) follow the identical model; wire their folders + shares the same way.
- Add `config` to every active topic (also fixes the `QuickPracticeSetup` config bug).
- Standalone topic page draws `targetN` from its own `folder`/`files`; `all` draws via LRM across sibling `share`s.

### 2. Shared util: `src/lib/t20Allocation.js`
- `getRandomItems(arr, n)`, `allocate(sources, targetN)` (LRM), `poolFiles(topic)` → for `folder`: glob `data/t20/<folder>/*.json` and `import()` each (server-side), concat into one pool; for `files`: map the list. Unit-testable. Deterministic counts; RNG only in sampling/shuffle.

### 3. New API route: `src/app/api/t20/questions/route.js`
- `GET /api/t20/questions?key=<subjectId>:<topicId>`
- Resolve topic in `practiceRoutes`; missing/inactive → 400/404.
- If topic id === `all` (composer): build `sources` from that subject's **sibling topics** that have a `share` (exclude the `all` topic itself, `active:false`, and non-topic aggregates). `targetN = config.questionLimit`. Else (microtopic): `sources = [that topic]`, `targetN = config.questionLimit`.
- For each source: `poolFiles(source)` (folder-glob or files list) → `allocate()` (LRM) gives a count → `getRandomItems(pool, count)`. Concatenate all; final shuffle.
- `200 { questions:[N], config }` with `Cache-Control: no-store`. Errors → 400 (bad key) / 404 (topic not active) / 500 (file missing / `base_i > pool.length`).

### 4. Shared client shim: `src/components/T20QuizPage.jsx`
```jsx
'use client';
import { useEffect, useState } from 'react';
import QuickPracticeEngine from '@/components/QuickPracticeEngine';
export default function T20QuizPage({ topicKey }) {
  const [questions, setQuestions] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ fetch(`/api/t20/questions?key=${topicKey}`)
    .then(r=>{ if(!r.ok) throw new Error(r.statusText); return r.json(); })
    .then(d=>{ setQuestions(d.questions); setConfig(d.config); setLoading(false); })
    .catch(()=>{ setLoading(false); }); },[topicKey]);
  if(loading) return <div className="...animate-pulse">Loading questions...</div>;
  if(!questions) return null;
  return <QuickPracticeEngine questions={questions} config={config} />;
}
```

### 5. Rewrite each `src/app/t20/**/page.jsx` to the shim
Each becomes:
```jsx
import T20QuizPage from '@/components/T20QuizPage';
export default function Page() { return <T20QuizPage topicKey="gk:all" />; }
```
Remove ALL static `import ... .json` lines (primary bundle reduction). `topicKey` = `<subjectId>:<topicId>` (e.g. `gk:all`, `gk:shilpoBanijjo`, `ict:all`, `english:engall`).

### 6. Delete obsolete Bangla pages + orphaned data
- Delete the whole old tree `src/app/t20/bangla/**` (`bacaron/*`, `shahitto/*`, `all/page.jsx`) — these import from the abandoned `data/t20/bangla/...` paths; replaced by `src/app/t20/bangla-sahitto/**` (new subject, per the example).
- Delete orphaned `data/t20/bangla/` folder — no longer imported.
- Keep `data/t20/bangla Sahitto/` and `data/t20/banglaBakaron/` as the live Bangla sources (activate `BanglaBacaron` subject the same way as `BanglaSahitto`).

### 7. QuickPracticeSetup
No change needed (already reads `practiceRoutes` dynamically; now also reads `topic.config` for the confirm popup rules once `config` is populated in task 1).

## Edge cases / failure modes
- **File smaller than its LRM seat:** assert `base_i <= data.length` → 500 + message (never true with current data: min draw 1, smallest file ~41 rows).
- **Shares not summing to 100:** LRM normalizes; totals still exactly `targetN`.
- **Tie in remainders:** deterministic by index asc — reproducible across server instances. No RNG in counts; RNG only in final draw + shuffle.
- **Missing/renamed JSON:** API catches import error → 500 + file+key in body.
- **Engine internals:** timer, `correct - wrong*0.5`, html2canvas JPEG, retry→`/t20`, result popup, Bengali messages — unchanged.
- **SSR/CSR:** page is a thin client shim; server renders shell, client fetches. Reuse existing loading fallback.

## Validation
1. `npm run lint` — no unused imports (all static JSON imports removed).
2. Unit-check `t20Allocation.js`: LRM returns `sum==targetN` for the GK/all share set and for a 7%-style share set; assert each `base_i <= data.length`.
3. `npm run build` — no broken JSON import paths; no `t20` JSON in client chunks (check `.next/static/chunks`).
4. Manual (per route): Network tab → `questions` payload ≈ 6–8 KB, not MB; exactly 20 render; `bangla-sahitto/all` shows the 6/4/4/6 distribution; `QuickPracticeSetup` confirm popup shows the real time/limit/negative-mark.
5. E2E: answer → submit → score `correct - wrong*0.5`; review sheet shows explain/source; JPEG download works; retry → `/t20`.
6. Regression: all 41+ `t20/**/page.jsx` routes still resolve (no 404).

## Rollback
Git-revert the `page.jsx` shim rewrites + remove the API route/util; restore static JSON imports. `practiceRoutes.js` additions are additive.

## Out of scope
- Migrating `/vocabulary`, `/a2z`, `/history`, `/psychology-test-bangla`, `frontApp`.
- Changing question schema or `QuickPracticeEngine` scoring/display logic.
- Auth/progress persistence (quizzes currently anonymous/local).
