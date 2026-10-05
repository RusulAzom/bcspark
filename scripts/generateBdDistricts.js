/* eslint-disable */
/**
 * One-time generator: Bangladesh ADM2 districts -> static SVG path data.
 *
 * Source : geoBoundaries gbOpen BGD/ADM2 (simplified), an openly licensed
 *          (CC-BY-4.0 / ODbL) administrative boundary dataset for Bangladesh.
 * Output : src/data/bdDistricts.json  -- consumed by src/app/bd-map/page.jsx
 *
 * The output is fully self-contained static SVG geometry: no tile servers, no
 * mapping libraries, no runtime GeoJSON parsing. This script is NOT imported
 * by the app; re-run it only if the source data changes.
 *
 * Download the source file to scripts/.cache/ (see SOURCE_FILE below):
 *   https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/BGD/ADM2/geoBoundaries-BGD-ADM2_simplified.geojson
 *
 * Run: node scripts/generateBdDistricts.js
 */
const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, '.cache');
const SOURCE_FILE = path.join(
  CACHE_DIR,
  'geoBoundaries-BGD-ADM2_simplified.geojson'
);
const OUT = path.join(__dirname, '..', 'src', 'data', 'bdDistricts.json');

// Map width in SVG user units. Height is derived from the real aspect ratio.
const MAP_WIDTH = 1000;

// Douglas-Peucker tolerance in projected units. Higher = smaller file,
// chunkier coastlines.
const SIMPLIFY_TOLERANCE = 0.0015;

/**
 * geoBoundaries uses older English spellings for several districts. We
 * normalize to current official names so `data-district` reads correctly.
 */
const NAME_NORMALIZATION = {
  Bogra: 'Bogura',
  Barisal: 'Barishahr',
  Chittagong: 'Chattogram',
  Comilla: 'Cumilla',
  Jessore: 'Jashore',
  Nawabganj: 'Chapainawabganj',
  Brahamanbaria: 'Brahmanbaria',
  Netrakona: 'Netrokona',
};

/** Bengali display names for all 64 districts. */
const BANGLA_NAMES = {
  Bagerhat: 'বাগেরহাট',
  Bandarban: 'বান্দরবান',
  Barguna: 'বরগুনা',
  Barishahr: 'বরিশাল',
  Bhola: 'ভোলা',
  Bogura: 'বগুড়া',
  Brahmanbaria: 'ব্রাহ্মণবাড়িয়া',
  Chandpur: 'চাঁদপুর',
  Chattogram: 'চট্টগ্রাম',
  Chuadanga: 'চুয়াডাঙ্গা',
  Chapainawabganj: 'চাঁপাইনবাবগঞ্জ',
  Cumilla: 'কুমিল্লা',
  "Cox's Bazar": 'কক্সবাজার',
  Dhaka: 'ঢাকা',
  Dinajpur: 'দিনাজপুর',
  Faridpur: 'ফরিদপুর',
  Feni: 'ফেনী',
  Gaibandha: 'গাইবান্ধা',
  Gazipur: 'গাজীপুর',
  Gopalganj: 'গোপালগঞ্জ',
  Habiganj: 'হবিগঞ্জ',
  Jamalpur: 'জামালপুর',
  Jashore: 'যশোর',
  Jhalokati: 'ঝালকাঠি',
  Jhenaidah: 'ঝিনাইদহ',
  Joypurhat: 'জয়পুরহাট',
  Khagrachhari: 'খাগড়াছড়ি',
  Khulna: 'খুলনা',
  Kishoreganj: 'কিশোরগঞ্জ',
  Kurigram: 'কুড়িগ্রাম',
  Kushtia: 'কুষ্টিয়া',
  Lakshmipur: 'লক্ষ্মীপুর',
  Lalmonirhat: 'লালমনিরহাট',
  Madaripur: 'মাদারীপুর',
  Magura: 'মাগুরা',
  Manikganj: 'মানিকগঞ্জ',
  Maulvibazar: 'মৌলভীবাজার',
  Meherpur: 'মেহেরপুর',
  Munshiganj: 'মুন্সিগঞ্জ',
  Mymensingh: 'ময়মনসিংহ',
  Naogaon: 'নওগাঁ',
  Narail: 'নড়াইল',
  Narayanganj: 'নারায়ণগঞ্জ',
  Narsingdi: 'নরসিংদী',
  Natore: 'নাটোর',
  Netrokona: 'নেত্রকোণা',
  Nilphamari: 'নীলফামারী',
  Noakhali: 'নোয়াখালী',
  Pabna: 'পাবনা',
  Panchagarh: 'পঞ্চগড়',
  Patuakhali: 'পটুয়াখালী',
  Pirojpur: 'পিরোজপুর',
  Rajbari: 'রাজবাড়ী',
  Rajshahi: 'রাজশাহী',
  Rangamati: 'রাঙ্গামাটি',
  Rangpur: 'রংপুর',
  Satkhira: 'সাতক্ষীরা',
  Shariatpur: 'শরীয়তপুর',
  Sherpur: 'শেরপুর',
  Sirajganj: 'সিরাজগঞ্জ',
  Sunamganj: 'সুনামগঞ্জ',
  Sylhet: 'সিলেট',
  Tangail: 'টাঙ্গাইল',
  Thakurgaon: 'ঠাকুরগাঁও',
};

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

