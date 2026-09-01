"use client";

import { useLayoutEffect, useRef } from "react";
import { ArrowRight, Coffee, Gift, Heart } from "lucide-react";

/**
 * SupportBanner
 * -------------
 * A text-based "digital banner" built entirely from JSX + Tailwind CSS. It mimics
 * a premium  digital advertisement WITHOUT any image / canvas / SVG screenshot.
 *
 * Responsive strategy (TWO compositions, ONE component):
 *  - Desktop (md+):  728×100 horizontal promotional banner. A fixed design canvas
 *    is uniformly scaled via CSS transform to fill its container, so it always
 *    keeps a faithful, image-like horizontal composition.
 *  - Mobile (<md):    300×250 vertical digital advertisement. A purpose-built
 *    fluid composition (badge → headline → support copy → CTA → url) that is NOT
 *    a squashed desktop banner.
 *
 * Both share the same campaign identity: background, gold accent, typeface, badge,
 * CTA style, messaging and support URL. Zero image assets are loaded.
 */

const SUPPORT_URL = "https://www.supportkori.com/rasumon";
const DESIGN_WIDTH = 728;
const DESIGN_HEIGHT = 100;
const ARIAL_LABEL =
  "একটা কফির দামে প্রজেক্টটা বাঁচিয়ে রাখুন — এখনই সাপোর্ট করুন (supportkori.com/rasumon)";

const FAMILY =
  "var(--font-hind-siliguri), 'Hind Siliguri', 'Noto Sans Bengali', -apple-system, 'Segoe UI', sans-serif";

/** Shared graphic background — layered radial glows + a linear navy grade. */
const BG_CSS = [
  "radial-gradient(560px 260px at 82% -30%, rgba(129,58,196,0.50), transparent 62%)",
  "radial-gradient(520px 240px at 4% 140%, rgba(42,71,150,0.55), transparent 62%)",
  "radial-gradient(300px 190px at 76% 130%, rgba(245,181,27,0.18), transparent 70%)",
  "linear-gradient(118deg, #10142c 0%, #17183d 46%, #0e1630 100%)",
].join(", ");

interface SupportBannerProps {
  className?: string;
}

