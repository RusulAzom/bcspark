// src/lib/sanitize-html-client.ts
// Client-side DOMPurify implementation for the rich text editor
// This module provides HTML sanitization functionality for the browser only.
// It should only be imported from client components, not server components.

import DOMPurify from "isomorphic-dompurify";

let configured = false;

/**
 * Sanitize an HTML string for safe storage / rendering.
 * Returns an empty string for undefined/null input.
 * 
 * This is the client-side implementation that should only be used in the browser.
 * For server-side operations, use the re-exported version from sanitize.ts
 * which properly handles the isomorphic-dompurify dependencies via serverExternalPackages.
 */
export function sanitizeHtml(dirty: string | undefined): string {
  if (!dirty) return "";

  if (typeof window === "undefined" && !configured) {
    configured = true;
  }

  return DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true, svg: false, mathMl: false },
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
    ALLOWED_URI_REGEXP:
      /^(https?|mailto|tel|data:image\/(png|jpg|jpeg|gif|webp|svg\+xml)|data:text\/plain|blob:)/i,
    FORBID_ATTR: ["style"],
  });
}