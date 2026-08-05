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
    <div className="flex flex-col gap-0 divide-y divide-[#e0dcd2]">
      {facetGroups.map((group) => {
        const selected = state.facets[group.key] ?? []
        const isSingle = group.mode === "single"

        return (
          <details key={group.key} className="group/details">
            <summary className="flex cursor-pointer items-center justify-between gap-3 px-1 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5b665d] select-none outline-none focus-visible:rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d56742]">
              <span>{group.label}</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-open/details:rotate-180"
              >
                ▼
              </span>
            </summary>

            <div className="pb-4 pl-0 pr-1">
              <div className="space-y-1">
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
                          className="peer h-4 w-4 shrink-0 cursor-pointer accent-[#183024] disabled:cursor-not-allowed"
                        />
                      ) : (
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => onToggle(group.key, option.value)}
                          className="peer h-4 w-4 shrink-0 cursor-pointer accent-[#183024] disabled:cursor-not-allowed"
                        />
                      )}
                      <label
                        htmlFor={inputId}
                        className={`flex flex-1 cursor-pointer items-baseline justify-between gap-3 rounded-md py-1.5 pl-3 text-[13px] leading-5 transition-colors peer-disabled:cursor-not-allowed peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#d56742] ${
                          disabled
                            ? "text-[#9aa199]"
                            : checked
                              ? "font-semibold text-[#183024]"
                              : "text-[#42524a] hover:text-[#183024]"
                        }`}
                      >
                        <span>{option.label}</span>
                        <span
                          className={`text-[11px] tabular-nums ${
                            disabled ? "text-[#9aa199]" : "text-[#69746b]"
                          }`}
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
