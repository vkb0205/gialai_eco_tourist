import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { facetOptionLabel } from "@/data/filters"
import type { FacetKey } from "@/data/filters"
import { regionName } from "@/data/regions"
import type { Tour } from "@/data/tours"
import { loadPublishedTours } from "@/data/toursRepository"
import {
  countActiveFilters,
  filterTours,
  suggestRelaxation,
} from "@/lib/filterTours"
import type { FilterState, RelaxSuggestion, SortMode } from "@/lib/filterTours"
import { navigateTo } from "@/lib/useHashRoute"
import {
  clearAll,
  parseFilterState,
  serialiseFilterState,
  toggleFacet,
  toggleRegion,
} from "@/lib/urlState"
import CustomTourBanner from "@/components/explore/CustomTourBanner"
import EmptyResults from "@/components/explore/EmptyResults"
import ExploreHeader from "@/components/explore/ExploreHeader"
import FilterDrawer from "@/components/explore/FilterDrawer"
import HorizontalFilterBar from "@/components/explore/HorizontalFilterBar"
import { buildActiveChips } from "@/components/explore/ResultsToolbar"
import type { ActiveChip } from "@/components/explore/ResultsToolbar"
import TourCard from "@/components/ui/TourCard"
import ContactDock from "@/components/ui/ContactDock"
import TourCardSkeleton from "@/components/explore/TourCardSkeleton"
import Pagination from "@/components/explore/Pagination"
import { X } from "@phosphor-icons/react"

/** Tours displayed on each numbered page. */
const PAGE_SIZE = 9
/** Skeleton cards shown while catalogue loads. */
const SKELETON_COUNT = PAGE_SIZE