/** Perpendicular distance from point p to the segment a-b. */
function perpDistance(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  if (dx === 0 && dy === 0) {
    return Math.hypot(p[0] - a[0], p[1] - a[1]);
  }
  const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy);
  const clamped = Math.max(0, Math.min(1, t));
  const projX = a[0] + clamped * dx;
  const projY = a[1] + clamped * dy;
  return Math.hypot(p[0] - projX, p[1] - projY);
}

/**
 * Ramer-Douglas-Peucker simplification. `ring` is closed (first point repeated
 * at the end), so we simplify the open polyline then re-close it.
 */
function simplifyRing(ring, tolerance) {
  if (ring.length <= 4) return ring;

  const open = ring.slice(0, ring.length - 1);
  const keep = new Uint8Array(open.length);
  keep[0] = 1;
  keep[open.length - 1] = 1;

  const stack = [[0, open.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let maxDist = 0;
    let index = -1;
    for (let i = first + 1; i < last; i++) {
      const d = perpDistance(open[i], open[first], open[last]);
      if (d > maxDist) {
        maxDist = d;
        index = i;
      }
    }
    if (maxDist > tolerance && index !== -1) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }

  const out = open.filter((_, i) => keep[i]);
  out.push(out[0]);
  return out;
}

/** Absolute area of a ring; used to find a polygon's dominant landmass. */
function ringArea(ring) {
  let area = 0;
  for (let i = 0, len = ring.length - 1; i < len; i++) {
    area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return Math.abs(area) / 2;
}

/**
 * Area-weighted centroid of a polygon's outer ring, used to place the district
 * label inside the main landmass.
 */
function ringCentroid(ring) {
  let a = 0;
  let rx = 0;
  let ry = 0;
  for (let i = 0, len = ring.length - 1; i < len; i++) {
    const cross = ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
    a += cross;
    rx += (ring[i][0] + ring[i + 1][0]) * cross;
    ry += (ring[i][1] + ring[i + 1][1]) * cross;
  }
  a /= 2;
  if (a === 0) {
    const first = ring[0];
    return [first[0], first[1]];
  }
  return [rx / (6 * a), ry / (6 * a)];
}

/** Extract every polygon ([[ring, ...], ...]) from a GeoJSON geometry. */
function toPolygons(geometry) {
  if (!geometry) return [];
  if (geometry.type === 'Polygon') return [geometry.coordinates];
  if (geometry.type === 'MultiPolygon') return geometry.coordinates;
  return [];
}

/** Round to 2 decimals, trimming trailing zeros to keep the JSON compact. */
function round(value) {
  return Math.round(value * 100) / 100;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error(
      `Missing source GeoJSON.\nExpected it at: ${SOURCE_FILE}\n\n` +
        'Download the geoBoundaries BGD ADM2 simplified GeoJSON and save it ' +
        'there (URL is in the header comment of this script).'
    );
    process.exitCode = 1;
    return;
  }

  const geojson = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf8'));
  const features = geojson.features || [];
  console.log(`Read ${features.length} district features from source.`);

  // --- Pass 1: collect geometry rings as-is ([lon, lat], north positive) ------
  // The flip to screen space happens once, in `toSvg` below, via (maxY - y),
  // so that north ends up at the top of the viewBox.
  const items = features.map((feature) => {
    const rawName = feature.properties.shapeName;
    const name = NAME_NORMALIZATION[rawName] || rawName;

    const polygons = toPolygons(feature.geometry);

    return { name, polygons };
  });

  // A single shared cos(lat) factor keeps relative sizes consistent across the
  // whole map, so the country keeps its true east-west proportions.
  let allLatSum = 0;
  let allLatCount = 0;
  for (const feature of features) {
    for (const rings of toPolygons(feature.geometry)) {
      for (const ring of rings) {
        for (const [, lat] of ring) {
          allLatSum += lat;
          allLatCount++;
        }
      }
    }
  }
  const globalKx = Math.cos(((allLatSum / allLatCount) * Math.PI) / 180);

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const item of items) {
    for (const rings of item.polygons) {
      for (const [x0, y0] of rings[0] || []) {
        const x = x0 * globalKx;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y0 < minY) minY = y0;
        if (y0 > maxY) maxY = y0;
      }
    }
  }

  // --- Pass 2: scale into the SVG viewBox ------------------------------------
  const scale = MAP_WIDTH / (maxX - minX);
  const mapHeight = Math.round((maxY - minY) * scale);

  // lon -> x (east right), lat -> y (north up, via maxY - y). Combined with
  // the cos(lat) factor this is a plate-carree projection with true aspect.
  const toSvg = ([x0, y]) => [
    round((x0 * globalKx - minX) * scale),
    round((maxY - y) * scale),
  ];

  const districts = items
    .map(({ name, polygons }) => {
      let d = '';
      let labelX = 0;
      let labelY = 0;
      let bestArea = -1;

      for (const rings of polygons) {
        // All rings of a polygon go into one subpath so the even-odd fill rule
        // punches holes for inland lakes.
        let sub = '';
        for (const ring of rings) {
          const simplified = simplifyRing(ring, SIMPLIFY_TOLERANCE);
          if (simplified.length < 4) continue;
          sub += 'M' + simplified.map(toSvg).map((p) => p.join(',')).join('L') + 'Z';

          const area = ringArea(ring);
          if (area > bestArea) {
            bestArea = area;
            const [cx, cy] = ringCentroid(ring);
            const [px, py] = toSvg([cx, cy]);
            labelX = px;
            labelY = py;
          }
        }
        d += sub;
      }

      return {
        name,
        nameBn: BANGLA_NAMES[name] || name,
        d,
        labelX,
        labelY,
      };
    })
    .filter((district) => district.d)
    .sort((a, b) => a.name.localeCompare(b.name));

  const missingBangla = districts.filter((d) => d.nameBn === d.name);
  if (missingBangla.length) {
    console.warn('Warning: no Bengali name for:', missingBangla.map((d) => d.name).join(', '));
  }

  const output = {
    _comment:
      'GENERATED FILE - do not edit by hand. Run: node scripts/generateBdDistricts.js',
    viewBox: `0 0 ${MAP_WIDTH} ${mapHeight}`,
    width: MAP_WIDTH,
    height: mapHeight,
    source: 'geoBoundaries gbOpen BGD/ADM2 (CC-BY-4.0 / ODbL)',
    districtCount: districts.length,
    districts,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(output), 'utf8');

  console.log(`Wrote ${districts.length} districts -> ${OUT}`);
  console.log(`viewBox="${output.viewBox}"`);
  console.log(`File size: ${(fs.statSync(OUT).size / 1024).toFixed(1)} KB`);
  if (districts.length !== 64) {
    console.warn(`WARNING: expected 64 districts, got ${districts.length}.`);
  }
}

main();