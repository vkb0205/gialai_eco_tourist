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
      className="hidden lg:block lg:sticky lg:top-[104px] lg:h-fit lg:max-h-[calc(100vh-128px)] lg:overflow-y-auto"
    >
      <div className="rounded-[2px] bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="m-0 font-display text-2xl tracking-[-0.02em] text-[#183024]">
            Bộ lọc
          </h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="min-h-11 text-[15px] font-semibold text-[#183024] underline underline-offset-4 transition-colors hover:text-[#a24627] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        <div className="mt-6">
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