export default function ExplorePage({ query }: { query: string }) {
  const state = useMemo(() => parseFilterState(query), [query])
  const [dataset, setDataset] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const result = useMemo(() => filterTours(dataset, state), [dataset, state])
  const activeCount = countActiveFilters(state)
  const chips = useMemo(() => buildActiveChips(state), [state])

  useEffect(() => {
    let active = true

    loadPublishedTours()
      .then((nextTours) => {
        if (!active) return
        setDataset(nextTours)
        setLoadError(null)
      })
      .catch(() => {
        if (!active) return
        setDataset([])
        setLoadError("Không thể tải dữ liệu hành trình lúc này.")
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const [drawerOpen, setDrawerOpen] = useState(false)
  const filterTriggerRef = useRef<HTMLButtonElement | null>(null)
  const resultsRef = useRef<HTMLDivElement | null>(null)

  // Skeleton pass on first mount
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const apply = useCallback((next: FilterState) => {
    navigateTo("/explore", serialiseFilterState(next))
  }, [])

  const onToggleRegion = useCallback(
    (slug: string) => {
      const next = toggleRegion(state, slug)
      apply({ ...next, page: 1 })
    },
    [apply, state],
  )

  const onSelectAllRegions = useCallback(() => {
    apply({ ...state, regions: [], page: 1 })
  }, [apply, state])

  const onToggleFacet = useCallback(
    (groupKey: FacetKey, value: string) => {
      const next = toggleFacet(state, groupKey, value)
      apply({ ...next, page: 1 })
    },
    [apply, state],
  )

  const onKeywordChange = useCallback(
    (keyword: string) => apply({ ...state, keyword, page: 1 }),
    [apply, state],
  )

  const onSortChange = useCallback(
    (sort: SortMode) => apply({ ...state, sort, page: 1 }),
    [apply, state],
  )

  const onClearAll = useCallback(() => apply(clearAll(state)), [apply, state])

  const onRemoveChip = useCallback(
    (chip: ActiveChip) => {
      if (chip.kind === "region") apply({ ...toggleRegion(state, chip.value), page: 1 })
      else if (chip.kind === "facet")
        apply({ ...toggleFacet(state, chip.groupKey, chip.value), page: 1 })
      else apply({ ...state, keyword: "", page: 1 })
    },
    [apply, state],
  )

  const onRelax = useCallback(
    (suggestion: RelaxSuggestion) => {
      if (suggestion.kind === "region")
        apply({ ...toggleRegion(state, suggestion.value ?? ""), page: 1 })
      else if (suggestion.kind === "facet" && suggestion.groupKey) {
        apply({
          ...toggleFacet(state, suggestion.groupKey, suggestion.value ?? ""),
          page: 1,
        })
      } else apply({ ...state, keyword: "", page: 1 })
    },
    [apply, state],
  )

  const suggestion = useMemo(
    () =>
      result.total === 0 && !loadError
        ? suggestRelaxation(dataset, state, (kind, groupKey, value) => {
            if (kind === "region") return regionName(value)
            if (kind === "facet" && groupKey)
              return facetOptionLabel(groupKey, value)
            return `từ khóa "${value}"`
          })
        : null,
    [dataset, loadError, result.total, state],
  )

  const pageCount = Math.max(1, Math.ceil(result.total / PAGE_SIZE))
  const currentPage = Math.min(Math.max(state.page ?? 1, 1), pageCount)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const visibleTours = result.tours.slice(pageStart, pageStart + PAGE_SIZE)

  const onPageChange = (page: number) => {
    apply({ ...state, page: Math.min(Math.max(page, 1), pageCount) })
  }

  return (
    <div className="bg-air pb-24 lg:pb-16">
      {/* 1. Page Header */}
      <ExploreHeader
        keyword={state.keyword}
        onKeywordChange={onKeywordChange}
        catalogueSize={dataset.length}
      />

      {/* 2. Full-width horizontal filter bar (sticky) */}
      <div className="sticky top-[72px] lg:top-[88px] z-30 shadow-xs">
        <HorizontalFilterBar
          state={state}
          facetCounts={result.facetCounts}
          regionCounts={result.regionCounts}
          onToggleRegion={onToggleRegion}
          onSelectAllRegions={onSelectAllRegions}
          onToggleFacet={onToggleFacet}
          onSortChange={onSortChange}
          onOpenMobileDrawer={() => setDrawerOpen(true)}
          mobileTriggerRef={filterTriggerRef}
        />
      </div>

      <div className="page-container pt-6 lg:pt-10">
        <section aria-labelledby="results-heading" className="min-w-0">
          <h2 id="results-heading" className="sr-only">
            Kết quả hành trình
          </h2>

          {/* 3. Result count line and active filter chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-[18px]">
            <p
              aria-live="polite"
              aria-atomic="true"
              className="m-0 text-[15px] font-normal leading-[22px] text-body"
            >
              Đang hiện{" "}
              <strong className="font-bold text-ink">
                {ready && !loading ? visibleTours.length : 0}
              </strong>{" "}
              trên{" "}
              <strong className="font-bold text-ink">
                {ready && !loading ? result.total : 0}
              </strong>{" "}
              tour
            </p>

            {chips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="sr-only">Bộ lọc đang áp dụng:</span>
                {chips.map((chip) => (
                  <button
                    key={`${chip.kind}-${
                      "groupKey" in chip ? chip.groupKey : ""
                    }-${chip.value}`}
                    type="button"
                    onClick={() => onRemoveChip(chip)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-forest pl-3.5 pr-2.5 text-xs font-bold text-paper transition-colors hover:bg-forest-hover"
                  >
                    <span>{chip.label}</span>
                    <X size={13} aria-hidden="true" />
                    <span className="sr-only">, gỡ bộ lọc này</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={onClearAll}
                  className="ml-2 text-xs font-bold text-forest underline underline-offset-4 hover:text-forest-hover"
                >
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>

          {/* 4. Full-width 3-column card grid */}
          <div ref={resultsRef}>
            {!ready || loading ? (
              <ul
                aria-hidden="true"
                className="grid list-none grid-cols-1 gap-x-6 gap-y-8 p-0 md:grid-cols-2 md:gap-x-8 xl:grid-cols-3 xl:gap-x-10"
              >
                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                  <li key={index}>
                    <TourCardSkeleton />
                  </li>
                ))}
              </ul>
            ) : loadError ? (
              <div
                role="alert"
                className="rounded-panel bg-blush px-6 py-12 text-center text-base text-ink"
              >
                {loadError}
              </div>
            ) : result.total === 0 ? (
              <EmptyResults
                suggestion={suggestion}
                onRelax={onRelax}
                onClearAll={onClearAll}
              />
            ) : (
              <>
                <ul className="grid list-none grid-cols-1 gap-x-6 gap-y-8 p-0 md:grid-cols-2 md:gap-x-8 xl:grid-cols-3 xl:gap-x-10">
                  {visibleTours.map((tour, index) => (
                    <li
                      key={tour.id}
                      data-card-index={pageStart + index}
                      tabIndex={-1}
                      className="focus:outline-none"
                    >
                      <TourCard tour={tour} index={pageStart + index} />
                    </li>
                  ))}
                </ul>
                {pageCount > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    pageCount={pageCount}
                    onPageChange={onPageChange}
                  />
                )}
                <div className="mt-16">
                  <CustomTourBanner />
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        state={state}
        counts={result.facetCounts}
        activeCount={activeCount}
        resultCount={result.total}
        onToggle={onToggleFacet}
        onClearAll={onClearAll}
        triggerRef={filterTriggerRef}
      />
      <ContactDock />
    </div>
  )
}
