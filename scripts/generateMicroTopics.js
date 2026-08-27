/* eslint-disable */
/**
 * Scans data/t20/<subject>/<topic>/<file>.json and generates data/microTopics.json
 * (Subject > Topic > Micro-topic mapping).
 *
 * - Subject & Topic keys = the on-disk folder names (Banglish, as-is).
 * - microTopic = human-readable Bengali label derived from the Banglish filename.
 * - No existing question JSON files are modified.
 *
 * Run: node scripts/generateMicroTopics.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'data', 't20');
const OUT = path.join(__dirname, '..', 'data', 'microTopics.json');

// Subjects in the old/orphaned layout that are documented as removed / not part
// of the new 3-tier scheme. They are excluded from the mapping.
const EXCLUDED_SUBJECTS = new Set(['bangla', 'english']);

// Aggregate / combined files that are not micro-topics.
function isAggregate(name) {
  const base = name.replace(/\.json$/i, '');
  return (
    /All$/i.test(base) ||
    /(^|[_-])all$/i.test(base) ||
    /combined/i.test(base) ||
    /modelTest/i.test(base)
  );
}

// ---- Banglish -> Bengali token dictionary (lowercased Banglish token => Bengali) ----
const WORD_MAP = {
  // bangla Sahitto
  michel: 'মাইকেল',
  bonkim: 'বঙ্কিম',
  mir: 'মীর',
  mosarof: 'মোশাররফ',
  kaykobad: 'কায়কোবাদ',
  robindranath: 'রবীন্দ্রনাথ',
  thakur: 'ঠাকুর',
  godder: 'গদ্যের',
  itihas: 'ইতিহাস',
  fort: 'ফোর্ট',
  uliyam: 'উইলিয়াম',
  ochapakhana: 'ও ছাপাখানা',
  chapakhana: 'ছাপাখানা',
  sahitto: 'সাহিত্য',
  somaj: 'সমাজ',
  academy: 'একাডেমি',
  chorjapod: 'চর্যাপদ',
  prachinjug: 'প্রাচীনযুগ',
  modhdhojug: 'মধ্যযুগ',
  osahitto: 'অসাহিত্য',
  kormo: 'কর্ম',
  prachin: 'প্রাচীন',
  jug: 'যুগ',
  lipi: 'লিপি',
  ojonmmokotha: 'ও জন্মকথা',
  and: 'ও',
  bikhat: 'বিখ্যাত',
  ukti: 'উক্তি',
  kabbo: 'কাব্য',
  chotogolpo: 'ছোটগল্প',
  jibon: 'জীবন',
  charit: 'চরিত',
  potrika: 'পত্রিকা',
  samoyiki: 'সাময়িকী',
  sompadok: 'সম্পাদক',
  upadhi: 'উপাধি',
  chondonam: 'ছন্দনাম',
  uponnash: 'উপন্যাস',
  natok: 'নাটক',
  probondho: 'প্রবন্ধ',

  // banglaBakaron
  karok: 'কারক',
  bivokti: 'বিভক্তি',
  kriyar: 'ক্রিয়ার',
  kal: 'কাল',
  ovab: 'ভাব',
  nto: 'ণ-ত্ব',
  bidhan: 'বিধান',
  oshto: 'ষ-ত্ব',
  onusorgo: 'অনুসর্গ',
  uposorgo: 'উপসর্গ',
  prokiti: 'প্রকৃতি',
  prottoy: 'প্রত্যয়',
  shondhi: 'সন্ধি',
  bichched: 'বিচ্ছেদ',
  somash: 'সমাস',
  bakko: 'বাক্য',
  prokoron: 'প্রকরণ',
  shudhikoron: 'শুদ্ধিকরণ',
  en2bn: 'ইংরেজি-বাংলা',
  onubad: 'অনুবাদ',
  sobdher: 'শব্দের',
  ortho: 'অর্থ',
  oproyog: 'প্রয়োগ',
  bagdhara: 'বাগধারা',
  banan: 'বানান',
  biporit: 'বিপরীত',
  sobddo: 'শব্দ',
  chondo: 'ছন্দ',
  oolonkor: 'অলংকার',
  ek: 'এক',
  kothay: 'কথায়',
  prokash: 'প্রকাশ',
  parivashik: 'পরিভাষিক',
  potro: 'পত্র',
  likhon: 'লিখন',
  probad: 'প্রবাদ',
  prochonon: 'প্রবচন',
  shamorthok: 'সমার্থক',
  shobdo: 'শব্দ',
  bochon: 'বচন',
  podasrito: 'পদাশ্রিত',
  nirdeshok: 'নির্দেশক',
  pod: 'পদ',
  prokaron: 'প্রকরণ',
  purush: 'পুরুষ',
  odiruto: 'দ্বিরুক্ত',
  purus: 'পুরুষ',
  ostribachok: 'স্ত্রীবাচক',
  sobdo: 'শব্দ',
  ostri: 'স্ত্রী',
  bachok: 'বাচক',
  srenibivag: 'শ্রেণীবিভাগ',
  vasha: 'ভাষা',
  obangla: 'ও বাংলা',
  bakaron: 'ব্যাকরণ',
  bisoyok: 'বিষয়ক',
  grontho: 'গ্রন্থ',
  dbonni: 'ধ্বনি',
  oborno: 'বর্ণ',
  dhonnir: 'ধ্বনির',
  poriborton: 'পরিবর্তন',
  joti: 'যতি',
  ched: 'চ্ছেদ',
  chinho: 'চিহ্ন',

  // GK (বাংলাদেশ বিষয়াবলী)
  bangladeher: 'বাংলাদেশের',
  songbidhan: 'সংবিধান',
  gonomadhom: 'গণমাধ্যম',
  projukti: 'প্রযুক্তি',
  jatiyo: 'জাতীয়',
  bisoyaboli: 'বিষয়াবলী',
  kisti: 'কৃষ্টি',
  songskriti: 'সংস্কৃতি',
  muktijhdhdo: 'মুক্তিযুদ্ধ',
  bortoman: 'বর্তমান',
  history: 'ইতিহাস',
  prothom: 'প্রথম',
  mohila: 'নারী',
  bd: 'বাংলাদেশ',
  anddolon: 'আন্দোলন',
  orjon: 'অর্জন',
  jonosumari: 'জনশুমারি',
  kheladhula: 'খেলাধুলা',
  colochitra: 'চলচ্চিত্র',
  krishij: 'কৃষিজ',
  sompod: 'সম্পদ',
  orthoniti: 'অর্থনীতি',
  orthonitibd: 'অর্থনীতি বাংলাদেশ',
  protisthan: 'প্রতিষ্ঠান',
  somuho: 'সমূহ',
  rajnoitik: 'রাজনৈতিক',
  sorkar: 'সরকার',
  babostha: 'ব্যবস্থা',
  shilpo: 'শিল্প',
  banijjo: 'বাণিজ্য',

  // GK International
  int: 'আন্তর্জাতিক',
  jot: 'জোট',
  manob: 'মানব',
  odhikar: 'অধিকার',
  songstha: 'সংস্থা',
  orthonoitik: 'অর্থনৈতিক',
  cukti: 'চুক্তি',
  sonstha: 'সংস্থা',
  un: 'জাতিসংঘ',
  current: 'বর্তমান',
  world: 'বিশ্ব',
  international: 'আন্তর্জাতিক',
  enviroment: 'পরিবেশ',
  boishhik: 'বৈশ্বিক',
  vurajniti: 'ভূ-রাজনীতি',
  onchol: 'অঞ্চল',
  notun: 'নতুন',
  puraton: 'পুরাতন',
  nam: 'নাম',
  nirapotta: 'নিরাপত্তা',
  chuktti: 'চুক্তি',
  rajnotik: 'রাজনৈতিক',
  kutnitik: 'কূটনৈতিক',
  porivasha: 'পরিভাষা',

  // সাধারণ বিজ্ঞান (Biology / Chemistry / Physics)
  kosh: 'কোষ',
  tisue: 'টিস্যু',
  genetics: 'জেনেটিক্স',
  prani: 'প্রাণি',
  bidda: 'বিদ্যা',
  putti: 'অণুজীব',
  onubiggan: 'বিজ্ঞান',
  rog: 'রোগ',
  shastho: 'স্বাস্থ্য',
  sorirtotto: 'শরীরতত্ত্ব',
  manobdeh: 'মানবদেহ',
  udvhid: 'উদ্ভিদ',
  biggan: 'বিজ্ঞান',
  acid: 'অ্যাসিড',
  khar: 'ক্ষার',
  lobon: 'লবণ',
  bikriyao: 'বিক্রিয়া',
  torit: 'তড়িৎ',
  dhatu: 'ধাতু',
  khonij: 'খনিজ',
  podartho: 'পদার্থ',
  folit: 'ফলিত',
  rosayon: 'রসায়ন',
  joibo: 'জৈব',
  ojoibo: 'অজৈব',
  chemistry: 'রসায়ন',
  podarther: 'পদার্থের',
  gothon: 'গঠন',
  obosthan: 'অবস্থান',
  alok: 'আলোক',
  biddut: 'বিদ্যুৎ',
  choumbokotto: 'চৌম্বকত্ব',
  bolbidda: 'বলবিদ্যা',
  sokti: 'শক্তি',
  physics: 'পদার্থবিজ্ঞান',
  xyz: 'XYZ',
  porimap: 'পরিমাপ',
  jontropati: 'যন্ত্রপাতি',
  pormanutejoskriyota: 'পারমাণবিক তেজস্ক্রিয়তা',
  apikhikota: 'আপেক্ষিকতা',
  toronggo: 'তরঙ্গ',
  tap: 'তাপ',
  pritibi: 'পৃথিবী',
  mohakash: 'মহাকাশ',

  // ভূগোল, পরিবেশ ও দুর্যোগ ব্যবস্থাপনা
  prakitik: 'প্রাকৃতিক',
  durjog: 'দুর্যোগ',
  babosthapona: 'ব্যবস্থাপনা',
  abohaoya: 'আবহাওয়া',
  jolobayu: 'জলবায়ু',
  bangladesher: 'বাংলাদেশের',
  poribesh: 'পরিবেশ',
  vouto: 'ভৌত',
  vugol: 'ভূগোল',

  // নৈতিকতা
  mullobodh: 'মূল্যবোধ',
  noitikota: 'নৈতিকতা',
  sushason: 'সুশাসন',

  // ICT
  ict: 'আইসিটি',
};

// Basename-level overrides (lowercased basename => final Bengali / English label).
const BASENAME_OVERRIDE = {
  // English grammar
  clause: 'Clause',
  rightformofverb: 'Right Form of Verb',
  tense: 'Tense',
  idiomsandphrases: 'Idioms & Phrases',
  adjective: 'Adjective',
  gendernumber: 'Gender & Number',
  noun: 'Noun',
  prepositionconjuctioninterjuction: 'Preposition, Conjunction & Interjection',
  pronoun: 'Pronoun',
  verbandmodal: 'Verb & Modal',
  conditionalsentence: 'Conditional Sentence',
  narrationdgree: 'Narration & Degree',
  voicechange: 'Voice Change',
  antonym: 'Antonym',
  correctspelling: 'Correct Spelling',
  groupverb: 'Group Verb',
  onewordsubstitution: 'One Word Substitution',
  synonym: 'Synonym',
  // English literature
  '19thcenturyliturature': '19th Century Literature',
  '20thmodernism': '20th Century Modernism',
  'anglosaxon2neoclassical': 'Anglo-Saxon to Neoclassical',
  famousquotations: 'Famous Quotations',
  literaryforms: 'Literary Forms',
  williamshakespeare: 'William Shakespeare',
  // mixed / special Bangla
  en2bnonubad: 'ইংরেজি-বাংলা অনুবাদ',
  'un_jatisongho': 'জাতিসংঘ',
  'atozbd1': 'এ টু জেড বাংলাদেশ ১',
};

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function toBengaliNumeral(str) {
  return String(str)
    .split('')
    .map((ch) => (/[0-9]/.test(ch) ? BENGALI_DIGITS[Number(ch)] : ch))
    .join('');
}

// Split a Banglish camelCase / snake_case name into [digit-runs | letter-runs].
function tokenize(name) {
  const camel = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  return camel
    .split(/_/)
    .join(' ')
    .split(/\s+/)
    .map((part) => (part.match(/\d+|[a-z]+/gi) || []).join(' '))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean);
}

const missing = new Set();
function wordToBengali(token) {
  if (/^\d+$/.test(token)) return toBengaliNumeral(token);
  const key = token.toLowerCase();
  if (key in WORD_MAP) return WORD_MAP[key];
  missing.add(key);
  return token; // left raw so it is visible for later refinement
}

function basenameToMicroTopic(fileName) {
  const base = fileName.replace(/\.json$/i, '');
  const lookup = base.toLowerCase();
  if (lookup in BASENAME_OVERRIDE) return BASENAME_OVERRIDE[lookup];
  return tokenize(base)
    .map(wordToBengali)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------- build the mapping ----------
const map = {};
const subjectDirs = fs
  .readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !EXCLUDED_SUBJECTS.has(d.name))
  .sort((a, b) => a.name.localeCompare(b.name));

for (const subjectDir of subjectDirs) {
  const subjectPath = path.join(ROOT, subjectDir.name);
  const subjectKey = subjectDir.name;
  const subjectTopics = (map[subjectKey] = {});

  const entries = fs.readdirSync(subjectPath, { withFileTypes: true });
  const topicDirs = entries
    .filter((e) => e.isDirectory() && e.name !== subjectKey)
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));
  const rootFiles = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.json') && !isAggregate(e.name))
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b));

  for (const topicDir of topicDirs) {
    const topicPath = path.join(subjectPath, topicDir);
    const files = fs
      .readdirSync(topicPath)
      .filter((f) => f.toLowerCase().endsWith('.json') && !isAggregate(f))
      .sort((a, b) => a.localeCompare(b));
    if (files.length === 0) continue;
    subjectTopics[topicDir] = files.map((f) => ({
      microTopic: basenameToMicroTopic(f),
      file: f,
    }));
  }

  // Subject-root JSON files (flat subjects & strays) -> implicit catch-all topic.
  if (rootFiles.length > 0) {
    const list = rootFiles.map((f) => ({ microTopic: basenameToMicroTopic(f), file: f }));
    subjectTopics[subjectKey] = (subjectTopics[subjectKey] || []).concat(list);
  }
}

// Remove subjects/topics that ended up empty.
const out = {};
for (const [k, v] of Object.entries(map)) {
  const filtered = {};
  for (const [tk, tv] of Object.entries(v)) if (tv && tv.length > 0) filtered[tk] = tv;
  if (Object.keys(filtered).length > 0) out[k] = filtered;
}

fs.writeFileSync(OUT, JSON.stringify(out, null, 4) + '\n', 'utf8');

// ---- report ----
let totalFiles = 0;
for (const s of Object.keys(out)) {
  for (const t of Object.keys(out[s])) totalFiles += out[s][t].length;
}
console.log('Wrote ' + OUT);
console.log('Subjects: ' + Object.keys(out).length + ', Micro-topics: ' + totalFiles);
if (missing.size) {
  console.log('Tokens not in dictionary (kept raw):');
  [...missing].sort().forEach((m) => console.log('  - ' + m));
}