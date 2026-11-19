import { CaretDown } from "@phosphor-icons/react"
import { facetGroups } from "@/data/filters"
import type { FacetKey } from "@/data/filters"
import { regions } from "@/data/regions"
import { SORT_LABELS, SORT_MODES } from "@/lib/filterTours"
import type { FilterState, SortMode } from "@/lib/filterTours"

const EXTRA_FACET_KEYS: FacetKey[] = [
  "price",
  "difficulty",
  "season",
  "group",
  "tourGroup",
  "destination",
  "special",
]

const REGION_TONES: Record<string, string> = {
  "tay-nguyen": "bg-leaf",
  "mien-bac": "bg-sky",
  "mien-trung": "bg-blush",
  "mien-nam": "bg-sunlight",
}

function FacetOptions({
  groupKey,
  state,
  counts,
  idPrefix,
  onToggle,
}: {
  groupKey: FacetKey
  state: FilterState
  counts: Record<FacetKey, Record<string, number>>
  idPrefix: string
  onToggle: (groupKey: FacetKey, value: string) => void
}) {
  const group = facetGroups.find((candidate) => candidate.key === groupKey)
  if (!group) return null

  const selected = state.facets[groupKey] ?? []
  const isSingle = group.mode === "single"

  return (
    <div className="flex flex-col gap-1">
      {group.options.map((option) => {
        const count = counts[groupKey]?.[option.value] ?? 0
        const checked = selected.includes(option.value)
        const disabled = count === 0 && !checked
        const inputId = `${idPrefix}-${groupKey}-${option.value}`

        return (
          <label
            key={option.value}
            htmlFor={inputId}
            title={option.label}
            className={`flex h-11 min-h-11 w-full cursor-pointer items-center gap-3 rounded-field px-3 text-sm transition-colors hover:bg-leaf/60 ${
              checked ? "bg-leaf/70 font-bold text-forest" : "text-body"
            } ${disabled ? "cursor-not-allowed text-subtle" : ""}`}
          >
            <input
              id={inputId}
              type={isSingle ? "radio" : "checkbox"}
              name={`${idPrefix}-${groupKey}`}
              value={option.value}
              checked={checked}
              disabled={disabled}
              onChange={() => onToggle(groupKey, option.value)}
              className="size-4 shrink-0 accent-forest disabled:cursor-not-allowed"
            />
            <span className="min-w-0 flex-1 truncate">{option.label}</span>
            <span className="shrink-0 text-xs font-medium tabular-nums text-subtle">
              {count}
            </span>
          </label>
        )
      })}
    </div>
  )
}

