import type { FacetKey } from "@/data/filters"
import type { FilterState } from "@/lib/filterTours"
import FacetGroups from "./FacetGroups"

/**
 * Sticky desktop filter panel, shown at `lg` and above. Below that breakpoint
 * the same facets are presented by
 * [`FilterDrawer`](./FilterDrawer.tsx) instead (FR-012).
 */
export default function FilterRail({
  state,
  counts,
  activeCount,
  onToggle,
  onClearAll,
}: {
  state: FilterState
  counts: Record<FacetKey, Record<string, number>>
  activeCount: number
  onToggle: (groupKey: FacetKey, value: string) => void
  onClearAll: () => void
}) {
  return (
    <aside
      aria-label="Bộ lọc hành trình"
      className="hidden lg:sticky lg:top-[104px] lg:block lg:h-fit lg:max-h-[calc(100vh-128px)] lg:overflow-y-auto"
    >
      <div className="rounded-card border border-line bg-paper p-5 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <h2 className="m-0 text-xs font-bold uppercase tracking-[0.8px] text-subtle">
            Bộ lọc
          </h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="min-h-11 text-sm font-bold text-forest underline underline-offset-4 hover:text-forest-hover"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        <div className="mt-3">
          <FacetGroups
            state={state}
            counts={counts}
            onToggle={onToggle}
            idPrefix="rail"
          />
        </div>
      </div>
    </aside>
  )
}
