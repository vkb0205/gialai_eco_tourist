import { useEffect, useRef } from "react"
import { X } from "@phosphor-icons/react"
import type { FacetKey } from "@/data/filters"
import type { FilterState, SortMode } from "@/lib/filterTours"
import ExploreFilters from "./ExploreFilters"

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Below-`lg` filter overlay (FR-012).
 *
 * Traps focus while open, closes on Escape, and returns focus to the trigger on
 * close, so a keyboard or screen-reader user is never stranded behind the sheet.
 * Results update live underneath, so the sheet has a "done" affordance rather
 * than an apply step that could desynchronise from the URL.
 */
export default function FilterDrawer({
  open,
  onClose,
  state,
  facetCounts,
  regionCounts,
  resultCount,
  onToggleRegion,
  onSelectAllRegions,
  onToggle,
  onSortChange,
  onClearAll,
  triggerRef,
  /** Control that opened the sheet; focus returns here on close. */
}: {
  open: boolean
  onClose: () => void
  state: FilterState
  facetCounts: Record<FacetKey, Record<string, number>>
  regionCounts: Record<string, number>
  resultCount: number
  onToggleRegion: (slug: string) => void
  onSelectAllRegions: () => void
  onToggle: (groupKey: FacetKey, value: string) => void
  onSortChange: (sort: SortMode) => void
  onClearAll: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  // Move focus into the sheet on open and back to the trigger on close.
  useEffect(() => {
    if (!open) return
    closeButtonRef.current?.focus()
    return () => triggerRef.current?.focus()
  }, [open, triggerRef])

  // Escape to dismiss, Tab cycled inside the panel.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== "Tab") return

      const panel = panelRef.current
      if (!panel) return
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  // Prevent the catalogue behind the sheet from scrolling.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div
        className="absolute inset-0 bg-night/60 motion-safe:animate-[fade-in_180ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-drawer-title"
        className="absolute inset-x-0 bottom-0 flex max-h-[min(90dvh,48rem)] w-full flex-col rounded-t-card bg-paper shadow-search motion-safe:animate-[rise-in_220ms_ease-out]"
      >
        <div className="flex items-center justify-between gap-4 bg-hero px-6 py-4">
          <div>
            <h2
              id="filter-drawer-title"
              className="m-0 text-xl font-bold text-ink"
            >
              Bộ lọc hành trình
            </h2>
            <p className="m-0 mt-1 text-[15px] text-body">Chọn điều kiện</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Đóng bộ lọc"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition-colors hover:bg-leaf"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <ExploreFilters
            state={state}
            facetCounts={facetCounts}
            regionCounts={regionCounts}
            idPrefix="drawer"
            onToggleFacet={onToggle}
            onToggleRegion={onToggleRegion}
            onSelectAllRegions={onSelectAllRegions}
            onSortChange={onSortChange}
            onClearAll={onClearAll}
          />
        </div>

        <div className="border-t border-line bg-hero px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 w-full rounded-button bg-forest px-5 text-[15px] font-bold text-paper transition-colors hover:bg-forest-hover"
          >
            Xem {resultCount} hành trình
          </button>
        </div>
      </div>
    </div>
  )
}
