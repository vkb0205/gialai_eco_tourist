import { carFacetGroups } from "@/data/carRentalFilters"
import type { CarFacetKey } from "@/data/carRentalFilters"
import { regions } from "@/data/regions"
import type { Vehicle } from "@/data/carRental"
import { normalizeForSearch } from "./text"

/**
 * Pure filter, sort, and facet-counting engine for the car rental catalogue.
 *
 * Mirrors `filterTours.ts` — no React, no side effects, no dependency on the URL.
 */

export const CAR_SORT_MODES = [
  "goi-y",
  "gia-tang",
  "gia-giam",
  "cho-tang",
] as const
export type CarSortMode = typeof CAR_SORT_MODES[number]

export const CAR_SORT_LABELS: Record<CarSortMode, string> = {
  "goi-y": "Gợi ý của chúng tôi",
  "gia-tang": "Giá thấp đến cao",
  "gia-giam": "Giá cao đến thấp",
  "cho-tang": "Số chỗ tăng dần",
}

export function isCarSortMode(value: string): value is CarSortMode {
  return (CAR_SORT_MODES as readonly string[]).includes(value)
}

export type CarFilterState = {
  /** Selected region slugs. Empty means every region. */
  regions: string[]
  /** Selected option values per facet group. */
  facets: Record<CarFacetKey, string[]>
  /** Raw keyword, exactly as typed. */
  keyword: string
  sort: CarSortMode
}

export const EMPTY_CAR_FACETS: Record<CarFacetKey, string[]> = {
  category: [],
  seats: [],
  transmission: [],
  fuel: [],
  driver: [],
  price: [],
  b2b: [],
}

export function createEmptyCarFilterState(): CarFilterState {
  return {
    regions: [],
    facets: { ...EMPTY_CAR_FACETS },
    keyword: "",
    sort: "goi-y",
  }
}

export function countActiveCarFilters(state: CarFilterState): number {
  const facetCount = Object.values(state.facets).reduce(
    (total, values) => total + values.length,
    0,
  )
  return state.regions.length + facetCount + (state.keyword.trim() ? 1 : 0)
}

export function hasActiveCarFilters(state: CarFilterState): boolean {
  return countActiveCarFilters(state) > 0
}

const vehicleSearchIndex = new WeakMap<Vehicle, string>()

function searchableText(vehicle: Vehicle): string {
  const cached = vehicleSearchIndex.get(vehicle)
  if (cached) return cached

  const text = normalizeForSearch(
    [
      vehicle.name,
      vehicle.brand,
      vehicle.blurb,
      ...vehicle.features,
      ...vehicle.regionSlugs.map(
        (slug) => regions.find((r) => r.slug === slug)?.name ?? "",
      ),
    ].join(" "),
  )
  vehicleSearchIndex.set(vehicle, text)
  return text
}

function matchesKeyword(vehicle: Vehicle, foldedKeyword: string): boolean {
  if (!foldedKeyword) return true
  return foldedKeyword
    .split(" ")
    .every((term) => searchableText(vehicle).includes(term))
}

function matchesRegions(vehicle: Vehicle, selected: string[]): boolean {
  if (selected.length === 0) return true
  return selected.some((slug) => vehicle.regionSlugs.includes(slug as never))
}

function matchesCarFacetGroup(
  vehicle: Vehicle,
  groupKey: CarFacetKey,
  selected: string[],
): boolean {
  if (selected.length === 0) return true
  const group = carFacetGroups.find((c) => c.key === groupKey)
  if (!group) return true
  return group.options.some(
    (option) => selected.includes(option.value) && option.matches(vehicle),
  )
}

function matchesAllCars(
  vehicle: Vehicle,
  state: CarFilterState,
  foldedKeyword: string,
  ignore?: CarFacetKey | "region",
): boolean {
  if (ignore !== "region" && !matchesRegions(vehicle, state.regions))
    return false
  for (const group of carFacetGroups) {
    if (group.key === ignore) continue
    if (
      !matchesCarFacetGroup(vehicle, group.key, state.facets[group.key] ?? [])
    )
      return false
  }
  return matchesKeyword(vehicle, foldedKeyword)
}

