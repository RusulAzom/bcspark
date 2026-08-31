"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, BookOpen, Gamepad2, FileText, X, Sparkles } from "lucide-react";

// Global Advertisement Popup for BCSpark
// - Shows 5 seconds after page load
// - Only shows 1 time per Each hours per user (localStorage: "bcspark_popup_last_shown")
// - Force show for testing: append ?popup=force to the URL
// - Framer Motion fade-in + scale animation with backdrop blur
// - Close on X button or backdrop click

const POPUP_STORAGE_KEY = "bcspark_popup_last_shown";
const POPUP_DELAY_MS = 5000; // 5 seconds
const TWENTY_FOUR_HOURS_MS = 1 * 60 * 60 * 1000; // 1 hours

// Feature list items
const features = [
  {
    icon: Briefcase,
    title: "Job Circular",
    desc: "Sobar age sokol sorkari chakrir circular",
    href: "/job-circular",
    comingSoon: false,
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: FileText,
    title: "Recent Job Solutions",
    desc: "সাম্প্রতিক চাকরির প্রশ্ন সমাধান",
    href: "/job-solution",
    comingSoon: false,
    color: "bg-gray-100 text-gray-500",
  },
  {
    icon: BookOpen,
    title: "Subject Wise Learning and Testing",
    desc: "বিষয়ভিত্তিক শেখা এবং পরীক্ষা",
    href: "/study",
    href: null,
    comingSoon: true,
    color: "bg-gray-100 text-gray-500",
  },
  {
    icon: Gamepad2,
    title: "English Game Zone",
    desc: "ইংরেজি শেখার গেম",
    href: null,
    comingSoon: true,
    color: "bg-gray-100 text-gray-500",
  },
];

export default function AdvertisePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // For testing: ?popup=force in the URL bypasses the 24h localStorage check
    const forceShow = new URLSearchParams(window.location.search).get("popup") === "force";
    if (forceShow) {
      console.log("AdvertisePopup: Force-show activated via ?popup=force");
      localStorage.removeItem(POPUP_STORAGE_KEY);
    }

    // Check localStorage - only show if 24 hours have passed since last shown
    try {
      const lastShown = localStorage.getItem(POPUP_STORAGE_KEY);
      const now = Date.now();

      if (lastShown) {
        const lastShownTime = parseInt(lastShown, 10);
        const hoursSince = (now - lastShownTime) / (60 * 60 * 1000);
        console.log(`AdvertisePopup: last shown ${hoursSince.toFixed(1)} hours ago`);

        // If 24 hours haven't passed yet, don't show the popup
        if (now - lastShownTime < TWENTY_FOUR_HOURS_MS) {
          console.log("AdvertisePopup: Suppressed (within 24h lockout)");
          return;
        }
      } else {
        console.log("AdvertisePopup: No previous record - will show");
      }

      // Show popup after 5 seconds delay
      const timer = setTimeout(() => {
        console.log("AdvertisePopup: Showing popup now");
        setIsOpen(true);
        // Record that the popup was shown
        localStorage.setItem(POPUP_STORAGE_KEY, String(Date.now()));
        console.log("AdvertisePopup: Timestamp recorded in localStorage");
      }, POPUP_DELAY_MS);

      return () => clearTimeout(timer);
    } catch (error) {
      // localStorage might be unavailable (private mode etc.) - just show the popup
      console.error("AdvertisePopup localStorage error:", error);
      const timer = setTimeout(() => setIsOpen(true), POPUP_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    console.log("AdvertisePopup: Closed");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          // Backdrop with blur
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose} // Close on backdrop click
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            // Popup card with fade-in + scale animation
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking inside
            className="relative w-full max-w-[500px] overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Top gradient banner */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 px-6 py-5 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    <h2 className="text-lg font-bold sm:text-xl">
                      BCSpark New Features Update
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-blue-100">
                    নতুন ফিচার গুলো দেখে নিন 🎉
                  </p>
                </div>
                {/* Close button */}
                <button
                  onClick={handleClose}
                  aria-label="Close popup"
                  className="rounded-full bg-white/20 p-1.5 text-white transition-colors hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Feature list */}
            <div className="space-y-3 p-6 max-h-[50vh] overflow-y-auto">
              {features.map((feature) => {
                const Icon = feature.icon;
                const isDisabled = feature.comingSoon;

                return (
                  <div
                    key={feature.title}
                    className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                      isDisabled
                        ? "border-gray-200 bg-gray-50 opacity-60"
                        : "border-blue-200 bg-blue-50/50 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    {/* Icon */}
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${feature.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-gray-900">
                          {feature.title}
                        </h3>
                        {isDisabled && (
                          <span className="shrink-0 rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {feature.desc}
                      </p>
                    </div>

                    {/* Link / Disabled indicator */}
                    {feature.href ? (
                      <Link
                        href={feature.href}
                        onClick={handleClose}
                        className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                      >
                        দেখুন
                      </Link>
                    ) : (
                      <span className="shrink-0 rounded-lg bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-400 cursor-not-allowed">
                        Disabled
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 bg-gray-50 px-6 py-3 text-center">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} BCSpark — আপনার সফলতার সঙ্গী 🇧🇩
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}