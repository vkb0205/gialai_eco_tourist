/**
 * Shared text helpers for the tour catalogue.
 *
 * Vietnamese text needs two things the platform does not give us for free:
 * a diacritic fold that also handles `đ`, and a đồng formatter matching the
 * `2.400.000đ` presentation already used on the landing page.
 */

/**
 * Fold a Vietnamese string to a lowercase, diacritic-free form suitable for
 * loose keyword matching.
 *
 * `String.normalize("NFD")` decomposes most Vietnamese vowels into a base
 * letter plus combining marks, which the regex below strips. It does NOT
 * decompose `đ` / `Đ` (U+0111 / U+0110), because those are distinct letters
 * rather than a composed `d` — so they are mapped explicitly first.
 */
export function foldDiacritics(value: string): string {
  return value
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

/**
 * Normalise a search term or haystack for comparison: folded, with runs of
 * whitespace collapsed and the edges trimmed.
 */
export function normalizeForSearch(value: string): string {
  return foldDiacritics(value).replace(/\s+/g, " ").trim()
}

/**
 * Format a đồng amount using the site's existing convention: dot-grouped
 * thousands with a trailing `đ`, e.g. 2400000 becomes `2.400.000đ`.
 */
export function formatVnd(amount: number): string {
  const rounded = Math.round(amount)
  const grouped = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `${rounded < 0 ? "-" : ""}${grouped}đ`
}

/**
 * Compact đồng label for dense controls such as price-band facets:
 * 1000000 becomes `1 triệu`, 1500000 becomes `1,5 triệu`.
 */
export function formatVndCompact(amount: number): string {
  const millions = amount / 1_000_000
  const text = Number.isInteger(millions)
    ? String(millions)
    : millions.toFixed(1).replace(".", ",")
  return `${text} triệu`
}