function sortVehicles(list: Vehicle[], sort: CarSortMode): Vehicle[] {
  const sorted = [...list]
  switch (sort) {
    case "gia-tang":
      return sorted.sort(
        (a, b) => a.pricePerDayVnd - b.pricePerDayVnd || a.id - b.id,
      )
    case "gia-giam":
      return sorted.sort(
        (a, b) => b.pricePerDayVnd - a.pricePerDayVnd || a.id - b.id,
      )
    case "cho-tang":
      return sorted.sort((a, b) => a.seats - b.seats || a.id - b.id)
    case "goi-y":
    default:
      return sorted.sort((a, b) => a.id - b.id)
  }
}

export type CarFilterResult = {
  vehicles: Vehicle[]
  total: number
  regionCounts: Record<string, number>
  facetCounts: Record<CarFacetKey, Record<string, number>>
}

export function filterVehicles(
  dataset: Vehicle[],
  state: CarFilterState,
): CarFilterResult {
  const foldedKeyword = normalizeForSearch(state.keyword)

  const matched: Vehicle[] = []
  const regionCounts: Record<string, number> = {}
  const facetCounts = {} as Record<CarFacetKey, Record<string, number>>

  for (const region of regions) regionCounts[region.slug] = 0
  for (const group of carFacetGroups) {
    facetCounts[group.key] = {}
    for (const option of group.options) facetCounts[group.key][option.value] = 0
  }

  for (const vehicle of dataset) {
    if (matchesAllCars(vehicle, state, foldedKeyword)) matched.push(vehicle)

    if (matchesAllCars(vehicle, state, foldedKeyword, "region")) {
      for (const slug of vehicle.regionSlugs) {
        regionCounts[slug] = (regionCounts[slug] ?? 0) + 1
      }
    }

    for (const group of carFacetGroups) {
      if (!matchesAllCars(vehicle, state, foldedKeyword, group.key)) continue
      for (const option of group.options) {
        if (option.matches(vehicle)) facetCounts[group.key][option.value] += 1
      }
    }
  }

  return {
    vehicles: sortVehicles(matched, state.sort),
    total: matched.length,
    regionCounts,
    facetCounts,
  }
}

export type CarRelaxSuggestion = {
  kind: "region" | "facet" | "keyword"
  groupKey?: CarFacetKey
  value?: string
  label: string
  resultingCount: number
}

export function suggestCarRelaxation(
  dataset: Vehicle[],
  state: CarFilterState,
  labelFor: (
    kind: "region" | "facet" | "keyword",
    groupKey: CarFacetKey | undefined,
    value: string,
  ) => string,
): CarRelaxSuggestion | null {
  const candidates: CarRelaxSuggestion[] = []

  for (const slug of state.regions) {
    const next: CarFilterState = {
      ...state,
      regions: state.regions.filter((item) => item !== slug),
    }
    candidates.push({
      kind: "region",
      value: slug,
      label: labelFor("region", undefined, slug),
      resultingCount: filterVehicles(dataset, next).total,
    })
  }

  for (const group of carFacetGroups) {
    for (const value of state.facets[group.key] ?? []) {
      const next: CarFilterState = {
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
        resultingCount: filterVehicles(dataset, next).total,
      })
    }
  }

  if (state.keyword.trim()) {
    const next: CarFilterState = { ...state, keyword: "" }
    candidates.push({
      kind: "keyword",
      value: state.keyword,
      label: labelFor("keyword", undefined, state.keyword),
      resultingCount: filterVehicles(dataset, next).total,
    })
  }

  const best = candidates
    .filter((c) => c.resultingCount > 0)
    .sort((a, b) => b.resultingCount - a.resultingCount)[0]

  return best ?? null
}
