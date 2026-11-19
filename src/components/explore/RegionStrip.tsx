import { regions } from "@/data/regions"

/** Pastel tone per region, matching the v2 design's colourful chips. */
const TONES: Record<string, string> = {
  "tay-nguyen": "bg-leaf",
  "mien-bac": "bg-sky",
  "mien-trung": "bg-blush",
  "mien-nam": "bg-sunlight",
}

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
      className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:gap-5"
    >
      <h2
        id="region-strip-heading"
        className="m-0 shrink-0 text-xs font-bold uppercase tracking-[0.8px] text-subtle"
      >
        Vùng
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
              className={`flex min-h-11 items-center gap-2 whitespace-nowrap rounded-button border px-5 text-[15px] font-bold text-ink transition-colors ${
                active
                  ? "border-forest bg-forest text-paper"
                  : disabled
                    ? "cursor-not-allowed border-line bg-line text-subtle"
                    : `border-ink/20 ${TONES[region.slug] ?? "bg-leaf"} hover:border-ink`
              }`}
            >
              {region.name}
              <span className="text-sm font-medium tabular-nums">{count}</span>
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
