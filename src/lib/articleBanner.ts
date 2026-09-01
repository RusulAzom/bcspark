// src/lib/articleBanner.ts
// Server-side helpers for inserting the support banner into a blog article body
// at a SAFE top-level block boundary. It never inserts inside a paragraph,
// heading, list, blockquote, code block or table.
//
// The primary content source is Tiptap HTML (`contentHtml`), which we split with
// jsdom (already part of the project's server stack — see next.config.mjs
// `serverExternalPackages`). A conservative, fence-aware splitter is used for the
// legacy Markdown fallback.
//
// Returns an object describing the two article halves and whether the article is
// long enough to deserve a middle banner (short posts → only the end banner).

import { JSDOM } from "jsdom";

export interface ArticleSplitResult {
  /** First half of the content (same format as the input). */
  before: string | null;
  /** Second half of the content (same format as the input). */
  after: string | null;
  /** Whether a middle banner should be shown. */
  showMiddle: boolean;
}

// An article needs at least these to get a middle banner (short posts only get
// the end banner, per product requirements).
const MIN_BLOCKS = 6;
const MIN_WORDS = 500;

function countWords(text: string): number {
  const tokens = text.match(/[\p{L}\p{N}]+/gu);
  return tokens ? tokens.length : 0;
}

function noSplit(content: string): ArticleSplitResult {
  return { before: content, after: null, showMiddle: false };
}

