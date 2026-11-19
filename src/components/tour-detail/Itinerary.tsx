import type { TourItineraryDay, TourItineraryItem } from "@/data/toursRepository"

const TONES = ["bg-sunlight", "bg-sky", "bg-blush", "bg-leaf"]
const DAY_PARTS = ["Sáng", "Trưa", "Chiều", "Tối"]

function rowLabel(item: TourItineraryItem): string {
  const candidate = item.timeLabel?.trim() ?? ""
  if (DAY_PARTS.includes(candidate)) return candidate
  if (DAY_PARTS.includes(item.title)) return item.title

  const hour = Number((item.startTime ?? "").slice(0, 2))
  if (Number.isFinite(hour) && item.startTime) {
    if (hour < 11) return "Sáng"
    if (hour < 14) return "Trưa"
    if (hour < 18) return "Chiều"
    return "Tối"
  }

  return ""
}

function Day({ day, index }: { day: TourItineraryDay; index: number }) {
  const rows = day.items.filter((item) => item.title || item.description)

  return (
    <li className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-[56px_minmax(0,1fr)] md:gap-6">
      <div className={`hidden size-14 flex-col items-center justify-center rounded-button text-xs font-bold leading-4 text-ink md:flex ${TONES[index % TONES.length]}`}>
        Ngày
        <span className="text-base">{day.dayNumber}</span>
      </div>
      <article className="min-h-[416px] min-w-0 rounded-card bg-paper p-4 shadow-card md:min-h-[248px] md:p-6">
        <header className="flex min-h-10 items-center gap-4 md:min-h-0">
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-button text-lg font-bold text-ink md:hidden ${TONES[index % TONES.length]}`}>
            {day.dayNumber}
          </span>
          <div className="min-w-0">
            <p className="m-0 text-xs font-bold uppercase leading-[18px] tracking-[0.4px] text-forest md:hidden">
              Ngày {day.dayNumber}
            </p>
            <h3 className="m-0 font-display text-[18px] font-bold leading-[26px] text-ink md:text-[22px] md:leading-[33px]">
              {day.title}
            </h3>
          </div>
        </header>

        {rows.length > 0 ? (
          <dl className="m-0 mt-6 grid gap-5 md:mt-4 md:gap-[18px]">
            {rows.map((item) => {
              const label = rowLabel(item)
              const isSummary = item.title === day.title && !item.description
              if (isSummary) return null
              return (
                <div key={`${item.order}-${item.title}`} className="grid grid-cols-[56px_minmax(0,1fr)] gap-3 md:grid-cols-[68px_minmax(0,1fr)] md:gap-4">
                  <dt className="text-[13px] font-bold leading-[20px] text-forest md:text-sm md:leading-[21px]">
                    {label}
                  </dt>
                  <dd className="m-0 whitespace-pre-line text-sm leading-[22px] text-body md:text-[15px]">
                    {item.title && item.title !== label && (
                      <strong className="font-semibold text-ink">{item.title}{item.description ? " " : ""}</strong>
                    )}
                    {item.description}
                    {item.destination && (
                      <span className="mt-1 block text-xs text-subtle">{item.destination}</span>
                    )}
                  </dd>
                </div>
              )
            })}
          </dl>
        ) : day.body ? (
          <p className="m-0 mt-5 whitespace-pre-line text-sm leading-[22px] text-body md:text-[15px]">
            {day.body}
          </p>
        ) : null}

        {(day.meals.length > 0 || day.overnightLocation) && (
          <p className="m-0 mt-5 border-t border-line pt-3 text-[13px] leading-5 text-subtle">
            {day.meals.length > 0 && <><strong className="text-ink">Bữa ăn:</strong> {day.meals.join(" · ")}</>}
            {day.meals.length > 0 && day.overnightLocation && "  ·  "}
            {day.overnightLocation && <><strong className="text-ink">Nghỉ đêm:</strong> {day.overnightLocation}{day.accommodationNotes ? ` — ${day.accommodationNotes}` : ""}</>}
          </p>
        )}
      </article>
    </li>
  )
}

export default function Itinerary({ days }: { days: TourItineraryDay[] }) {
  return (
    <ol className="m-0 grid list-none gap-5 p-0 md:gap-8">
      {days.map((day, index) => <Day key={day.dayNumber} day={day} index={index} />)}
    </ol>
  )
}
