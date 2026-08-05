import { useEffect, useRef } from "react"
import { X } from "@phosphor-icons/react"
import type { FacetKey } from "@/data/filters"
import type { FilterState } from "@/lib/filterTours"
import FacetGroups from "./FacetGroups"

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
  counts,
  activeCount,
  resultCount,
  onToggle,
  onClearAll,
  triggerRef,
  /** Control that opened the sheet; focus returns here on close. */
}: {
  open: boolean
  onClose: () => void
  state: FilterState
  counts: Record<FacetKey, Record<string, number>>
  activeCount: number
  resultCount: number
  onToggle: (groupKey: FacetKey, value: string) => void
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
        className="absolute inset-0 bg-[#10231a]/60 backdrop-blur-[2px] motion-safe:animate-[fade-in_180ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-drawer-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-[26rem] flex-col bg-[#f6f3ec] shadow-[0_0_60px_rgba(16,35,26,0.35)] motion-safe:animate-[slide-in-right_220ms_ease-out]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#e0dcd2] px-6 py-4">
          <div>
            <p className="m-0 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#69746b]">
              Bộ lọc hành trình
            </p>
            <h2
              id="filter-drawer-title"
              className="mt-1 text-[14px] font-bold tracking-[-0.01em] text-[#183024]"
            >
              {activeCount > 0
                ? `Đang chọn ${activeCount} điều kiện`
                : "Chọn điều kiện"}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Đóng bộ lọc"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c8c8be] text-[#183024] transition-colors hover:border-[#183024] hover:bg-[#e9e6dd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d56742]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <FacetGroups
            state={state}
            counts={counts}
            onToggle={onToggle}
            idPrefix="drawer"
          />
        </div>

        <div className="flex items-center gap-3 border-t border-[#e0dcd2] bg-[#f6f3ec] px-6 py-4">
          <button
            type="button"
            onClick={onClearAll}
            disabled={activeCount === 0}
            className="rounded-full border border-[#c8c4b8] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#42524a] transition-colors hover:border-[#183024] hover:text-[#183024] disabled:cursor-not-allowed disabled:border-[#dcd8ce] disabled:text-[#9aa199] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d56742]"
          >
            Xóa tất cả
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full bg-[#183024] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-[#b4502f] hover:shadow-[0_10px_24px_rgba(180,80,47,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
          >
            Xem {resultCount} hành trình
          </button>
        </div>
      </div>
    </div>
  )
}
