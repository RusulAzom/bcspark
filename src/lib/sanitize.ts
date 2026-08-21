// src/lib/sanitize.ts
// Server-safe HTML sanitization helper - re-exports client-side implementation
// This module is server-safe and delegates to the client-side implementation.
// It provides a consistent API for the rich text editor and other components.

import { sanitizeHtml } from "./sanitize-html-client";

export { sanitizeHtml };
