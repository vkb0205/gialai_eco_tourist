import { CaretDown } from "@phosphor-icons/react"
import { facetGroups } from "@/data/filters"
import type { FacetKey } from "@/data/filters"
import type { FilterState } from "@/lib/filterTours"

/**
 * Renders facet groups as collapsible accordion sections.
 *
 * Each group label is a clickable <summary> that expands to reveal
 * its options as checkboxes (multi-select) or radio buttons (single).
 * All filter logic, onToggle callbacks, count displays, and disabled
 * states are preserved unchanged.
 */
export default function FacetGroups({
  state,
  counts,
  onToggle,
  idPrefix,
  /** Distinguishes the rail's inputs from the drawer's duplicate set. */
}: {
  state: FilterState
  counts: Record<FacetKey, Record<string, number>>
  onToggle: (groupKey: FacetKey, value: string) => void
  idPrefix: string
}) {
  return (
    <div className="flex flex-col gap-3">
      {facetGroups.map((group) => {
        const selected = state.facets[group.key] ?? []
        const isSingle = group.mode === "single"

        return (
          <details
            key={group.key}
            className="group/details"
            open={group.key === "theme" || group.key === "duration" || selected.length > 0}
          >
            <summary className="flex min-h-11 cursor-pointer select-none items-center justify-between gap-3 rounded-[2px] bg-[#ecebe5] px-4 py-2 text-[16px] font-semibold text-[#183024] outline-none transition-colors hover:bg-[#e2e1d9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]">
              <span>{group.label}</span>
              <CaretDown
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-open/details:rotate-180"
              />
            </summary>

            <div className="px-1 pb-2 pt-2">
              <div className="space-y-0.5">
                {group.options.map((option) => {
                  const count = counts[group.key]?.[option.value] ?? 0
                  const checked = selected.includes(option.value)
                  // Keep a checked option operable so it can always be undone.
                  const disabled = count === 0 && !checked
                  const inputId = `${idPrefix}-${group.key}-${option.value}`

                  return (
                    <div key={option.value} className="flex items-center">
                      {isSingle ? (
                        <input
                          id={inputId}
                          type="radio"
                          name={`${idPrefix}-${group.key}`}
                          value={option.value}
                          checked={checked}
                          disabled={disabled}
                          onChange={() => onToggle(group.key, option.value)}
                          className="peer h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#183024] disabled:cursor-not-allowed"
                        />
                      ) : (
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => onToggle(group.key, option.value)}
                          className="peer h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#183024] disabled:cursor-not-allowed"
                        />
                      )}
                      <label
                        htmlFor={inputId}
                        className={`flex flex-1 cursor-pointer items-baseline justify-between gap-3 min-h-9 rounded-[2px] py-1.5 pl-3 text-[16px] leading-6 transition-colors peer-disabled:cursor-not-allowed peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#183024] ${
                          disabled
                            ? "text-[#4f5b53]"
                            : checked
                              ? "font-semibold text-[#183024]"
                              : "text-[#2f3d35] hover:text-[#183024]"
                        }`}
                      >
                        <span>{option.label}</span>
                        <span
                          className="text-sm tabular-nums text-[#4f5b53]"
                        >
                          {count}
                        </span>
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
          </details>
        )
      })}
    </div>
  )
}
