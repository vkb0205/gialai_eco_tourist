import { facetGroups } from "@/data/filters"
import type { FacetKey } from "@/data/filters"
import { regions } from "@/data/regions"
import type { Tour } from "@/data/tours"
import { normalizeForSearch } from "./text"

/**
 * Pure filter, sort, and facet-counting engine.
 *
 * Everything the Explore page displays is derived here in a single call, so the
 * counts shown next to a facet option cannot drift from the results actually
 * rendered (FR-010). No React, no side effects, no dependency on the URL.
 */

export const SORT_MODES = [
  "goi-y",
  "gia-tang",
  "gia-giam",
  "thoi-gian",
] as const
export type SortMode = typeof SORT_MODES[number]

export const SORT_LABELS: Record<SortMode, string> = {
  "goi-y": "Gợi ý của chúng tôi",
  "gia-tang": "Giá thấp đến cao",
  "gia-giam": "Giá cao đến thấp",
  "thoi-gian": "Số ngày tăng dần",
}

export function isSortMode(value: string): value is SortMode {
  return (SORT_MODES as readonly string[]).includes(value)
}

export type FilterState = {
  /** Selected region slugs. Empty means every region. */
  regions: string[]
  /** Selected option values per facet group. Empty array means unconstrained. */
  facets: Record<FacetKey, string[]>
  /** Raw keyword, exactly as typed. */
  keyword: string
  sort: SortMode
}

export const EMPTY_FACETS: Record<FacetKey, string[]> = {
  theme: [],
  duration: [],
  price: [],
  difficulty: [],
  season: [],
  group: [],
  tourGroup: [],
  destination: [],
  special: [],
}

export function createEmptyFilterState(): FilterState {
  return {
    regions: [],
    facets: { ...EMPTY_FACETS },
    keyword: "",
    sort: "goi-y",
  }
}

/** Total number of individually removable selections (FR-006, FR-012). */
export function countActiveFilters(state: FilterState): number {
  const facetCount = Object.values(state.facets).reduce(
    (total, values) => total + values.length,
    0,
  )
  return state.regions.length + facetCount + (state.keyword.trim() ? 1 : 0)
}

export function hasActiveFilters(state: FilterState): boolean {
  return countActiveFilters(state) > 0
}

/**
 * Searchable text per tour, folded once and cached.
 *
 * Covers title, region name, highlights, blurb, and duration label, so both
 * "thác" and "thac" reach the same records (FR-008).
 */
const searchIndex = new WeakMap<Tour, string>()

function searchableText(tour: Tour): string {
  const cached = searchIndex.get(tour)
  if (cached) return cached

  const regionName =
    regions.find((region) => region.slug === tour.regionSlug)?.name ?? ""
  const text = normalizeForSearch(
    [
      tour.title,
      regionName,
      tour.blurb,
      tour.durationLabel,
      ...tour.highlights,
    ].join(" "),
  )
  searchIndex.set(tour, text)
  return text
}

function matchesKeyword(tour: Tour, foldedKeyword: string): boolean {
  if (!foldedKeyword) return true
  // Every whitespace-separated term must appear somewhere in the record.
  return foldedKeyword
    .split(" ")
    .every((term) => searchableText(tour).includes(term))
}

function matchesRegions(tour: Tour, selected: string[]): boolean {
  // Options within a group combine as OR; an empty group constrains nothing.
  return selected.length === 0 || selected.includes(tour.regionSlug)
}

function matchesFacetGroup(
  tour: Tour,
  groupKey: FacetKey,
  selected: string[],
): boolean {
  if (selected.length === 0) return true
  const group = facetGroups.find((candidate) => candidate.key === groupKey)
  if (!group) return true
  return group.options.some(
    (option) => selected.includes(option.value) && option.matches(tour),
  )
}

/** Does a tour satisfy every dimension of the state, optionally ignoring one? */
function matchesAll(
  tour: Tour,
  state: FilterState,
  foldedKeyword: string,
  ignore?: FacetKey | "region",
): boolean {
  if (ignore !== "region" && !matchesRegions(tour, state.regions)) return false
  for (const group of facetGroups) {
    if (group.key === ignore) continue
    if (!matchesFacetGroup(tour, group.key, state.facets[group.key] ?? []))
      return false
  }
  return matchesKeyword(tour, foldedKeyword)
}

