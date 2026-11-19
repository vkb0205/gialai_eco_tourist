import { Check, Minus } from "@phosphor-icons/react"
import type { TourDetails } from "@/data/toursRepository"

function ServiceList({
  title,
  items,
  included,
}: {
  title: string
  items: string[]
  included: boolean
}) {
  if (items.length === 0) return null
  const Icon = included ? Check : Minus

  return (
    <section>
      <h3 className="m-0 text-base font-bold leading-6 text-ink md:text-lg md:leading-[27px]">
        {title}
      </h3>
      <ul className="m-0 mt-3 grid list-none gap-2 p-0">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-[22px] text-body md:text-[15px]">
            <Icon
              size={17}
              weight="bold"
              aria-hidden="true"
              className={`mt-0.5 shrink-0 ${included ? "text-forest" : "text-clay"}`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Includes and exclusions shown as one combined service block. */
export default function PriceBlock({ tour }: { tour: TourDetails }) {
  if (tour.inclusions.length === 0 && tour.exclusions.length === 0) return null

  return (
    <div className="min-h-[288px] rounded-card bg-leaf p-5 md:min-h-0 md:p-8">
      <div className="md:hidden">
        {tour.inclusions.length > 0 && (
          <ul className="m-0 grid list-none gap-1 p-0 text-base font-medium leading-8 text-ink">
            {tour.inclusions.map((item) => <li key={item}>{item}</li>)}
          </ul>
        )}
        {tour.exclusions.length > 0 && (
          <p className="m-0 mt-5 text-sm leading-6 text-body">
            <strong className="font-semibold text-ink">Chưa gồm:</strong> {tour.exclusions.join(", ")}.
          </p>
        )}
      </div>
      <div className="hidden gap-6 md:grid md:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] md:gap-7">
        <ServiceList title="Đã gồm trong giá" items={tour.inclusions} included />
        {tour.inclusions.length > 0 && tour.exclusions.length > 0 && <div aria-hidden="true" className="w-px bg-forest/15" />}
        <ServiceList title="Chưa gồm" items={tour.exclusions} included={false} />
      </div>
    </div>
  )
}