// ---------------------------------------------------------------------------
// HTML path (primary) — split top-level blocks with a real DOM parser.
// ---------------------------------------------------------------------------
function splitHtml(html: string): ArticleSplitResult {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const body = doc.body;

  let container: Element = body;

  // If the whole document is wrapped in a single generic container, operate on
  // its top-level children so we can split inside it and re-wrap each half to
  // preserve the wrapper's attributes (e.g. class).
  const bodyChildren = Array.from(body.children) as Element[];
  if (
    bodyChildren.length === 1 &&
    ["DIV", "SECTION", "ARTICLE", "MAIN"].includes(bodyChildren[0].tagName) &&
    bodyChildren[0].children.length > 0
  ) {
    container = bodyChildren[0];
  }

  const blocks = Array.from(container.children) as Element[];
  const n = blocks.length;
  const totalWords = countWords(dom.window.document.body.textContent || "");

  if (n < MIN_BLOCKS || totalWords < MIN_WORDS) return noSplit(html);

  // Choose the middle split, preferring a boundary right after a paragraph.
  let lo = Math.max(1, Math.round(n * 0.45));
  let hi = Math.min(n - 1, Math.round(n * 0.6));
  if (lo > hi) lo = hi = Math.round(n * 0.5);
  if (lo < 1) lo = 1;
  if (hi >= n) hi = n - 1;
  if (lo >= n || hi < 1 || lo > hi) return noSplit(html);

  let idx = Math.round(n * 0.5);
  for (let i = lo; i <= hi; i += 1) {
    if (blocks[i - 1] && blocks[i - 1].tagName === "P") {
      idx = i;
      break;
    }
  }
  idx = Math.max(1, Math.min(idx, n - 1));
  if (idx < 1 || idx >= n) return noSplit(html);

  const tag = container.tagName;
  const attrs = Array.from(container.attributes)
    .map((a) => ` ${a.name}="${String(a.value).replace(/"/g, "&quot;")}"`)
    .join("");

  // If we unwrapped a single wrapper, re-wrap each half so styling is preserved.
  const serializeHalf = (list: Element[]): string => {
    const inner = list.map((b) => b.outerHTML).join("");
    return container !== body ? `<${tag}${attrs}>${inner}</${tag}>` : inner;
  };

  return {
    before: serializeHalf(blocks.slice(0, idx)),
    after: serializeHalf(blocks.slice(idx)),
    showMiddle: true,
  };
}
// ---------------------------------------------------------------------------
// Markdown path (legacy fallback) — conservative fence-aware splitter.
// ---------------------------------------------------------------------------
const FENCE_RE = /^\s*(```+|~~~+)\s*$/;
const HEADING_RE = /^\s{0,3}#{1,6}\s+/;
const LIST_RE = /^\s{0,3}([-*+]|\d{1,7}[.)])\s+/;
const QUOTE_RE = /^\s{0,3}>\s?/;
const HR_RE = /^\s{0,3}((?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})/;
const INDENTED_CODE_RE = /^\s{4,}\S/;

/** True when a top-level block is a plain paragraph or heading (safe to end right after). */
function isPlainBlock(line: string): boolean {
  const t = line.trim();
  if (!t) return false;
  if (FENCE_RE.test(line)) return false;
  if (HEADING_RE.test(line)) return true;
  if (QUOTE_RE.test(line)) return false;
  if (LIST_RE.test(line)) return false;
  if (HR_RE.test(line)) return false;
  if (INDENTED_CODE_RE.test(line)) return false;
  return true;
}

function splitMarkdown(md: string): ArticleSplitResult {
  const lines = md.split(/\r?\n/);
  const n = lines.length;
  if (n < 2) return noSplit(md);

  // Words — strip code fences and heavy punctuation for a fair estimate.
  const plain = md.replace(/```[\s\S]*?```/g, " ").replace(/[#*`>\[\]()!~_\-|]/g, " ");
  const totalWords = countWords(plain);

  // Mark lines that are inside fenced code.
  const inFence: boolean[] = new Array(n).fill(false);
  let fenceOpen = false;
  let fenceMarker = "";
  for (let i = 0; i < n; i += 1) {
    const t = lines[i].trim();
    const f = FENCE_RE.exec(t);
    if (f) {
      if (!fenceOpen) {
        fenceOpen = true;
        fenceMarker = f[1].charAt(0);
      } else if (t.indexOf(fenceMarker) === 0 && /^[`~]+$/.test(t.replace(fenceMarker, "###"))) {
        fenceOpen = false;
      }
      inFence[i] = true;
      continue;
    }
    if (fenceOpen) inFence[i] = true;
  }

  // Count top-level blocks (for the short-post check).
  let blockCount = 0;
  let prevBlank = true;
  for (let i = 0; i < n; i += 1) {
    const isBlank = lines[i].trim() === "" || inFence[i];
    if (!isBlank && prevBlank) blockCount += 1;
    prevBlank = isBlank;
  }

  if (blockCount < MIN_BLOCKS || totalWords < MIN_WORDS) return noSplit(md);

  // Find safe blank-line split boundaries and pick the one nearest the middle.
  let bestIdx = -1;
  let bestDist = Infinity;
  for (let k = 0; k < n; k += 1) {
    if (lines[k].trim() !== "" || inFence[k]) continue; // must be a blank line
    // walk back to the previous non-blank line
    let p = k - 1;
    while (p >= 0 && (lines[p].trim() === "" || inFence[p])) p -= 1;
    let q = k + 1;
    while (q < n && (lines[q].trim() === "" || inFence[q])) q += 1;
    if (p < 0 || q >= n) continue;
    if (!isPlainBlock(lines[p]) || !isPlainBlock(lines[q])) continue;
    const dist = Math.abs(k - n / 2);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = k;
    }
  }

  if (bestIdx < 0) return noSplit(md);

  return {
    before: lines.slice(0, bestIdx).join("\n"),
    after: lines.slice(bestIdx + 1).join("\n"),
    showMiddle: true,
  };
}

/**
 * Compute the article split for the content actually being rendered.
 * Pass the source for the format in use:
 *  - html: the `contentHtml` value
 *  - markdown: the `content` value
 */
export function computeArticleSplit(input: {
  html?: string | null;
  markdown?: string | null;
}): ArticleSplitResult {
  if (input.html && input.html.trim()) {
    return splitHtml(input.html);
  }
  if (input.markdown && input.markdown.trim()) {
    return splitMarkdown(input.markdown);
  }
  return { before: null, after: null, showMiddle: false };
}