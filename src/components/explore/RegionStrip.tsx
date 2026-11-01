import { regions } from "@/data/regions"

/**
 * Region chips, wrapped onto as many lines as they need.
 *
 * Regions stay in fixed north-to-south order and a region with no matches is
 * shown disabled with its zero count rather than removed (FR-010), so the
 * geography of the catalogue never appears to change under the traveller.
 */
export default function RegionStrip({
  selected,
  counts,
  onToggle,
}: {
  selected: string[]
  counts: Record<string, number>
  onToggle: (slug: string) => void
}) {
  return (
    <section
      aria-labelledby="region-strip-heading"
      className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:gap-6"
    >
      <h2
        id="region-strip-heading"
        className="m-0 shrink-0 font-display text-2xl tracking-[-0.02em] text-[#183024]"
      >
        Chọn vùng miền
      </h2>

      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Lọc theo vùng miền"
      >
        {regions.map((region) => {
          const count = counts[region.slug] ?? 0
          const active = selected.includes(region.slug)
          // A selected region always stays operable, so it can be deselected
          // even when its own count reads zero under other constraints.
          const disabled = count === 0 && !active

          return (
            <button
              key={region.slug}
              type="button"
              onClick={() => onToggle(region.slug)}
              disabled={disabled}
              aria-pressed={active}
              title={region.characterisation}
              className={`group flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full px-5 text-[15px] font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024] ${
                active
                  ? "bg-[#183024] text-white"
                  : disabled
                    ? "cursor-not-allowed bg-[#dddbd3] text-[#4f5b53]"
                    : "bg-white text-[#183024] enabled:hover:bg-[#183024] enabled:hover:text-white"
              }`}
            >
              {region.name}
              <span
                className={`text-sm font-medium tabular-nums ${
                  active
                    ? "text-white"
                    : "text-[#4f5b53] group-enabled:group-hover:text-white group-disabled:text-[#4f5b53]"
                }`}
              >
                {count}
              </span>
              <span className="sr-only">
                {count === 1 ? "1 hành trình" : `${count} hành trình`}
                {disabled ? ", không khả dụng với bộ lọc hiện tại" : ""}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
