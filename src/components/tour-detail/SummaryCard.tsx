import type { TourDetails } from "@/data/toursRepository"
import { priceLabel } from "@/components/ui/TourCard"
import { FORM_ID } from "@/components/services/ServiceForm"
import { navigateTo } from "@/lib/useHashRoute"

/** Desktop facts and from-price card, sticky beside the tour content. */
export default function SummaryCard({ tour }: { tour: TourDetails }) {
  const facts: [string, string][] = []
  if (tour.durationLabel) facts.push(["Thời lượng", tour.durationLabel])
  if (tour.departureText) facts.push(["Khởi hành", tour.departureText])
  if (tour.groupLabel) facts.push(["Quy mô", tour.groupLabel])
  else if (tour.groupMax) facts.push(["Quy mô", `Tối đa ${tour.groupMax} khách`])
  const difficulty =
    tour.difficulty === "de"
      ? "Nhẹ nhàng"
      : tour.difficulty === "vua"
        ? "Vừa sức"
        : tour.difficulty === "kho"
          ? "Thử thách"
          : null
  if (difficulty) facts.push(["Độ khó", difficulty])
  if (tour.destinations.length > 0) facts.push(["Điểm đến", tour.destinations.join(" · ")])
  const enquiryQuery = new URLSearchParams({ service: "general", tour: tour.slug }).toString()

  return (
    <section aria-labelledby="tour-summary-title" className="hidden xl:block">
      <div className="sticky top-[104px] rounded-panel bg-paper p-6 shadow-card">
        <h2 id="tour-summary-title" className="m-0 font-display text-[22px] font-bold leading-[33px] text-ink">
          Chi tiết tour
        </h2>
        <p className="m-0 mt-2 font-display text-[22px] font-bold leading-9 text-ink">
          {priceLabel(tour)}
        </p>
        <p className="m-0 mt-1 text-[12px] leading-5 text-subtle">
          Giá xác nhận theo ngày đi và số người.
        </p>
        {facts.length > 0 && (
          <dl className="m-0 mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-4">
            {facts.map(([label, value]) => (
              <div key={label} className={label === "Điểm đến" ? "col-span-2" : "min-w-0"}>
                <dt className="text-xs leading-5 text-subtle">{label}</dt>
                <dd className="m-0 mt-0.5 break-words text-sm font-bold leading-5 text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <a
          href={`#/services?${enquiryQuery}`}
          onClick={(event) => {
            event.preventDefault()
            navigateTo("/services", enquiryQuery, { scrollTo: FORM_ID })
          }}
          className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-button bg-forest px-5 text-[15px] font-bold text-paper transition-colors hover:bg-forest-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Gửi yêu cầu tư vấn
        </a>
      </div>
    </section>
  )
}
