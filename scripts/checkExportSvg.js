/* Verifies the PNG-export SVG builder used by the "Download Map" modal.
   Extracts buildExportSvg/escapeXml/slugify by evaluating the component file
   with a stubbed React module, then asserts on the produced markup.
   Run: node scripts/checkExportSvg.js */
const fs = require('fs');
const path = require('path');

const COMPONENT = path.join(
  __dirname,
  '..',
  'src',
  'app',
  'bd-map',
  'BdMapClient.jsx'
);
const mapData = require('../src/data/bdDistricts.json');

// --- Extract the pure helpers without a full React/JSX runtime -------------
const src = fs.readFileSync(COMPONENT, 'utf8');

function grabFunction(name) {
  const start = src.indexOf(`function ${name}(`);
  if (start === -1) throw new Error(`function ${name} not found`);
  // Walk braces from the first one to find the true end of the function.
  let depth = 0;
  let seen = false;
  for (let i = start; i < src.length; i++) {
    if (src[i] === '{') {
      depth++;
      seen = true;
    } else if (src[i] === '}') {
      depth--;
      if (seen && depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error(`unterminated function ${name}`);
}

const COLORS = { bg: '#ffffff', visited: '#059669', unvisited: '#e5e7eb', border: '#ffffff', ink: '#1a365d', muted: '#475569', accent: '#059669' };
const TOTAL_DISTRICTS = mapData.districtCount;

// eslint-disable-next-line no-new-func
const factory = new Function(
  'mapData',
  'TOTAL_DISTRICTS',
  'COLORS',
  `${grabFunction('escapeXml')}\n${grabFunction('buildExportSvg')}\nreturn buildExportSvg;`
);
const buildExportSvg = factory(mapData, TOTAL_DISTRICTS, COLORS);
const escapeXml = new Function(`${grabFunction('escapeXml')}\nreturn escapeXml;`)();

// --- Assertions -----------------------------------------------------------
let failures = 0;
function check(label, cond, extra = '') {
  if (!cond) failures++;
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${label}${extra ? ' -> ' + extra : ''}`);
}

const allNames = mapData.districts.map((d) => d.name);
const svg = buildExportSvg('Rahim Uddin', new Set(allNames));
const empty = buildExportSvg('Rahim Uddin', new Set());
const partial = buildExportSvg('Rahim Uddin', new Set(['Dhaka', 'Sylhet', 'Chattogram']));

// The export also renders 3 banner <text> lines (title, stats, attribution)
// on top of the 128 district labels, and the stats line reuses the accent
// colour, so the totals below are offset by those.
const BANNER_TEXTS = 3;
const bannerTexts = (out) => (out.match(/<text /g) || []).length - 128;

check('produces an <svg> root', svg.startsWith('<svg') && svg.trim().endsWith('</svg>'));
check('declares the SVG namespace', svg.includes('xmlns="http://www.w3.org/2000/svg"'));

// All 64 paths present in every variant.
for (const [name, out] of [['all visited', svg], ['none visited', empty], ['partial', partial]]) {
  const paths = (out.match(/<path /g) || []).length;
  check(`${name}: 64 paths`, paths === 64, String(paths));
  const texts = (out.match(/<text /g) || []).length;
  check(`${name}: 128 district labels + ${BANNER_TEXTS} banner`, texts === 128 + BANNER_TEXTS, String(texts));
  check(`${name}: banner count is exactly ${BANNER_TEXTS}`, bannerTexts(out) === BANNER_TEXTS, String(bannerTexts(out)));
}

// Colours reflect visited state. Count green fills on <path> elements only --
// the stats banner line also uses fill="#059669" (COLORS.accent) and would
// otherwise be miscounted.
const greenFills = (s) => (s.match(/<path [^>]*fill="#059669"/g) || []).length;
const grayFills = (s) => (s.match(/<path [^>]*fill="#e5e7eb"/g) || []).length;
check('all-visited: 64 green fills', greenFills(svg) === 64, String(greenFills(svg)));
check('all-visited: 0 gray fills', grayFills(svg) === 0, String(grayFills(svg)));
check('none-visited: 0 green fills', greenFills(empty) === 0, String(greenFills(empty)));
check('none-visited: 64 gray fills', grayFills(empty) === 64, String(grayFills(empty)));
check('3 visited => 3 green fills', greenFills(partial) === 3, String(greenFills(partial)));
check('3 visited => 61 gray fills', grayFills(partial) === 61, String(grayFills(partial)));
check('every path has a fill', (svg.match(/<path [^>]*fill="/g) || []).length === 64);
check('unvisited fill present', empty.includes('#e5e7eb'));
check('even-odd fill rule set for lakes', svg.includes('fill-rule="evenodd"'));

// Name overlay + counters.
check("name appears in title", svg.includes('Rahim Uddin'));
check("title uses \"'s Bangladesh Map\"", svg.includes('&#8217;s Bangladesh Map'));
check('all-visited shows 64/64', svg.includes('64 / 64'));
check('all-visited shows 100%', svg.includes('100% covered'));
check('none-visited shows 0 / 64', empty.includes('0 / 64'));
check('none-visited shows 0%', empty.includes('0% covered'));
check('3 visited shows 5% (3/64)', partial.includes('3 / 64') && partial.includes('5% covered'));
check('attribution present', svg.includes('geoBoundaries'));

// No external resource references (must render offline, no CSS needed).
check('no external css link', !/<link/i.test(svg));
check('no external image/script', !/<image|<script/i.test(svg));
check('has white background rect', svg.includes('<rect'));

// XML escaping of hostile names.
const nasty = buildExportSvg('<script>alert("x")</script> & "quote"', new Set());
check('injects no raw <script>', !/<script/i.test(nasty));
check('escapes angle brackets', nasty.includes('&lt;script&gt;'));
check('escapes ampersand', nasty.includes('&amp;'));
check('escapes double quotes', nasty.includes('&quot;'));

// Bengali labels survive into the export.
check('Bengali label rendered', svg.includes('ঢাকা'));
// escapeXml turns the apostrophe into &apos;, which is the correct XML
// entity -- it still renders as "Cox's Bazar" in the browser.
check("apostrophe district name survives (XML-escaped)", svg.includes('Cox&apos;s Bazar'));
check('no raw unescaped apostrophe breaks the attr', !/font-family="[^"]*"[^>]*>[^<]*Cox's/.test(svg));

// escapeXml unit checks.
check('escapeXml escapes &', escapeXml('a&b') === 'a&amp;b');
check('escapeXml escapes <', escapeXml('<x>') === '&lt;x&gt;');

// slugify
const slugSrc = grabFunction('slugify');
// eslint-disable-next-line no-new-func
const slugify = new Function(`${slugSrc}\nreturn slugify;`)();
check('slugify strips spaces', slugify('Rahim Uddin') === 'Rahim-Uddin', slugify('Rahim Uddin'));
check('slugify strips path chars', !slugify('../../etc/passwd').includes('/'), slugify('../../etc/passwd'));
check('slugify falls back on empty', slugify('   ') === 'my', slugify('   '));

// Regression: visited labels must use a DARK halo. A white halo on white text
// (over the dark green fill) made labels like "Dhaka" effectively invisible.
const haloPairs = (s) =>
  [...s.matchAll(/<text [^>]*fill="(#[0-9a-f]{6})"[^>]*stroke="(#[0-9a-f]{6})"/g)].map(
    (m) => `${m[1]}|${m[2]}`
  );
const pairs = haloPairs(svg);
check('every label has a fill+stroke pair', pairs.length === 128, String(pairs.length));
check('all-visited: no white-on-white label (invisible)', !pairs.includes('#ffffff|#ffffff'));
check('all-visited: white text always has dark halo',
  pairs.every((p) => p === '#ffffff|#064e3b'));

// `partial` contains both visited and unvisited districts, so it must contain
// both label styles (the all-visited export has no unvisited labels at all).
const partialPairs = haloPairs(partial);
check('mixed export: 128 fill+stroke pairs', partialPairs.length === 128, String(partialPairs.length));
check('mixed export: no white-on-white label', !partialPairs.includes('#ffffff|#ffffff'));
check('mixed export: dark text uses white halo', partialPairs.includes('#0f172a|#ffffff'));
check('mixed export: white text uses dark halo', partialPairs.includes('#ffffff|#064e3b'));
check('mixed export: both styles present',
  partialPairs.includes('#0f172a|#ffffff') && partialPairs.includes('#ffffff|#064e3b'));
check('mixed export: 3 white-on-green labels per language (6 total)',
  partialPairs.filter((p) => p === '#ffffff|#064e3b').length === 6,
  String(partialPairs.filter((p) => p === '#ffffff|#064e3b').length));

const nonePairs = haloPairs(empty);
check('none-visited export uses only dark-on-white labels',
  nonePairs.length === 128 && nonePairs.every((p) => p === '#0f172a|#ffffff'));

console.log(failures ? `\n${failures} CHECK(S) FAILED` : '\nALL CHECKS PASSED');
process.exitCode = failures ? 1 : 0;