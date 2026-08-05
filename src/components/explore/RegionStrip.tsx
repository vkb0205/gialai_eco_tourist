import { regions } from "@/data/regions"

/**
 * Horizontal scroll-snap row of region pills.
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
    <section aria-labelledby="region-strip-heading" className="min-w-0">
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id="region-strip-heading"
          className="m-0 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b665d]"
        >
          Vùng miền
        </h2>
        <span
          aria-hidden="true"
          className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-[#9aa199] sm:block"
        >
          {regions.length} vùng · bắc vào nam
        </span>
      </div>

      <div
        className="-mx-6 mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-wrap lg:px-0 lg:pb-0"
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
              className={`flex shrink-0 snap-start items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d56742] ${
                active
                  ? "border-[#183024] bg-[#183024] text-white shadow-[0_6px_18px_rgba(24,48,36,0.22)]"
                  : disabled
                    ? "cursor-not-allowed border-[#dcd8ce] bg-transparent text-[#9aa199]"
                    : "border-[#dcd8ce] bg-white text-[#42524a] hover:-translate-y-0.5 hover:border-[#183024] hover:text-[#183024] hover:shadow-[0_6px_16px_rgba(24,48,36,0.1)]"
              }`}
            >
              {region.name}
              <span
                className={`text-[10px] font-semibold tabular-nums ${
                  active
                    ? "text-white/80"
                    : disabled
                      ? "text-[#9aa199]"
                      : "text-[#69746b]"
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
