/* Renders the "Download Map" export SVG in headless Chrome to prove it
   actually rasterises (the SVG -> PNG step the modal relies on), and writes
   scripts/.preview.png for visual inspection.

   Run: node scripts/renderExportPreview.js */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const mapData = require('../src/data/bdDistricts.json');
const COMPONENT = path.join(__dirname, '..', 'src', 'app', 'bd-map', 'BdMapClient.jsx');
const src = fs.readFileSync(COMPONENT, 'utf8');

function grabFunction(name) {
  const start = src.indexOf(`function ${name}(`);
  let depth = 0;
  let seen = false;
  for (let i = start; i < src.length; i++) {
    if (src[i] === '{') { depth++; seen = true; }
    else if (src[i] === '}') { depth--; if (seen && depth === 0) return src.slice(start, i + 1); }
  }
  throw new Error(`unterminated ${name}`);
}

const COLORS = {
  bg: '#ffffff', visited: '#059669', unvisited: '#e5e7eb',
  border: '#ffffff', ink: '#1a365d', muted: '#475569', accent: '#059669',
};
const buildExportSvg = new Function(
  'mapData', 'TOTAL_DISTRICTS', 'COLORS',
  `${grabFunction('escapeXml')}\n${grabFunction('buildExportSvg')}\nreturn buildExportSvg;`
)(mapData, mapData.districtCount, COLORS);

// A representative mix: 5 visited, 59 not.
const svg = buildExportSvg('Rahim Uddin', new Set([
  'Dhaka', 'Sylhet', 'Chattogram', "Cox's Bazar", 'Rajshahi',
]));

const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>html,body{margin:0;background:#fff}svg{display:block}</style></head>
<body>${svg}</body></html>`;

const htmlPath = path.join(__dirname, '.preview.html');
const pngPath = path.join(__dirname, '.preview.png');
fs.writeFileSync(htmlPath, html, 'utf8');

const CHROME = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
try {
  // Natural viewBox size is 1000 x (mapHeight + banner).
  const totalH = mapData.height + 132;
  execFileSync(
    CHROME,
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      `--window-size=1000,${totalH}`,
      `--screenshot=${pngPath}`,
      `file:///${htmlPath.replace(/\\/g, '/')}`,
    ],
    { stdio: 'pipe', timeout: 120000 }
  );

  const size = fs.statSync(pngPath).size;
  const sig = fs.readFileSync(pngPath).subarray(1, 4).toString('ascii');
  console.log('PNG written:', pngPath, size, 'bytes');
  console.log('valid PNG signature:', sig === 'PNG');
  console.log('non-blank render (>10KB):', size > 10240);
} catch (err) {
  console.error('Headless Chrome render failed:', err.message);
  process.exitCode = 1;
} finally {
  fs.rmSync(htmlPath, { force: true });
}