export default function ExploreFilters({
  state,
  facetCounts,
  regionCounts,
  idPrefix,
  onToggleRegion,
  onSelectAllRegions,
  onToggleFacet,
  onSortChange,
  onClearAll,
  showRegions = true,
}: {
  state: FilterState
  facetCounts: Record<FacetKey, Record<string, number>>
  regionCounts: Record<string, number>
  idPrefix: string
  onToggleRegion: (slug: string) => void
  onSelectAllRegions: () => void
  onToggleFacet: (groupKey: FacetKey, value: string) => void
  onSortChange: (sort: SortMode) => void
  onClearAll: () => void
  showRegions?: boolean
}) {
  const allRegionsSelected = state.regions.length === 0
  const sections = [
    { key: "theme" as const, label: "Chủ đề" },
    { key: "duration" as const, label: "Thời lượng" },
  ]

  return (
    <div className="flex flex-col gap-5">
      {showRegions && (
        <section aria-labelledby={`${idPrefix}-regions-label`}>
          <h3
            id={`${idPrefix}-regions-label`}
            className="mb-2 text-xs font-bold uppercase tracking-[0.8px] text-subtle"
          >
            Vùng
          </h3>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc theo vùng">
            <button
              type="button"
              onClick={onSelectAllRegions}
              aria-pressed={allRegionsSelected}
              className={`inline-flex h-11 min-h-11 items-center justify-center rounded-full px-3 text-xs font-bold transition-colors ${
                allRegionsSelected
                  ? "bg-forest text-paper"
                  : "border border-ink/20 bg-paper text-ink hover:bg-leaf"
              }`}
            >
              Tất cả
            </button>
            {regions.map((region) => {
              const selected = state.regions.includes(region.slug)
              const count = regionCounts[region.slug] ?? 0
              return (
                <button
                  key={region.slug}
                  type="button"
                  onClick={() => onToggleRegion(region.slug)}
                  aria-pressed={selected}
                  className={`inline-flex h-11 min-h-11 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition-colors ${
                    selected
                      ? "border-forest bg-forest text-paper"
                      : `border-ink/15 ${REGION_TONES[region.slug] ?? "bg-leaf"} text-ink hover:border-forest/60`
                  }`}
                >
                  {region.name}
                  <span className="text-[11px] tabular-nums opacity-70">
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {sections.map(({ key, label }) => (
        <section key={key} aria-labelledby={`${idPrefix}-${key}-label`}>
          <h3
            id={`${idPrefix}-${key}-label`}
            className="mb-2 text-xs font-bold uppercase tracking-[0.8px] text-subtle"
          >
            {label}
          </h3>
          <FacetOptions
            groupKey={key}
            state={state}
            counts={facetCounts}
            idPrefix={idPrefix}
            onToggle={onToggleFacet}
          />
        </section>
      ))}

      <section aria-labelledby={`${idPrefix}-sort-label`}>
        <label
          id={`${idPrefix}-sort-label`}
          htmlFor={`${idPrefix}-sort`}
          className="mb-2 block text-xs font-bold uppercase tracking-[0.8px] text-subtle"
        >
          Sắp xếp
        </label>
        <div className="relative">
          <select
            id={`${idPrefix}-sort`}
            value={state.sort}
            onChange={(event) => onSortChange(event.target.value as SortMode)}
            className="h-11 min-h-11 w-full appearance-none rounded-field border border-ink/15 bg-paper px-3 pr-9 text-sm font-bold text-ink hover:bg-leaf/40"
          >
            {SORT_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {SORT_LABELS[mode]}
              </option>
            ))}
          </select>
          <CaretDown
            size={15}
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink"
          />
        </div>
      </section>

      <section aria-labelledby={`${idPrefix}-extra-label`}>
        <h3
          id={`${idPrefix}-extra-label`}
          className="mb-2 text-xs font-bold uppercase tracking-[0.8px] text-subtle"
        >
          Bộ lọc khác
        </h3>
        <div className="flex flex-col gap-1">
          {EXTRA_FACET_KEYS.map((key) => {
            const group = facetGroups.find((candidate) => candidate.key === key)
            if (!group) return null
            const selected = state.facets[key] ?? []

            return (
              <details
                key={key}
                className="group/extra"
                open={selected.length > 0}
              >
                <summary className="flex h-11 min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-field px-3 text-sm font-semibold text-ink transition-colors hover:bg-air">
                  <span className="truncate">{group.label}</span>
                  {selected.length > 0 && (
                    <span className="ml-auto text-xs tabular-nums text-forest">
                      {selected.length}
                    </span>
                  )}
                  <CaretDown
                    size={14}
                    aria-hidden="true"
                    className="shrink-0 transition-transform group-open/extra:rotate-180"
                  />
                </summary>
                <div className="pb-2 pl-2 pt-1">
                  <FacetOptions
                    groupKey={key}
                    state={state}
                    counts={facetCounts}
                    idPrefix={idPrefix}
                    onToggle={onToggleFacet}
                  />
                </div>
              </details>
            )
          })}
        </div>
      </section>

      <div className="border-t border-line pt-3">
        <button
          type="button"
          onClick={onClearAll}
          className="min-h-10 text-sm font-bold text-forest underline underline-offset-4 hover:text-forest-hover"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  )
}
