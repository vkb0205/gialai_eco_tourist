import { forwardRef } from "react"
import { CaretDown, FunnelSimple, X } from "@phosphor-icons/react"
import { facetOptionLabel } from "@/data/filters"
import type { FacetKey } from "@/data/filters"
import { regionName } from "@/data/regions"
import { SORT_LABELS, SORT_MODES } from "@/lib/filterTours"
import type { FilterState, SortMode } from "@/lib/filterTours"

interface RegionChip {
  kind: "region"
  value: string
  label: string
}
interface FacetChip {
  kind: "facet"
  groupKey: FacetKey
  value: string
  label: string
}
interface KeywordChip {
  kind: "keyword"
  value: string
  label: string
}
export type ActiveChip = RegionChip | FacetChip | KeywordChip

/** Derive the removable chips for a filter state, in a stable reading order. */
export function buildActiveChips(state: FilterState): ActiveChip[] {
  const chips: ActiveChip[] = []

  for (const slug of state.regions) {
    chips.push({ kind: "region", value: slug, label: regionName(slug) })
  }

  for (const [groupKey, values] of Object.entries(
    state.facets,
  ) as [FacetKey, string[]][]) {
    for (const value of values) {
      chips.push({
        kind: "facet",
        groupKey,
        value,
        label: facetOptionLabel(groupKey, value),
      })
    }
  }

  const keyword = state.keyword.trim()
  if (keyword) {
    chips.push({
      kind: "keyword",
      value: keyword,
      label: `Từ khóa: ${keyword}`,
    })
  }

  return chips
}

/**
 * Result count, active-filter chips, the mobile filter trigger, and sort.
 *
 * The count sits in an `aria-live="polite"` region so every filter change is
 * announced (FR-005), each chip removes exactly one selection (FR-006), and
 * the sort choice is independent of the filters so it survives them (FR-009).
 */
const ResultsToolbar = forwardRef<HTMLButtonElement, {
  total: number
  chips: ActiveChip[]
  activeCount: number
  sort: SortMode
  onRemoveChip: (chip: ActiveChip) => void
  onClearAll: () => void
  onSortChange: (sort: SortMode) => void
  onOpenFilters: () => void
  filtersOpen: boolean
}>(function ResultsToolbar(
  {
    total,
    chips,
    activeCount,
    sort,
    onRemoveChip,
    onClearAll,
    onSortChange,
    onOpenFilters,
    filtersOpen,
  },
  filterTriggerRef,
) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          aria-live="polite"
          aria-atomic="true"
          className="m-0 text-lg text-[#2f3d35]"
        >
          <strong className="font-semibold text-[#183024]">{total}</strong> hành
          trình
        </p>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button
            ref={filterTriggerRef}
            type="button"
            onClick={onOpenFilters}
            aria-expanded={filtersOpen}
            aria-haspopup="dialog"
            className="inline-flex items-center gap-2 whitespace-nowrap min-h-11 rounded-full bg-white px-5 text-[15px] font-semibold text-[#183024] transition-colors duration-200 hover:bg-[#dddbd3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024] lg:hidden"
          >
            <FunnelSimple className="h-4 w-4" aria-hidden="true" />
            Bộ lọc
            {activeCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#183024] px-1.5 text-sm font-semibold tabular-nums text-white">
                {activeCount}
              </span>
            )}
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
            <label
              htmlFor="sort-select"
              className="sr-only text-[15px] font-semibold text-[#2f3d35] sm:not-sr-only"
            >
              Sắp xếp
            </label>
            <div className="relative min-w-0 flex-1 sm:flex-none">
              <select
                id="sort-select"
                value={sort}
                onChange={(event) =>
                  onSortChange(event.target.value as SortMode)
                }
                className="min-h-11 w-full cursor-pointer appearance-none rounded-full bg-white py-2.5 pl-5 pr-10 text-[15px] font-semibold text-[#183024] transition-colors hover:bg-[#dddbd3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
              >
                {SORT_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {SORT_LABELS[mode]}
                  </option>
                ))}
              </select>
              <CaretDown
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#183024]"
              />
            </div>
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <h2 className="sr-only">Bộ lọc đang áp dụng</h2>
          {chips.map((chip) => (
            <button
              key={`${chip.kind}-${
                "groupKey" in chip ? chip.groupKey : ""
              }-${chip.value}`}
              type="button"
              onClick={() => onRemoveChip(chip)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#183024] pl-5 pr-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#a24627] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024] motion-safe:animate-[fade-in_160ms_ease-out]"
            >
              {chip.label}
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">, bỏ bộ lọc này</span>
            </button>
          ))}

          <button
            type="button"
            onClick={onClearAll}
            className="ml-1 min-h-11 text-[15px] font-semibold text-[#183024] underline underline-offset-4 transition-colors hover:text-[#a24627] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
          >
            Xóa tất cả
          </button>
        </div>
      )}
    </div>
  )
})

export default ResultsToolbar
