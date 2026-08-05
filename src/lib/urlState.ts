import { facetGroups, findFacetGroup } from "@/data/filters"
import type { FacetKey } from "@/data/filters"
import { findRegion } from "@/data/regions"
import { createEmptyFilterState, EMPTY_FACETS, isSortMode } from "./filterTours"
import type { FilterState } from "./filterTours"

/**
 * Filter state to and from the hash query string.
 *
 * The URL is the single source of truth (FR-007), so this module is the only
 * place that knows the wire format. Parsing is deliberately forgiving: unknown
 * regions, unknown facet values, and malformed sort modes are dropped rather
 * than surfaced as an error, leaving the traveller with a wider catalogue
 * instead of a broken page.
 */

const REGION_PARAM = "vung"
const KEYWORD_PARAM = "tim"
const SORT_PARAM = "sap-xep"

/** Parse a hash query string into a filter state, discarding anything unknown. */
export function parseFilterState(query: string): FilterState {
  const state = createEmptyFilterState()
  if (!query) return state

  let params: URLSearchParams
  try {
    params = new URLSearchParams(query)
  } catch {
    return state
  }

  const regionValues = readList(params, REGION_PARAM)
  state.regions = regionValues.filter((slug) => findRegion(slug) !== undefined)

  for (const group of facetGroups) {
    const values = readList(params, group.key)
    const valid = values.filter((value) =>
      group.options.some((option) => option.value === value),
    )
    // A `single`-mode group keeps only the first valid selection.
    state.facets[group.key] =
      group.mode === "single" ? valid.slice(0, 1) : dedupe(valid)
  }

  const keyword = params.get(KEYWORD_PARAM)
  if (keyword) state.keyword = keyword.slice(0, 120)

  const sort = params.get(SORT_PARAM)
  if (sort && isSortMode(sort)) state.sort = sort

  return state
}

/**
 * Serialise a filter state back to a hash query string.
 *
 * Defaults are omitted so an unfiltered catalogue produces `#/explore` with no
 * trailing noise, and two equivalent states always produce the same string.
 */
export function serialiseFilterState(state: FilterState): string {
  const params = new URLSearchParams()

  if (state.regions.length > 0)
    params.set(REGION_PARAM, state.regions.join(","))

  for (const group of facetGroups) {
    const values = state.facets[group.key] ?? []
    if (values.length > 0) params.set(group.key, values.join(","))
  }

  const keyword = state.keyword.trim()
  if (keyword) params.set(KEYWORD_PARAM, keyword)
  if (state.sort !== "goi-y") params.set(SORT_PARAM, state.sort)

  return params.toString()
}

/** Toggle a region slug, preserving everything else. */
export function toggleRegion(state: FilterState, slug: string): FilterState {
  const selected = state.regions.includes(slug)
  return {
    ...state,
    regions: selected
      ? state.regions.filter((item) => item !== slug)
      : [...state.regions, slug],
  }
}

/** Toggle a facet option, honouring the group's single or multiple mode. */
export function toggleFacet(
  state: FilterState,
  groupKey: FacetKey,
  value: string,
): FilterState {
  const group = findFacetGroup(groupKey)
  const current = state.facets[groupKey] ?? []
  const selected = current.includes(value)

  let next: string[]
  if (group?.mode === "single") {
    next = selected ? [] : [value]
  } else {
    next = selected
      ? current.filter((item) => item !== value)
      : [...current, value]
  }

  return { ...state, facets: { ...state.facets, [groupKey]: next } }
}

/** Remove every selection, returning to the unfiltered catalogue (FR-006). */
export function clearAll(state: FilterState): FilterState {
  return { ...createEmptyFilterState(), sort: state.sort }
}

function readList(params: URLSearchParams, key: string): string[] {
  // Accept both `?theme=a,b` and repeated `?theme=a&theme=b`.
  return params
    .getAll(key)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean)
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)]
}

/** Reference to the untouched facet shape, for callers building fresh states. */
export { EMPTY_FACETS }
