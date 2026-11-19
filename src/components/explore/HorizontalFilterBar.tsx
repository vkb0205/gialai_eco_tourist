import { useEffect, useRef, useState } from "react"
import { CaretDown, Check, FunnelSimple, X } from "@phosphor-icons/react"
import { facetGroups, facetOptionLabel, themeLabel } from "@/data/filters"
import type { FacetKey } from "@/data/filters"
import { regions } from "@/data/regions"
import { SORT_LABELS, SORT_MODES } from "@/lib/filterTours"
import type { FilterState, SortMode } from "@/lib/filterTours"

interface HorizontalFilterBarProps {
  state: FilterState
  facetCounts: Record<FacetKey, Record<string, number>>
  regionCounts: Record<string, number>
  onToggleRegion: (slug: string) => void
  onSelectAllRegions: () => void
  onToggleFacet: (groupKey: FacetKey, value: string) => void
  onSortChange: (sort: SortMode) => void
  onOpenMobileDrawer: () => void
  mobileTriggerRef?: React.RefObject<HTMLButtonElement | null>
}

const REGION_STYLES: Record<
  string,
  { label: string; inactiveClass: string; activeClass: string }
> = {
  "tay-nguyen": {
    label: "Tây Nguyên",
    inactiveClass:
      "bg-leaf text-ink border border-ink/20 hover:border-forest/60",
    activeClass:
      "bg-leaf text-ink border-2 border-forest ring-1 ring-forest/40 font-bold shadow-xs",
  },
  "mien-bac": {
    label: "Miền Bắc",
    inactiveClass:
      "bg-sky text-ink border border-ink/20 hover:border-lake/60",
    activeClass:
      "bg-sky text-ink border-2 border-lake ring-1 ring-lake/40 font-bold shadow-xs",
  },
  "mien-trung": {
    label: "Miền Trung",
    inactiveClass:
      "bg-blush text-ink border border-ink/20 hover:border-coral/60",
    activeClass:
      "bg-blush text-ink border-2 border-coral ring-1 ring-coral/40 font-bold shadow-xs",
  },
  "mien-nam": {
    label: "Miền Nam",
    inactiveClass:
      "bg-sunlight text-ink border border-ink/20 hover:border-clay/60",
    activeClass:
      "bg-sunlight text-ink border-2 border-clay ring-1 ring-clay/40 font-bold shadow-xs",
  },
}

const EXTRA_FACET_KEYS: FacetKey[] = facetGroups
  .filter((group) => group.key !== "theme" && group.key !== "duration")
  .map((group) => group.key)

const REGION_WIDTHS: Record<string, string> = {
  "tay-nguyen": "w-[124px]",
  "mien-bac": "w-[104px]",
  "mien-trung": "w-[116px]",
  "mien-nam": "w-[108px]",
}

