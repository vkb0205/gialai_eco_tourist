import type { FacetKey } from "@/data/filters"
import type { FilterState, SortMode } from "@/lib/filterTours"
import ExploreFilters from "./ExploreFilters"

/**
 * Sticky desktop filter panel, shown at `lg` and above. Below that breakpoint
 * the same facets are presented by
 * [`FilterDrawer`](./FilterDrawer.tsx) instead (FR-012).
 */
export default function FilterRail({
  state,
  facetCounts,
  regionCounts,
  onToggle,
  onToggleRegion,
  onSelectAllRegions,
  onSortChange,
  onClearAll,
}: {
  state: FilterState
  facetCounts: Record<FacetKey, Record<string, number>>
  regionCounts: Record<string, number>
  onToggle: (groupKey: FacetKey, value: string) => void
  onToggleRegion: (slug: string) => void
  onSelectAllRegions: () => void
  onSortChange: (sort: SortMode) => void
  onClearAll: () => void
}) {
  return (
    <aside
      aria-label="Bộ lọc hành trình"
      className="hidden self-start lg:sticky lg:top-[88px] lg:block lg:max-h-[calc(100vh-104px)] lg:overflow-y-auto xl:top-[104px] xl:max-h-[calc(100vh-120px)]"
    >
      <div className="rounded-card border border-line bg-paper p-5 shadow-card">
        <ExploreFilters
          state={state}
          facetCounts={facetCounts}
          regionCounts={regionCounts}
          idPrefix="rail"
          onToggleFacet={onToggle}
          onToggleRegion={onToggleRegion}
          onSelectAllRegions={onSelectAllRegions}
          onSortChange={onSortChange}
          onClearAll={onClearAll}
          showRegions={false}
        />
      </div>
    </aside>
  )
}
