'use client';

import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import mapData from '@/data/bdDistricts.json';
import styles from './bd-map.module.css';

const STORAGE_KEY = 'bdmap.visited.v1';
const TOTAL_DISTRICTS = mapData.districtCount || 64;

// Temporarily hides the right-hand details panel (photo feed, upload form and
// "Mark as visited" card) so the map can take the full page width. The panel
// markup is kept intact below, gated on this flag, so it can be switched back
// on by flipping this to `true`.
const SHOW_DETAILS_PANEL = false;

// Whitelist of real district names, used to discard junk from localStorage
// (hand-edited values, or names from an older/renamed dataset).
const VALID_NAMES = new Set(mapData.districts.map((d) => d.name));

// ---------------------------------------------------------------------------
// Visited-district store
//
// Backed by localStorage and read through useSyncExternalStore so that the
// server snapshot (always "nothing visited") and the client snapshot stay
// consistent -- reading localStorage during render would desync SSR and cause
// a hydration mismatch. Subscribers are notified on writes and on the
// cross-tab `storage` event, so two open tabs stay in sync.
// ---------------------------------------------------------------------------

const listeners = new Set();

function parseVisited(raw) {
  if (!raw) return new Set();
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((n) => typeof n === 'string' && VALID_NAMES.has(n)));
  } catch {
    return new Set();
  }
}

// Cached so getSnapshot returns a referentially stable value between renders;
// useSyncExternalStore requires this or it loops forever.
let cacheRaw;
let cacheSet = new Set();

function getSnapshot() {
  const raw = readRaw();
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    cacheSet = parseVisited(raw);
  }
  return cacheSet;
}

/** Server render / pre-hydration snapshot: nothing visited yet. */
function getServerSnapshot() {
  return cacheSet;
}

function readRaw() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function subscribe(callback) {
  listeners.add(callback);
  const onStorage = (event) => {
    // Only react to changes to our own key.
    if (event.key === null || event.key === STORAGE_KEY) callback();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', onStorage);
  };
}

/** Persists a new Set of visited district names and notifies subscribers. */
function writeVisited(nextSet) {
  let raw;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...nextSet]));
    raw = readRaw();
  } catch {
    // Storage unavailable (private mode / quota). Mirror the change into the
    // in-memory cache anyway so the UI still responds; it just won't survive
    // a reload. Reading back from storage would leave the cache stale and
    // make the toggle appear frozen.
    raw = JSON.stringify([...nextSet]);
  }
  cacheRaw = raw;
  cacheSet = parseVisited(raw);
  listeners.forEach((fn) => fn());
}

/**
 * Interactive Bangladesh district map + per-district photo feed.
 *
 * The map is a pure inline SVG built from statically generated path data
 * (see scripts/generateBdDistricts.js). No tile servers, no mapping libs.
 *
 * Photo uploads are handled entirely in the browser via FileReader and kept
 * in component state, so nothing is persisted server-side. Images are
 * downscaled before preview to avoid holding full-res bitmaps in RAM.
 */
/** Escape text for safe interpolation into SVG/XML markup. */
function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Palette shared by the on-screen map and the exported PNG, so the download
// matches what the user sees.
const COLORS = {
  bg: '#ffffff',
  visited: '#059669',
  unvisited: '#e5e7eb',
  border: '#ffffff',
  ink: '#1a365d',
  muted: '#475569',
  accent: '#059669',
};

/**
 * Builds a standalone, self-contained SVG string for the current map state.
 *
 * Deliberately does NOT serialise the live DOM: CSS-module class names mean a
 * cloned node would render unstyled once detached from the stylesheet. Instead
 * every visual property is inlined as a presentation attribute, so the SVG
 * rasterises correctly with no external CSS.
 */
