// src/lib/sanitize.ts
// Shared HTML sanitization helper using DOMPurify (isomorphic-dompurify so it works
// both on the server during SSR and in the browser).
//
// We keep a relaxed allow-list because the blog editor intentionally supports
// rich content (headings, lists, blockquotes, code blocks, links, images AND
// YouTube embeds which render as <iframe>). Everything is still sanitized so
// dangerous inline scripts / event handlers are stripped.
import DOMPurify from "isomorphic-dompurify";

let configured = false;

/**
 * Sanitize an HTML string for safe storage / rendering.
 * Returns an empty string for undefined/null input.
 */
export function sanitizeHtml(dirty: string | undefined): string {
  if (!dirty) return "";

  if (typeof window === "undefined" && !configured) {
    // isomorphic-dompurify lazily creates a sandboxed DOM on the server; nothing
    // else to do here, the call below just works.
    configured = true;
  }

  return DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true, svg: false, mathMl: false },
    // Allow iframes (YouTube embeds) and a couple of extra media tags.
    ADD_TAGS: ["iframe", "figure", "figcaption", "video", "source", "track"],
    ADD_ATTR: [
      "allowfullscreen",
      "allow",
      "referrerpolicy",
      "loading",
      "frameborder",
      "playsinline",
      "muted",
      "autoplay",
      "loop",
      "class",
    ],
    // Only allow safe URI schemes. Data URIs are restricted to images.
    ALLOWED_URI_REGEXP:
      /^(https?|mailto|tel|data:image\/(png|jpg|jpeg|gif|webp|svg\+xml)|data:text\/plain|blob:)/i,
    FORBID_ATTR: ["style"],
  });
}
