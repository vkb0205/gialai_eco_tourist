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
import EmptyResults from "@/components/explore/EmptyResults"
import ExploreHeader from "@/components/explore/ExploreHeader"
import FilterDrawer from "@/components/explore/FilterDrawer"
import FilterRail from "@/components/explore/FilterRail"
import Pagination from "@/components/explore/Pagination"
import RegionStrip from "@/components/explore/RegionStrip"
import ResultsToolbar, {
  buildActiveChips,
} from "@/components/explore/ResultsToolbar"
import type { ActiveChip } from "@/components/explore/ResultsToolbar"
import TourCard from "@/components/explore/TourCard"
import TourCardSkeleton from "@/components/explore/TourCardSkeleton"

/** Tours shown per page (FR-018). */
const PAGE_SIZE = 9
/** Skeleton count for the first paint, matching the initial page (FR-011). */
const SKELETON_COUNT = 6

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
  const [page, setPage] = useState(1)
  const filterTriggerRef = useRef<HTMLButtonElement | null>(null)
  const paginationRef = useRef<HTMLDivElement | null>(null)
  const focusNewPageRef = useRef(false)
  const resultsRef = useRef<HTMLDivElement | null>(null)

  // Skeleton pass on first mount so the grid loads at its final shape.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  // Any filter change returns to the first page.
  useEffect(() => {
    setPage(1)
  }, [query])

  const apply = useCallback((next: FilterState) => {
    navigateTo("/explore", serialiseFilterState(next))
  }, [])

  const onToggleRegion = useCallback(
    (slug: string) => apply(toggleRegion(state, slug)),
    [apply, state],
  )

  const onToggleFacet = useCallback(
    (groupKey: FacetKey, value: string) =>
      apply(toggleFacet(state, groupKey, value)),
    [apply, state],
  )

  const onKeywordChange = useCallback(
    (keyword: string) => apply({ ...state, keyword }),
    [apply, state],
  )

  const onSortChange = useCallback(
    (sort: SortMode) => apply({ ...state, sort }),
    [apply, state],
  )

  const onClearAll = useCallback(() => apply(clearAll(state)), [apply, state])

  const onRemoveChip = useCallback(
    (chip: ActiveChip) => {
      if (chip.kind === "region") apply(toggleRegion(state, chip.value))
      else if (chip.kind === "facet")
        apply(toggleFacet(state, chip.groupKey, chip.value))
      else apply({ ...state, keyword: "" })
    },
    [apply, state],
  )

  const onRelax = useCallback(
    (suggestion: RelaxSuggestion) => {
      if (suggestion.kind === "region")
        apply(toggleRegion(state, suggestion.value ?? ""))
      else if (suggestion.kind === "facet" && suggestion.groupKey) {
        apply(toggleFacet(state, suggestion.groupKey, suggestion.value ?? ""))
      } else apply({ ...state, keyword: "" })
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
  const currentPage = Math.min(page, pageCount)
  const visible = result.tours.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )
  const firstVisible =
    result.total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const lastVisible = Math.min(currentPage * PAGE_SIZE, result.total)

  const goToPage = (nextPage: number) => {
    const clamped = Math.max(1, Math.min(nextPage, pageCount))
    if (clamped === currentPage) return
    focusNewPageRef.current = true
    setPage(clamped)
  }

  /* After a page change, focus the first card of the new page so a keyboard
     user does not land back at the top of the list (FR-016). */
  useEffect(() => {
    if (!focusNewPageRef.current) return
    focusNewPageRef.current = false
    const card = resultsRef.current?.querySelector<HTMLElement>(
      `[data-card-index="0"]`,
    )
    if (card) card.focus()
    else paginationRef.current?.focus()
  }, [currentPage])

  return (
    <div className="bg-[#f6f3ec] pb-24 lg:pb-32">
      <ExploreHeader
        keyword={state.keyword}
        onKeywordChange={onKeywordChange}
        catalogueSize={dataset.length}
      />

      <div className="mx-auto max-w-[1440px] px-6 pt-10 lg:px-12 lg:pt-12">
        <RegionStrip
          selected={state.regions}
          counts={result.regionCounts}
          onToggle={onToggleRegion}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[288px_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[308px_minmax(0,1fr)]">
          <FilterRail
            state={state}
            counts={result.facetCounts}
            activeCount={activeCount}
            onToggle={onToggleFacet}
            onClearAll={onClearAll}
          />

          <section aria-labelledby="results-heading" className="min-w-0">
            <h2 id="results-heading" className="sr-only">
              Kết quả hành trình
            </h2>

            <ResultsToolbar
              ref={filterTriggerRef}
              total={result.total}
              chips={chips}
              activeCount={activeCount}
              sort={state.sort}
              onRemoveChip={onRemoveChip}
              onClearAll={onClearAll}
              onSortChange={onSortChange}
              onOpenFilters={() => setDrawerOpen(true)}
              filtersOpen={drawerOpen}
            />

            <div ref={resultsRef} className="pt-8">
              {!ready || loading ? (
                <ul
                  aria-hidden="true"
                  className="grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 xl:grid-cols-3"
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
                  className="rounded-2xl border border-[#e0dcd2] bg-white px-6 py-12 text-center text-sm text-[#69746b]"
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
                  <ul className="grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 xl:grid-cols-3">
                    {visible.map((tour, index) => (
                      <li
                        key={tour.id}
                        data-card-index={index}
                        tabIndex={-1}
                        className="focus:outline-none"
                      >
                        <TourCard tour={tour} />
                      </li>
                    ))}
                  </ul>

                  {pageCount > 1 && (
                    <div
                      ref={paginationRef}
                      tabIndex={-1}
                      className="focus:outline-none"
                    >
                      <Pagination
                        currentPage={currentPage}
                        pageCount={pageCount}
                        firstVisible={firstVisible}
                        lastVisible={lastVisible}
                        total={result.total}
                        onPageChange={goToPage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      </div>

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
    </div>
  )
}