export default function SupportBanner({ className = "" }: SupportBannerProps) {
  const desktopRef = useRef<HTMLAnchorElement | null>(null);

  // Uniformly scale the fixed desktop canvas to match its column width (image-like
  // fidelity on desktop/tablet). Applied in a layout effect (no hydration mismatch)
  // and kept in sync via ResizeObserver. The wrapper reserves aspect-ratio 728/100,
  // so there is no layout shift.
  useLayoutEffect(() => {
    const canvas = desktopRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement as HTMLElement | null;
    if (!parent) return;

    const applyScale = () => {
      canvas.style.transform = `scale(${parent.clientWidth / DESIGN_WIDTH})`;
    };
    applyScale();

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => applyScale())
        : null;
    observer?.observe(parent);
    return () => observer?.disconnect();
  }, []);

  return (
    <div
      className={`group w-full select-none ${className}`}
      style={{ fontFamily: FAMILY }}
    >
      {/* ============================================================= */}
      {/* DESKTOP — horizontal 728×100 banner (md and above)            */}
      {/* ============================================================= */}
      <div
        className="relative mx-auto hidden w-full max-w-[728px] overflow-hidden rounded-xl md:block lg:rounded-2xl"
        style={{ aspectRatio: `${DESIGN_WIDTH} / ${DESIGN_HEIGHT}`, boxShadow: "0 14px 34px -18px rgba(9,14,38,0.85)" }}
      >
        {/* Whole banner is the interactive link */}
        <a
          ref={desktopRef}
          href={SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ARIAL_LABEL}
          className="absolute left-0 top-0 flex origin-top-left items-center rounded-xl text-left focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-300 transition-[filter] duration-300 hover:brightness-110"
          style={{ width: DESIGN_WIDTH, height: DESIGN_HEIGHT }}
        >
{/* Background art layer */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: BG_CSS }}
          />
          {/* inner top highlight + left accent */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-amber-300/70 via-amber-300/25 to-transparent" />
          {/* tiny decorative dots */}
          <div className="pointer-events-none absolute left-[46%] top-2.5 h-1.5 w-1.5 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute left-[34%] bottom-5 h-1 w-1 rounded-full bg-white/[0.07]" />
          <div className="pointer-events-none absolute left-[53%] bottom-4 h-[3px] w-[3px] rounded-full bg-amber-300/25" />

          {/* Foreground layout */}
          <div className="relative z-10 flex h-full w-full items-center justify-between pl-5 pr-6">
            {/* LEFT — badge + headline */}
            <div className="shrink-0" style={{ width: 264 }}>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[9.5px] font-semibold text-amber-200 ring-1 ring-inset ring-white/10">
                <Heart className="h-3 w-3 fill-current text-rose-400" />
                আমাদের সাপোর্ট করুন
              </span>
              <h2 className="mt-1.5 text-[15px] font-extrabold leading-[1.12] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.4)]">
                <span className="flex items-center">
                  একটা
                  <span className="mx-1 inline-flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-inset ring-white/15">
                    <Coffee className="h-3 w-3 text-amber-300" />
                  </span>
                  কফির দামে
                </span>
                <span>
                  প্রজেক্টটা <span className="text-amber-300">বাঁচিয়ে</span> রাখুন
                </span>
              </h2>
            </div>

            {/* separator */}
            <div className="h-16 w-px shrink-0 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            {/* MIDDLE — explanation + highlighted amounts */}
            <div className="shrink-0" style={{ width: 244 }}>
              <p className="text-[10.5px] leading-[1.45] text-slate-300">
                সার্ভার, ডোমেইন আর টুলসের খরচ আছে।
                <span className="mt-0.5 block font-bold text-amber-300">
                  এককালীন ২০, ৫০, ১২০ টাকা
                </span>
                দিয়েও আমাদের সাপোর্ট করতে পারেন।
              </p>
              <p className="mt-1.5 flex items-center gap-1 text-[9.5px] font-medium text-slate-400">
                <Gift className="h-3 w-3 shrink-0 text-amber-300" />
                আপনার সাপোর্ট = আমাদের মোটিভেশন!
              </p>
            </div>

            {/* separator */}
            <div className="h-16 w-px shrink-0 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            {/* RIGHT — CTA + url */}
            <div className="shrink-0 text-right" style={{ width: 168 }}>
              <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-b from-[#f6c34a] to-[#e9a517] px-3 py-1.5 text-[11px] font-extrabold text-[#3a2603] shadow-[0_8px_18px_-8px_rgba(245,181,27,0.65)] ring-1 ring-inset ring-white/30 transition-transform duration-150 group-hover:-translate-y-0.5">
                এখনই সাপোর্ট করুন
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <p className="mt-1 text-[8.5px] font-medium tracking-wide text-slate-400">
                supportkori.com/rasumon
              </p>
            </div>
          </div>
        </a>
      </div>
{/* ============================================================= */}
      {/* MOBILE — vertical ad, AUTO height (below md)                  */}
      {/* ============================================================= */}
      {/* Width is capped at the 300×250-style target but height is     */}
      {/* content-driven (auto) so the CTA is never clipped.            */}
      <div
        className="relative mx-auto w-full max-w-[300px] overflow-hidden rounded-xl md:hidden lg:rounded-2xl"
        style={{ boxShadow: "0 16px 40px -20px rgba(9,14,38,0.9)" }}
      >
        {/* Whole banner is the interactive link — normal document flow,
            auto height determined by its content. */}
        <a
          href={SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ARIAL_LABEL}
          className="relative flex flex-col items-center overflow-hidden rounded-xl px-4 py-5 text-center focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-300 transition-[filter] duration-300 active:brightness-110"
        >
          {/* Background art layer (absolute fill within the auto-height anchor) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: BG_CSS }}
          />
          {/* inner top highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="relative z-10 flex w-full flex-col items-center text-center">
            {/* 1. Badge */}
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-amber-200 ring-1 ring-inset ring-white/10">
              <Heart className="h-3.5 w-3.5 fill-current text-rose-400" />
              আমাদের সাপোর্ট করুন
            </span>

            {/* 2. Headline — the dominant visual */}
            <h2 className="mt-3 text-[22px] font-extrabold leading-[1.16] text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.45)]">
              <span className="flex items-center justify-center">
                একটা
                <span className="mx-1.5 inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-inset ring-white/15">
                  <Coffee className="h-4 w-4 text-amber-300" />
                </span>
                কফির দামে
              </span>
              <span>
                প্রজেক্টটা <span className="text-amber-300">বাঁচিয়ে</span> রাখুন
              </span>
            </h2>

            {/* 3. Divider */}
            <div className="my-3.5 h-px w-24 bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            {/* 4. Short explanation */}
            <p className="text-[12.5px] leading-[1.55] text-slate-300">
              এই প্রজেক্টটা চালাতে সার্ভার,
              <br />
              ডোমেইন ও অন্যান্য খরচ আছে।
            </p>

            {/* 5. One-time support amounts (gold highlight) */}
            <p className="mt-2 text-[12.5px] leading-[1.55] text-slate-300">
              <span className="font-extrabold text-amber-300">এককালীন ২০, ৫০, ১২০ টাকা</span>
              <br />
              দিয়েও সাপোর্ট করতে পারেন।
            </p>

            {/* 6. CTA — large touch target */}
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-[#f6c34a] to-[#e9a517] px-6 py-3 text-[15px] font-extrabold text-[#3a2603] shadow-[0_10px_24px_-10px_rgba(245,181,27,0.75)] ring-1 ring-inset ring-white/30 transition-transform duration-150 group-hover:-translate-y-0.5">
              এখনই সাপোর্ট করুন
              <ArrowRight className="h-4 w-4" />
            </span>

            {/* 7. URL — secondary */}
            <p className="mt-2.5 text-[10px] font-medium tracking-wide text-slate-400">
              supportkori.com/rasumon
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}