function buildExportSvg(userName, visitedSet) {
  const mapW = mapData.width;
  const mapH = mapData.height;
  const banner = 132;
  const totalH = mapH + banner;
  const totalW = mapW;

  const paths = mapData.districts
    .map((d) => {
      const fill = visitedSet.has(d.name) ? COLORS.visited : COLORS.unvisited;
      return `<path d="${d.d}" fill="${fill}" fill-rule="evenodd" stroke="${COLORS.border}" stroke-width="0.7" stroke-linejoin="round"/>`;
    })
    .join('');

  // Label on every district. Visited districts are dark green (#059669), so
  // they get white text with a DARK halo; unvisited ones are light grey, so
  // they get dark text with a WHITE halo. A white halo on green text would
  // make the label vanish, so the stroke colour must flip with the fill.
  const labels = mapData.districts
    .map((d) => {
      const isVisited = visitedSet.has(d.name);
      const fill = isVisited ? '#ffffff' : '#0f172a';
      const halo = isVisited ? '#064e3b' : '#ffffff';
      const haloWidth = isVisited ? 2.8 : 3;
      const bnSize = 15;
      const enSize = 12;
      return (
        `<text x="${d.labelX}" y="${d.labelY - 3}" font-size="${bnSize}" ` +
        `font-weight="700" text-anchor="middle" fill="${fill}" ` +
        `paint-order="stroke" stroke="${halo}" stroke-width="${haloWidth}" ` +
        `stroke-linejoin="round" ` +
        `font-family="Segoe UI, Noto Sans Bengali, sans-serif">${escapeXml(d.nameBn)}</text>` +
        `<text x="${d.labelX}" y="${d.labelY + 13}" font-size="${enSize}" ` +
        `font-weight="600" text-anchor="middle" fill="${fill}" ` +
        `paint-order="stroke" stroke="${halo}" stroke-width="${haloWidth}" ` +
        `stroke-linejoin="round" ` +
        `font-family="Segoe UI, Arial, sans-serif">${escapeXml(d.name)}</text>`
      );
    })
    .join('');

  const count = visitedSet.size;
  const pct = Math.round((count / TOTAL_DISTRICTS) * 100);

  // Intrinsic size is the natural viewBox size; svgStringToPngBlob then applies
  // the single 2x export scale. Setting width/height to totalW*2 here as well
  // would compound into a 4000px-wide, ~99MB canvas.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
<rect width="${totalW}" height="${totalH}" fill="${COLORS.bg}"/>
<text x="${totalW / 2}" y="52" text-anchor="middle" font-size="30" font-weight="700" fill="${COLORS.ink}" font-family="Segoe UI, Noto Sans Bengali, sans-serif">${escapeXml(userName)}&#8217;s Bangladesh Map</text>
<text x="${totalW / 2}" y="86" text-anchor="middle" font-size="19" font-weight="600" fill="${COLORS.accent}" font-family="Segoe UI, sans-serif">${count} / ${TOTAL_DISTRICTS} districts &#183; ${pct}% covered</text>
<text x="${totalW / 2}" y="110" text-anchor="middle" font-size="13" fill="${COLORS.muted}" font-family="Segoe UI, sans-serif">Map data: geoBoundaries (ODbL)</text>
<g transform="translate(0 ${banner})">${paths}${labels}</g>
</svg>`;
}

// Hard ceiling on exported pixels. Browsers silently produce a blank canvas
// above roughly this size, so clamp the scale rather than risk an empty PNG.
const MAX_EXPORT_PIXELS = 16e6;

/** Rasterises an SVG string to a PNG Blob via an Image + canvas round-trip. */
function svgStringToPngBlob(svgString, scale = 2) {
  return new Promise((resolve, reject) => {
    // A Blob URL (not a data: URL) keeps very large SVGs out of URL length limits.
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      try {
        let w = img.width || 1;
        let h = img.height || 1;
        // Clamp the requested scale if it would exceed the pixel budget.
        if (w * h * scale * scale > MAX_EXPORT_PIXELS) {
          scale = Math.max(1, Math.sqrt(MAX_EXPORT_PIXELS / (w * h)));
        }
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(w * scale);
        canvas.height = Math.round(h * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas is unavailable in this browser.');
        // SVG backgrounds are transparent; paint white first so PNGs aren't
        // transparent where the map is unpainted.
        ctx.fillStyle = COLORS.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((out) => {
          URL.revokeObjectURL(url);
          if (out) resolve(out);
          else reject(new Error('Could not encode the image.'));
        }, 'image/png');
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not render the map image.'));
    };

    img.src = url;
  });
}

/** Triggers a browser download for a Blob. */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Give the browser a moment to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Makes a filename safe for all platforms. */
function slugify(value) {
  return (
    value
      .trim()
      .replace(/[^a-zA-Z0-9\u0980-\u09FF]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'my'
  );
}

export default function BdMapClient() {
  const [selected, setSelected] = useState('Dhaka');
  const [hovered, setHovered] = useState(null);
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  // Visited districts, subscribed to the localStorage-backed store above.
  const visited = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const fileRef = useRef(null);
  const nextId = useRef(0);

  // Download-modal state.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadName, setDownloadName] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const modalInputRef = useRef(null);

  const districts = mapData.districts;

  const toggleVisited = useCallback((districtName) => {
    const next = new Set(visited);
    if (next.has(districtName)) next.delete(districtName);
    else next.add(districtName);
    writeVisited(next);
  }, [visited]);

  const markVisited = useCallback(
    (districtName) => {
      if (visited.has(districtName)) return;
      const next = new Set(visited);
      next.add(districtName);
      writeVisited(next);
    },
    [visited]
  );

  const visitedCount = visited.size;
  const coveragePct = Math.round((visitedCount / TOTAL_DISTRICTS) * 100);

  const activeName = hovered || selected;
  const activeDistrict = useMemo(
    () => districts.find((d) => d.name === activeName),
    [districts, activeName]
  );
  const isSelectedVisited = visited.has(selected);

  const visiblePosts = useMemo(
    () => posts.filter((p) => p.district === selected),
    [posts, selected]
  );

  /** Read + downscale the chosen image into a data URL. */
  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Could not read that file.'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('That file is not a valid image.'));
        img.onload = () => {
          // Cap the long edge at 720px. Preview only -- keeps memory sane.
          const MAX = 720;
          let { width, height } = img;
          if (Math.max(width, height) > MAX) {
            const ratio = MAX / Math.max(width, height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Your browser blocked image processing.'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name.');
      return;
    }

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError('Please choose a photo to upload.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Only image files are accepted.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Photo must be 10 MB or smaller.');
      return;
    }

    let dataUrl;
    try {
      dataUrl = await readFileAsDataUrl(file);
    } catch (err) {
      setError(err.message || 'Could not process that photo.');
      return;
    }

    setPosts((prev) => [
      {
        id: `post-${nextId.current++}`,
        district: selected,
        author: trimmed,
        image: dataUrl,
        createdAt: Date.now(),
      },
      ...prev,
    ]);

    // Uploading a photo for a district counts as visiting it.
    markVisited(selected);

    setName('');
    if (fileRef.current) fileRef.current.value = '';
  }

  const handleKeyDown = (event, districtName) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelected(districtName);
    }
  };

  // --- Download modal ---

  function openModal() {
    setExportError('');
    setIsModalOpen(true);
  }

  function closeModal() {
    // Don't let a close interrupt an in-flight export.
    if (isExporting) return;
    setIsModalOpen(false);
    setExportError('');
  }

  function handleModalKeyDown(event) {
    if (event.key === 'Escape') closeModal();
  }

  async function handleDownload(event) {
    event.preventDefault();
    const trimmed = downloadName.trim();
    if (!trimmed) {
      setExportError('Please enter your name.');
      return;
    }

    setIsExporting(true);
    setExportError('');
    try {
      const svg = buildExportSvg(trimmed, visited);
      const blob = await svgStringToPngBlob(svg, 2);
      downloadBlob(blob, `${slugify(trimmed)}-bangladesh-map.png`);
      // Close only after the download has actually been triggered.
      setIsModalOpen(false);
      setDownloadName('');
    } catch (err) {
      setExportError(err.message || 'Could not generate the map image.');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className={styles.wrap}>
      {/* ---------------- Left: SVG map ---------------- */}
      <section className={styles.mapPane} aria-label="Bangladesh district map">
        <div className={styles.mapHead}>
          <h2 className={styles.mapTitle}>Travel Tracker</h2>
          <div className={styles.headRight}>
            <p className={styles.counter} aria-live="polite">
              <span>{visitedCount}</span>
              <span className={styles.counterTotal}>/ {TOTAL_DISTRICTS}</span>
            </p>
            <button
              type="button"
              className={styles.downloadBtn}
              onClick={openModal}
            >
              Download Map
            </button>
          </div>
        </div>

        <svg
          className={styles.map}
          viewBox={mapData.viewBox}
          role="img"
          aria-label="Map of Bangladesh by district"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* All 64 districts. Even-odd fill punches holes for inland lakes. */}
          <g className={styles.districts}>
            {districts.map((district) => (
              <path
                key={district.name}
                d={district.d}
                data-district={district.name}
                data-visited={visited.has(district.name) ? 'true' : 'false'}
                className={[
                  styles.district,
                  visited.has(district.name) ? styles.isVisited : '',
                  selected === district.name ? styles.isActive : '',
                  hovered === district.name ? styles.isHovered : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                tabIndex={0}
                role="button"
                aria-pressed={selected === district.name}
                aria-label={`${district.name} district${
                  visited.has(district.name) ? ' (visited)' : ''
                }`}
                onMouseEnter={() => setHovered(district.name)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(district.name)}
                onBlur={() => setHovered(null)}
                onClick={() => setSelected(district.name)}
                onKeyDown={(e) => handleKeyDown(e, district.name)}
              />
            ))}
          </g>

          {/* All 64 district labels are always rendered. Rendered after the paths so
              they sit on top, and pointer-events:none so they never block a
              district click. Text colour flips with the district state so it
              stays legible on both the light and dark fills. */}
          <g className={styles.labels} aria-hidden="true">
            {districts.map((district) => {
              const isVisited = visited.has(district.name);
              return (
                <g
                  key={`label-${district.name}`}
                  className={[
                    styles.labelGroup,
                    isVisited ? styles.labelOnVisited : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <text
                    className={`${styles.label} ${styles.labelBn}`}
                    x={district.labelX}
                    y={district.labelY - 3}
                  >
                    {district.nameBn}
                  </text>
                  <text
                    className={styles.label}
                    x={district.labelX}
                    y={district.labelY + 13}
                  >
                    {district.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        <p className={styles.legend}>
          <span className={styles.legendItem}>
            <span
              className={`${styles.legendSwatch} ${styles.legendVisited}`}
            />
            Visited
          </span>
          <span className={styles.legendItem}>
            <span
              className={`${styles.legendSwatch} ${styles.legendUnvisited}`}
            />
            Not visited
          </span>
        </p>

        {/* Coverage progress bar */}
        <div className={styles.progress}>
          <div className={styles.progressTop}>
            <span>Bangladesh Covered</span>
            <span className={styles.progressPct}>{coveragePct}%</span>
          </div>
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={TOTAL_DISTRICTS}
            aria-valuenow={visitedCount}
            aria-label="Districts visited"
          >
            <div
              className={styles.progressBar}
              style={{ width: `${coveragePct}%` }}
            />
          </div>
        </div>

        <p className={styles.hint}>
          Click a district to view its photos. Map data: geoBoundaries (ODbL).
        </p>
      </section>

      {/* ---------------- Right: district feed ---------------- */}
      {/* Hidden for now (see SHOW_DETAILS_PANEL); markup preserved below. */}
      {SHOW_DETAILS_PANEL && (
      <section className={styles.feedPane} aria-label="District photo feed">
        <header className={styles.feedHeader}>
          <p className={styles.feedKicker}>Selected district</p>
          <h2 className={styles.feedTitle}>
            {activeDistrict ? activeDistrict.name : 'Select a district'}
          </h2>
          {activeDistrict && (
            <p className={styles.feedSub}>{activeDistrict.nameBn}</p>
          )}
        </header>

        {/* Toggle visited status without uploading a photo */}
        <label className={styles.visitedToggle}>
          <input
            type="checkbox"
            className={styles.visitedCheckbox}
            checked={isSelectedVisited}
            onChange={() => toggleVisited(selected)}
          />
          <span>Mark as Visited</span>
          {isSelectedVisited && (
            <span className={styles.visitedBadge}>Visited</span>
          )}
        </label>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <input
              type="text"
              className={styles.input}
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              aria-label="Your name"
            />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className={styles.file}
              aria-label="Upload photo"
            />
          </div>
          <button type="submit" className={styles.submit}>
            Submit
          </button>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </form>

        <div className={styles.feed}>
          {visiblePosts.length === 0 ? (
            <p className={styles.empty}>
              No photos for {activeDistrict ? activeDistrict.name : 'this district'} yet.
              <br />
              Be the first to upload one.
            </p>
          ) : (
            visiblePosts.map((post) => (
              <article className={styles.card} key={post.id}>
                <div className={styles.cardHead}>
                  <span className={styles.avatar} aria-hidden="true">
                    {post.author.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className={styles.author}>{post.author}</p>
                    <p className={styles.cardMeta}>
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {/* User-supplied blob data URLs. next/image cannot optimize
                    runtime data: URLs, so a plain <img> is correct here. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.cardImg}
                  src={post.image}
                  alt={`Photo shared by ${post.author}`}
                />
              </article>
            ))
          )}
        </div>
      </section>
      )}

      {/* ---------------- Download modal ---------------- */}
      {isModalOpen && (
        <div
          className={styles.modalOverlay}
          onKeyDown={handleModalKeyDown}
          role="presentation"
        >
          {/* Backdrop: clicking outside the card closes the modal. */}
          <div
            className={styles.modalBackdrop}
            onClick={closeModal}
            aria-hidden="true"
          />
          <div
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bd-map-download-title"
          >
            <div className={styles.modalHead}>
              <h3 className={styles.modalTitle} id="bd-map-download-title">
                Download Your Map
              </h3>
              <button
                type="button"
                className={styles.modalClose}
                onClick={closeModal}
                disabled={isExporting}
                aria-label="Close dialog"
              >
                &times;
              </button>
            </div>

            <p className={styles.modalBody}>
              Enter your name to personalise the map, then download it as a
              PNG. {visitedCount} of {TOTAL_DISTRICTS} districts ({coveragePct}%)
              are currently marked as visited.
            </p>

            <form className={styles.modalForm} onSubmit={handleDownload}>
              <label className={styles.modalLabel} htmlFor="bd-map-download-name">
                Enter Your Name
              </label>
              <input
                id="bd-map-download-name"
                ref={modalInputRef}
                type="text"
                className={styles.modalInput}
                placeholder="e.g. Rahim Uddin"
                value={downloadName}
                onChange={(e) => setDownloadName(e.target.value)}
                maxLength={40}
                autoComplete="name"
                autoFocus
              />
              {exportError && (
                <p className={styles.modalError} role="alert">
                  {exportError}
                </p>
              )}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalCancel}
                  onClick={closeModal}
                  disabled={isExporting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.modalSubmit}
                  disabled={isExporting}
                >
                  {isExporting ? 'Preparing…' : 'Download PNG'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}