function sortTours(list: Tour[], sort: SortMode): Tour[] {
  const sorted = [...list]
  switch (sort) {
    case "gia-tang":
      return sorted.sort((a, b) => a.priceVnd - b.priceVnd || a.id - b.id)
    case "gia-giam":
      return sorted.sort((a, b) => b.priceVnd - a.priceVnd || a.id - b.id)
    case "thoi-gian":
      return sorted.sort(
        (a, b) => a.durationDays - b.durationDays || a.priceVnd - b.priceVnd,
      )
    case "goi-y":
    default:
      // Curated order is the authored order of the dataset: north to south.
      return sorted.sort((a, b) => a.id - b.id)
  }
}

export type FilterResult = {
  /** Tours matching every active constraint, in the requested order. */
  tours: Tour[]
  /** Result count, the single number the toolbar announces. */
  total: number
  /** Package count per region slug, counted with the region facet relaxed. */
  regionCounts: Record<string, number>
  /** Option counts per facet group, each counted with its own group relaxed. */
  facetCounts: Record<FacetKey, Record<string, number>>
}

/**
 * Apply a filter state to the catalogue.
 *
 * Counts follow the standard faceted-search convention: a group's own
 * selections are relaxed when counting that group's options, so choosing a
 * second region in the same group still shows a non-zero count. Every other
 * group stays applied, which is what makes the numbers honest.
 */
export function filterTours(dataset: Tour[], state: FilterState): FilterResult {
  const foldedKeyword = normalizeForSearch(state.keyword)

  const matched: Tour[] = []
  const regionCounts: Record<string, number> = {}
  const facetCounts = {} as Record<FacetKey, Record<string, number>>

  for (const region of regions) regionCounts[region.slug] = 0
  for (const group of facetGroups) {
    facetCounts[group.key] = {}
    for (const option of group.options) facetCounts[group.key][option.value] = 0
  }

  for (const tour of dataset) {
    if (matchesAll(tour, state, foldedKeyword)) matched.push(tour)

    if (matchesAll(tour, state, foldedKeyword, "region")) {
      regionCounts[tour.regionSlug] = (regionCounts[tour.regionSlug] ?? 0) + 1
    }

    for (const group of facetGroups) {
      if (!matchesAll(tour, state, foldedKeyword, group.key)) continue
      for (const option of group.options) {
        if (option.matches(tour)) facetCounts[group.key][option.value] += 1
      }
    }
  }

  return {
    tours: sortTours(matched, state.sort),
    total: matched.length,
    regionCounts,
    facetCounts,
  }
}

/**
 * Identify the filter whose removal restores the most results, so the empty
 * state can offer one concrete recovery action rather than "clear everything".
 */
export type RelaxSuggestion = {
  kind: "region" | "facet" | "keyword"
  groupKey?: FacetKey
  value?: string
  /** Human-readable name of what would be removed. */
  label: string
  /** Result count once that single filter is dropped. */
  resultingCount: number
}

export function suggestRelaxation(
  dataset: Tour[],
  state: FilterState,
  labelFor: (
    kind: "region" | "facet" | "keyword",
    groupKey: FacetKey | undefined,
    value: string,
  ) => string,
): RelaxSuggestion | null {
  const candidates: RelaxSuggestion[] = []

  for (const slug of state.regions) {
    const next: FilterState = {
      ...state,
      regions: state.regions.filter((item) => item !== slug),
    }
    candidates.push({
      kind: "region",
      value: slug,
      label: labelFor("region", undefined, slug),
      resultingCount: filterTours(dataset, next).total,
    })
  }

  for (const group of facetGroups) {
    for (const value of state.facets[group.key] ?? []) {
      const next: FilterState = {
        ...state,
        facets: {
          ...state.facets,
          [group.key]: state.facets[group.key].filter((item) => item !== value),
        },
      }
      candidates.push({
        kind: "facet",
        groupKey: group.key,
        value,
        label: labelFor("facet", group.key, value),
        resultingCount: filterTours(dataset, next).total,
      })
    }
  }

  if (state.keyword.trim()) {
    const next: FilterState = { ...state, keyword: "" }
    candidates.push({
      kind: "keyword",
      value: state.keyword,
      label: labelFor("keyword", undefined, state.keyword),
      resultingCount: filterTours(dataset, next).total,
    })
  }

  const best = candidates
    .filter((candidate) => candidate.resultingCount > 0)
    .sort((a, b) => b.resultingCount - a.resultingCount)[0]

  return best ?? null
}
