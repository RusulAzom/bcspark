// src/lib/formatBengaliNumber.ts
// Convert an English number into Bengali numerals with thousands separators.
// e.g. 1250 -> "১,২৫০"

const BANGLA_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/**
 * Format a number as a Bengali-numeral, comma-grouped string.
 * - 0    -> "০"
 * - 1250 -> "১,২৫০"
 * - 12500-> "১২,৫০০"
 */
export function formatBengaliNumber(value: number | null | undefined): string {
  const num = Math.floor(Number(value) || 0);
  const negative = num < 0 ? "-" : "";
  const abs = Math.abs(num).toString();

  // Group digits in threes (standard Arabic/Bengali 1,250 style grouping).
  const grouped = abs.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const translated = grouped.replace(/\d/g, (d) => BANGLA_DIGITS[Number(d)]);
  return negative + translated;
}