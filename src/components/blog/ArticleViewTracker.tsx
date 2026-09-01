// src/components/blog/ArticleViewTracker.tsx
// Tiny client component that fires once on mount (only on the article detail
// page) to record a view via the trackArticleView server action. Wrapped in
// try/catch so a tracking failure never breaks the article load.
"use client";

import { useEffect, useRef } from "react";
import { trackArticleView } from "@/app/actions/trackView";

export default function ArticleViewTracker({ slug }: { slug: string }) {
  // Guard against React StrictMode double-invoking effects in development.
  const fired = useRef(false);

  useEffect(() => {
    if (!slug || fired.current) return;
    fired.current = true;

    trackArticleView(slug).catch(() => {
      // Swallow — reading the article must never be interrupted.
    });
  }, [slug]);

  return null;
}