export default function HorizontalFilterBar({
  state,
  facetCounts,
  regionCounts,
  onToggleRegion,
  onSelectAllRegions,
  onToggleFacet,
  onSortChange,
  onOpenMobileDrawer,
  mobileTriggerRef,
}: HorizontalFilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<
    "theme" | "duration" | "sort" | "extra" | null
  >(null)
  const barRef = useRef<HTMLDivElement | null>(null)

  // Close dropdown on outside click or escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const activeDropdown = barRef.current?.querySelector(
        `[data-filter-dropdown="${openDropdown}"]`,
      )
      if (!activeDropdown?.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenDropdown(null)
      }
    }

    if (openDropdown !== null) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [openDropdown])

  const themeGroup = facetGroups.find((g) => g.key === "theme")
  const durationGroup = facetGroups.find((g) => g.key === "duration")

  const selectedThemes = state.facets.theme ?? []
  const selectedDurations = state.facets.duration ?? []

  const themeButtonLabel =
    selectedThemes.length === 0
      ? "Tất cả chủ đề"
      : selectedThemes.length === 1
        ? themeLabel(selectedThemes[0])
        : `${selectedThemes.length} chủ đề`

  const durationButtonLabel =
    selectedDurations.length === 0
      ? "Mọi độ dài"
      : selectedDurations.length === 1
        ? facetOptionLabel("duration", selectedDurations[0])
        : `${selectedDurations.length} thời lượng`

  const sortButtonLabel = SORT_LABELS[state.sort] ?? "Được hỏi nhiều nhất"

  const extraFacetCount = EXTRA_FACET_KEYS.reduce(
    (total, key) => total + (state.facets[key]?.length || 0),
    0,
  )

  const isAllRegions = state.regions.length === 0

  return (
    <nav
      ref={barRef}
      aria-label="Thanh lọc hành trình"
      className="relative border-y border-line bg-paper py-3.5 lg:min-h-[136px] lg:pb-[43px] lg:pt-[23px]"
    >
      <div className="page-container">
        {/* Mobile quick strip */}
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              type="button"
              onClick={onSelectAllRegions}
              className={`inline-flex min-h-10 shrink-0 items-center justify-center rounded-full px-4 text-sm font-bold transition-all ${
                isAllRegions
                  ? "bg-forest text-paper shadow-xs"
                  : "border border-ink/20 bg-paper text-ink"
              }`}
            >
              Tất cả
            </button>
            {regions.map((region) => {
              const active = state.regions.includes(region.slug)
              const styling = REGION_STYLES[region.slug]
              return (
                <button
                  key={region.slug}
                  type="button"
                  onClick={() => onToggleRegion(region.slug)}
                  className={`inline-flex min-h-10 shrink-0 items-center justify-center rounded-full px-4 text-sm font-bold transition-all ${
                    active ? styling.activeClass : styling.inactiveClass
                  }`}
                >
                  {region.name}
                  {regionCounts[region.slug] !== undefined && (
                    <span className="ml-1.5 opacity-60 text-xs">
                      {regionCounts[region.slug]}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <button
            ref={mobileTriggerRef}
            type="button"
            onClick={onOpenMobileDrawer}
            aria-label="Mở bộ lọc và sắp xếp"
            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-ink/20 bg-paper px-4 text-sm font-bold text-ink hover:bg-leaf"
          >
            <FunnelSimple size={15} aria-hidden="true" />
            Lọc
            {extraFacetCount + selectedThemes.length + selectedDurations.length >
              0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-forest text-[11px] font-bold text-paper">
                {extraFacetCount +
                  selectedThemes.length +
                  selectedDurations.length}
              </span>
            )}
          </button>
        </div>

        {/* Desktop full horizontal filter bar */}
        <div className="hidden lg:flex lg:flex-wrap lg:items-start lg:justify-between lg:gap-4">
          {/* VÙNG section */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-bold uppercase tracking-[0.8px] text-subtle">
              VÙNG
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onSelectAllRegions}
                className={`inline-flex h-11 min-h-11 w-[88px] items-center justify-center rounded-full px-0 text-[15px] font-bold transition-all ${
                  isAllRegions
                    ? "bg-forest text-paper shadow-xs"
                    : "border border-ink/20 bg-paper text-ink hover:bg-leaf/40"
                }`}
              >
                Tất cả
              </button>

              {regions.map((region) => {
                const active = state.regions.includes(region.slug)
                const styling = REGION_STYLES[region.slug]
                return (
                  <button
                    key={region.slug}
                    type="button"
                    onClick={() => onToggleRegion(region.slug)}
                    className={`inline-flex h-11 min-h-11 ${REGION_WIDTHS[region.slug] ?? ""} items-center justify-center rounded-full px-0 text-[15px] font-bold transition-all ${
                      active ? styling.activeClass : styling.inactiveClass
                    }`}
                  >
                    {region.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Facets & Sort dropdowns */}
          <div className="explore-filter-controls flex items-center gap-3 xl:gap-4">
            {/* CHỦ ĐỀ dropdown */}
            <div
              data-filter-dropdown="theme"
              className="relative flex flex-col gap-1.5"
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.8px] text-subtle">
                CHỦ ĐỀ
              </span>
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={openDropdown === "theme"}
                onClick={() =>
                  setOpenDropdown((prev) => (prev === "theme" ? null : "theme"))
                }
                className={`inline-flex h-11 min-h-11 w-[200px] items-center justify-between gap-2 rounded-full border px-5 text-[15px] font-bold text-ink transition-all ${
                  selectedThemes.length > 0
                    ? "border-forest bg-leaf/40 shadow-xs"
                    : "border-ink/20 bg-paper hover:bg-leaf/30"
                }`}
              >
                <span className="truncate">{themeButtonLabel}</span>
                <CaretDown
                  size={14}
                  aria-hidden="true"
                  className={`shrink-0 transition-transform ${
                    openDropdown === "theme" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown === "theme" && themeGroup && (
                <div
                  role="menu"
                  className="absolute left-0 top-full z-40 mt-2 w-64 rounded-panel border border-line bg-paper p-3 shadow-search animate-[rise-in_160ms_ease-out]"
                >
                  <div className="flex flex-col gap-1">
                    {themeGroup.options.map((option) => {
                      const selected = selectedThemes.includes(option.value)
                      const count = facetCounts.theme?.[option.value] ?? 0
                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="menuitemcheckbox"
                          aria-checked={selected}
                          onClick={() => onToggleFacet("theme", option.value)}
                          className={`flex min-h-11 w-full items-center justify-between rounded-field px-3 py-2 text-left text-sm transition-colors ${
                            selected
                              ? "bg-leaf font-bold text-forest"
                              : "text-ink hover:bg-air"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`flex size-4 items-center justify-center rounded border ${
                                selected
                                  ? "border-forest bg-forest text-paper"
                                  : "border-subtle/40"
                              }`}
                            >
                              {selected && <Check size={12} weight="bold" />}
                            </span>
                            {option.label}
                          </span>
                          <span className="text-xs text-subtle tabular-nums">
                            {count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* THỜI LƯỢNG dropdown */}
            <div
              data-filter-dropdown="duration"
              className="relative flex flex-col gap-1.5"
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.8px] text-subtle">
                THỜI LƯỢNG
              </span>
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={openDropdown === "duration"}
                onClick={() =>
                  setOpenDropdown((prev) =>
                    prev === "duration" ? null : "duration",
                  )
                }
                className={`inline-flex h-11 min-h-11 w-[168px] items-center justify-between gap-2 rounded-full border px-5 text-[15px] font-bold text-ink transition-all ${
                  selectedDurations.length > 0
                    ? "border-forest bg-leaf/40 shadow-xs"
                    : "border-ink/20 bg-paper hover:bg-leaf/30"
                }`}
              >
                <span className="truncate">{durationButtonLabel}</span>
                <CaretDown
                  size={14}
                  aria-hidden="true"
                  className={`shrink-0 transition-transform ${
                    openDropdown === "duration" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown === "duration" && durationGroup && (
                <div
                  role="menu"
                  className="absolute left-0 top-full z-40 mt-2 w-64 rounded-panel border border-line bg-paper p-3 shadow-search animate-[rise-in_160ms_ease-out]"
                >
                  <div className="flex flex-col gap-1">
                    {durationGroup.options.map((option) => {
                      const selected = selectedDurations.includes(option.value)
                      const count = facetCounts.duration?.[option.value] ?? 0
                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="menuitemcheckbox"
                          aria-checked={selected}
                          onClick={() =>
                            onToggleFacet("duration", option.value)
                          }
                          className={`flex min-h-11 w-full items-center justify-between rounded-field px-3 py-2 text-left text-sm transition-colors ${
                            selected
                              ? "bg-leaf font-bold text-forest"
                              : "text-ink hover:bg-air"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className={`flex size-4 items-center justify-center rounded border ${
                                selected
                                  ? "border-forest bg-forest text-paper"
                                  : "border-subtle/40"
                              }`}
                            >
                              {selected && <Check size={12} weight="bold" />}
                            </span>
                            {option.label}
                          </span>
                          <span className="text-xs text-subtle tabular-nums">
                            {count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* SẮP XẾP dropdown */}
            <div
              data-filter-dropdown="sort"
              className="relative flex flex-col gap-1.5"
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.8px] text-subtle">
                SẮP XẾP
              </span>
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={openDropdown === "sort"}
                onClick={() =>
                  setOpenDropdown((prev) => (prev === "sort" ? null : "sort"))
                }
                className="inline-flex h-11 min-h-11 w-[244px] items-center justify-between gap-2 rounded-full border border-ink/20 bg-paper px-5 text-[15px] font-bold text-ink transition-all hover:bg-leaf/30"
              >
                <span className="truncate">{sortButtonLabel}</span>
                <CaretDown
                  size={14}
                  aria-hidden="true"
                  className={`shrink-0 transition-transform ${
                    openDropdown === "sort" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown === "sort" && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-40 mt-2 w-64 rounded-panel border border-line bg-paper p-3 shadow-search animate-[rise-in_160ms_ease-out]"
                >
                  <div className="flex flex-col gap-1">
                    {SORT_MODES.map((mode) => {
                      const selected = state.sort === mode
                      return (
                        <button
                          key={mode}
                          type="button"
                          role="menuitemradio"
                          aria-checked={selected}
                          onClick={() => {
                            onSortChange(mode)
                            setOpenDropdown(null)
                          }}
                          className={`flex min-h-11 w-full items-center justify-between rounded-field px-3 py-2 text-left text-sm transition-colors ${
                            selected
                              ? "bg-leaf font-bold text-forest"
                              : "text-ink hover:bg-air"
                          }`}
                        >
                          <span>{SORT_LABELS[mode]}</span>
                          {selected && <Check size={14} weight="bold" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* BỘ LỌC KHÁC dropdown */}
            <div
              data-filter-dropdown="extra"
              className="relative flex flex-col gap-1.5"
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.8px] text-subtle">
                BỘ LỌC
              </span>
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={openDropdown === "extra"}
                onClick={() =>
                  setOpenDropdown((prev) =>
                    prev === "extra" ? null : "extra",
                  )
                }
                className={`inline-flex h-11 min-h-11 items-center gap-2 rounded-full border px-5 text-[15px] font-bold transition-all ${
                  extraFacetCount > 0
                    ? "border-forest bg-leaf text-forest shadow-xs"
                    : "border-ink/20 bg-paper text-ink hover:bg-leaf/30"
                }`}
              >
                <FunnelSimple size={15} aria-hidden="true" />
                <span>Bộ lọc khác</span>
                {extraFacetCount > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-forest text-[11px] font-bold text-paper">
                    {extraFacetCount}
                  </span>
                )}
                <CaretDown
                  size={14}
                  aria-hidden="true"
                  className={`shrink-0 transition-transform ${
                    openDropdown === "extra" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown === "extra" && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-40 mt-2 max-h-[75vh] w-80 overflow-y-auto rounded-panel border border-line bg-paper p-4 shadow-search animate-[rise-in_160ms_ease-out] xl:bottom-full xl:top-auto xl:mb-2 xl:mt-0"
                >
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <span className="text-sm font-bold text-ink">
                      Bộ lọc bổ sung
                    </span>
                    {extraFacetCount > 0 && (
                      <span className="text-xs font-semibold text-subtle">
                        {extraFacetCount} đã chọn
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-col divide-y divide-line/60">
                    {EXTRA_FACET_KEYS.map((key) => {
                      const group = facetGroups.find((g) => g.key === key)
                      if (!group) return null
                      const selectedInGroup = state.facets[key] ?? []

                      return (
                        <div key={key} className="py-3 first:pt-0 last:pb-0">
                          <p className="m-0 mb-2 text-xs font-bold uppercase tracking-wider text-subtle">
                            {group.label}
                          </p>
                          <div className="flex flex-col gap-1">
                            {group.options.map((option) => {
                              const selected = selectedInGroup.includes(
                                option.value,
                              )
                              const count =
                                facetCounts[key]?.[option.value] ?? 0
                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  role="menuitemcheckbox"
                                  aria-checked={selected}
                                  onClick={() =>
                                    onToggleFacet(key, option.value)
                                  }
                                  className={`flex min-h-9 w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs transition-colors ${
                                    selected
                                      ? "bg-leaf font-bold text-forest"
                                      : "text-ink hover:bg-air"
                                  }`}
                                >
                                  <span className="flex items-center gap-2">
                                    <span
                                      className={`flex size-3.5 items-center justify-center rounded border ${
                                        selected
                                          ? "border-forest bg-forest text-paper"
                                          : "border-subtle/40"
                                      }`}
                                    >
                                      {selected && (
                                        <Check size={10} weight="bold" />
                                      )}
                                    </span>
                                    {option.label}
                                  </span>
                                  <span className="text-xs text-subtle tabular-nums">
                                    {count}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
