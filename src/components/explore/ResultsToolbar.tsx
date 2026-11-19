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
          className="m-0 text-[15px] text-body"
        >
          Đang hiện <strong className="font-bold text-ink">{total}</strong> tour
        </p>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button
            ref={filterTriggerRef}
            type="button"
            onClick={onOpenFilters}
            aria-expanded={filtersOpen}
            aria-haspopup="dialog"
            className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-button border border-ink/20 bg-paper px-5 text-[15px] font-bold text-ink transition-colors hover:bg-leaf lg:hidden"
          >
            <FunnelSimple size={16} aria-hidden="true" />
            Bộ lọc
            {activeCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-forest px-1.5 text-sm font-bold tabular-nums text-paper">
                {activeCount}
              </span>
            )}
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
            <label
              htmlFor="sort-select"
              className="sr-only text-xs font-bold uppercase tracking-[0.8px] text-subtle sm:not-sr-only"
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
                className="min-h-11 w-full cursor-pointer appearance-none rounded-button border border-ink/20 bg-paper py-2.5 pl-5 pr-10 text-[15px] font-bold text-ink transition-colors hover:bg-leaf"
              >
                {SORT_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {SORT_LABELS[mode]}
                  </option>
                ))}
              </select>
              <CaretDown
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink"
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
              className="inline-flex min-h-11 items-center gap-2 rounded-button bg-forest pl-5 pr-4 text-[15px] font-bold text-paper transition-colors hover:bg-forest-hover motion-safe:animate-[fade-in_160ms_ease-out]"
            >
              {chip.label}
              <X size={14} aria-hidden="true" />
              <span className="sr-only">, bỏ bộ lọc này</span>
            </button>
          ))}

          <button
            type="button"
            onClick={onClearAll}
            className="ml-1 min-h-11 text-[15px] font-bold text-forest underline underline-offset-4 hover:text-forest-hover"
          >
            Xóa tất cả
          </button>
        </div>
      )}
    </div>
  )
})

export default ResultsToolbar
