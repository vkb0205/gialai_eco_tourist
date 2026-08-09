import { carFacetGroups, findCarFacetGroup } from "@/data/carRentalFilters"
import type { CarFacetKey } from "@/data/carRentalFilters"
import { findRegion } from "@/data/regions"
import {
  createEmptyCarFilterState,
  EMPTY_CAR_FACETS,
  isCarSortMode,
} from "./filterVehicles"
import type { CarFilterState } from "./filterVehicles"

/**
 * Car rental filter state to and from the hash query string.
 *
 * Mirrors `urlState.ts` — the URL is the single source of truth, parsing is
 * forgiving: unknown regions, unknown facet values, and malformed sort modes
 * are dropped rather than surfaced as an error.
 */

const REGION_PARAM = "vung"
const KEYWORD_PARAM = "tim"
const SORT_PARAM = "sap-xep"

export function parseCarFilterState(query: string): CarFilterState {
  const state = createEmptyCarFilterState()
  if (!query) return state

  let params: URLSearchParams
  try {
    params = new URLSearchParams(query)
  } catch {
    return state
  }

  const regionValues = readList(params, REGION_PARAM)
  state.regions = regionValues.filter((slug) => findRegion(slug) !== undefined)

  for (const group of carFacetGroups) {
    const values = readList(params, group.key)
    const valid = values.filter((value) =>
      group.options.some((option) => option.value === value),
    )
    state.facets[group.key] =
      group.mode === "single" ? valid.slice(0, 1) : dedupe(valid)
  }

  const keyword = params.get(KEYWORD_PARAM)
  if (keyword) state.keyword = keyword.slice(0, 120)

  const sort = params.get(SORT_PARAM)
  if (sort && isCarSortMode(sort)) state.sort = sort

  return state
}

export function serialiseCarFilterState(state: CarFilterState): string {
  const params = new URLSearchParams()

  if (state.regions.length > 0)
    params.set(REGION_PARAM, state.regions.join(","))

  for (const group of carFacetGroups) {
    const values = state.facets[group.key] ?? []
    if (values.length > 0) params.set(group.key, values.join(","))
  }

  const keyword = state.keyword.trim()
  if (keyword) params.set(KEYWORD_PARAM, keyword)
  if (state.sort !== "goi-y") params.set(SORT_PARAM, state.sort)

  return params.toString()
}

export function toggleCarRegion(
  state: CarFilterState,
  slug: string,
): CarFilterState {
  const selected = state.regions.includes(slug)
  return {
    ...state,
    regions: selected
      ? state.regions.filter((item) => item !== slug)
      : [...state.regions, slug],
  }
}

export function toggleCarFacet(
  state: CarFilterState,
  groupKey: CarFacetKey,
  value: string,
): CarFilterState {
  const group = findCarFacetGroup(groupKey)
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

export function clearAllCarFilters(state: CarFilterState): CarFilterState {
  return { ...createEmptyCarFilterState(), sort: state.sort }
}

function readList(params: URLSearchParams, key: string): string[] {
  return params
    .getAll(key)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean)
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)]
}

export { EMPTY_CAR_FACETS }
