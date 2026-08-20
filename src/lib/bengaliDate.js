// Helper utilities for converting English numbers to Bengali numerals
// and computing "days remaining" labels for job application deadlines.

const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Convert an English number to Bengali numerals.
 * e.g. 5 -> '৫', 10 -> '১০'
 */
export function toBengaliNumerals(num) {
  return num.toString().replace(/\d/g, (digit) => BANGLA_DIGITS[parseInt(digit)]);
}

/**
 * Compute the "days remaining" label and status for a job deadline.
 *
 * Returns { text, status } where status is one of:
 *  - "urgent"  : 0-3 days remaining (red/rose badge)
 *  - "normal"  : >3 days remaining (blue/emerald badge)
 *  - "expired" : deadline already passed (gray badge)
 *  - "unknown" : missing / unspecified deadline (gray badge)
 */
export function getDaysRemainingBengali(rawDeadline) {
  if (!rawDeadline || String(rawDeadline).toLowerCase().includes("not specified")) {
    return { text: "প্রযোজ্য নয়", status: "unknown" };
  }

  const deadline = new Date(rawDeadline);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: "মেয়াদ শেষ", status: "expired" };
  }
  if (diffDays === 0) {
    return { text: "আজই শেষ দিন", status: "urgent" };
  }

  const bnDays = toBengaliNumerals(diffDays);
  if (diffDays <= 3) {
    return { text: `${bnDays} দিন বাকি`, status: "urgent" };
  }

  return { text: `${bnDays} দিন বাকি`, status: "normal" };
}

// Tailwind color classes for each badge status.
export const badgeStyles = {
  urgent: "bg-rose-100 text-rose-700 border-rose-200",
  normal: "bg-emerald-100 text-emerald-700 border-emerald-200",
  expired: "bg-gray-100 text-gray-500 border-gray-200",
  unknown: "bg-gray-100 text-gray-600 border-gray-200",
};
