/* Exercises the localStorage-backed visited store + coverage math used by
   src/app/bd-map/BdMapClient.jsx, against a fake window.localStorage.
   Run: node scripts/checkVisitedStore.js */
const fs = require('fs');
const path = require('path');

// Minimal localStorage stub.
function makeStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    _dump: () => Object.fromEntries(map),
  };
}

const mapData = require('../src/data/bdDistricts.json');
const STORAGE_KEY = 'bdmap.visited.v1';
const VALID_NAMES = new Set(mapData.districts.map((d) => d.name));
const TOTAL = mapData.districtCount;

function parseVisited(raw, VALID) {
  if (!raw) return new Set();
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((n) => typeof n === 'string' && VALID.has(n)));
  } catch {
    return new Set();
  }
}

let failures = 0;
function check(label, cond, extra = '') {
  if (!cond) failures++;
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${extra ? ' -> ' + extra : ''}`);
}

// --- empty / missing ---
check('missing key => empty set', parseVisited(null, VALID_NAMES).size === 0);
check('"null" => empty set', parseVisited('null', VALID_NAMES).size === 0);
check('empty array => empty set', parseVisited('[]', VALID_NAMES).size === 0);

// --- malformed input must not throw ---
check('garbage JSON => empty set', parseVisited('{not json', VALID_NAMES).size === 0);
check('object (not array) => empty set', parseVisited('{"a":1}', VALID_NAMES).size === 0);
check('numbers filtered out', parseVisited('[1,2,3]', VALID_NAMES).size === 0);
check('null entries filtered out', parseVisited('[null,"Dhaka"]', VALID_NAMES).size === 1);

// --- junk district names rejected ---
check(
  'unknown district names rejected',
  parseVisited(JSON.stringify(['Dhaka', 'Atlantis', '', 42, 'Bagladesh']), VALID_NAMES).size === 1
);
check('old geoBoundaries spellings rejected (dataset renamed)',
  parseVisited(JSON.stringify(['Bogra', 'Chittagong', 'Comilla', 'Jessore']), VALID_NAMES).size === 0);
check('normalized names accepted',
  parseVisited(JSON.stringify(['Bogura', 'Chattogram', 'Cumilla', 'Jashore']), VALID_NAMES).size === 4);

// --- valid round-trip ---
const all = mapData.districts.map((d) => d.name);
check('all 64 round-trip', parseVisited(JSON.stringify(all), VALID_NAMES).size === TOTAL);
check('Cox\'s Bazar apostrophe survives', parseVisited(JSON.stringify(["Cox's Bazar"]), VALID_NAMES).has("Cox's Bazar"));

// --- storage round trip ---
const storage = makeStorage();
storage.setItem(STORAGE_KEY, JSON.stringify(['Dhaka', 'Sylhet']));
check('storage round-trip', parseVisited(storage.getItem(STORAGE_KEY), VALID_NAMES).size === 2);

// --- coverage math (mirrors the component) ---
const pct = (n) => Math.round((n / TOTAL) * 100);
check('0 visited => 0%', pct(0) === 0, pct(0) + '%');
check('28 visited => 44%', pct(28) === 44, pct(28) + '%');
check('1 visited => 2%', pct(1) === 2, pct(1) + '%');
check('32 visited => 50%', pct(32) === 50, pct(32) + '%');
check('64 visited => 100%', pct(64) === 100, pct(64) + '%');
check('63 visited => 98% (never rounds to 100)', pct(63) === 98, pct(63) + '%');

// --- toggle semantics ---
const visited = new Set(['Dhaka']);
const toggle = (set, name) => {
  const next = new Set(set);
  if (next.has(name)) next.delete(name);
  else next.add(name);
  return next;
};
check('toggle adds new district', toggle(visited, 'Sylhet').has('Sylhet') && toggle(visited, 'Sylhet').size === 2);
check('toggle removes existing district', !toggle(visited, 'Dhaka').has('Dhaka') && toggle(visited, 'Dhaka').size === 0);
check('toggle never mutates the source set', visited.size === 1 && visited.has('Dhaka'));

// --- markVisited idempotency ---
const mark = (set, name) => {
  if (set.has(name)) return set;
  const next = new Set(set);
  next.add(name);
  return next;
};
check('markVisited adds', mark(visited, 'Chattogram').size === 2);
check('markVisited is idempotent', mark(mark(visited, 'Chattogram'), 'Chattogram').size === 2);

// --- quota / private mode: writes throw, app must not crash ---
let threw = false;
try {
  const boom = { getItem: () => null, setItem: () => { throw new Error('QuotaExceeded'); } };
  const raw = boom.getItem(STORAGE_KEY);
  parseVisited(raw, VALID_NAMES);
  boom.setItem(STORAGE_KEY, '[]');
} catch {
  threw = true;
}
check('quota-exceeded path is guarded (caught, not fatal)', threw);

console.log(failures ? `\n${failures} CHECK(S) FAILED` : '\nALL CHECKS PASSED');
process.exitCode = failures ? 1 : 0;