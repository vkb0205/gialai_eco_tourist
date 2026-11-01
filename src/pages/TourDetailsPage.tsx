import { useEffect, useId, useState } from "react"
import {
  ArrowLeft,
  ArrowUpRight,
  Clock,
  MapPin,
  Users,
} from "@phosphor-icons/react"
import { regionName } from "@/data/regions"
import {
  loadPublishedTourDetails,
  type TourDetails,
  type TourItineraryDay,
  type TourItineraryItem,
  type TourPriceOption,
} from "@/data/toursRepository"
import { formatVnd } from "@/lib/text"
import { goToEnquiry } from "@/components/layout/Navigation"
import { navigateTo } from "@/lib/useHashRoute"

function PriceOption({ option }: { option: TourPriceOption }) {
  const guests =
    option.minGuests && option.maxGuests
      ? `${option.minGuests}–${option.maxGuests} khách`
      : option.minGuests
        ? `Từ ${option.minGuests} khách`
        : option.maxGuests
          ? `Tối đa ${option.maxGuests} khách`
          : null

  return (
    <li className="border-t border-[#e5e1d8] py-4 first:border-t-0 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="m-0 text-sm font-semibold text-[#183024]">
            {option.amountVnd === null
              ? "Liên hệ để biết giá"
              : formatVnd(option.amountVnd)}
          </p>
          <p className="mt-1 text-xs leading-5 text-[#566259]">
            {guests ?? "Theo điều kiện chương trình"}
            {option.priceBasis === "per_group" ? " · theo đoàn" : " · / khách"}
          </p>
        </div>
        {option.isCardPrice && (
          <span className="rounded-full bg-[#eef1e7] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#4f5d34]">
            Giá từ
          </span>
        )}
      </div>
      <p className="mt-2 text-xs leading-5 text-[#566259]">
        {option.conditionText}
      </p>
    </li>
  )
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null

  return (
    <ul className="m-0 grid list-none gap-3 p-0">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[15px] leading-6 text-[#47524a]">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b4502f]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

type NoteBlockProps = {
  label: string
  value: string | null
}

function NoteBlock({ label, value }: NoteBlockProps) {
  if (!value) return null

  return (
    <div className="border-t border-[#e5e1d8] pt-5">
      <p className="m-0 text-xs font-bold uppercase tracking-[0.15em] text-[#566259]">
        {label}
      </p>
      <p className="mt-2 whitespace-pre-line text-[15px] leading-6 text-[#47524a]">
        {value}
      </p>
    </div>
  )
}

function TourSummary({ tour }: { tour: TourDetails }) {
  return (
    <div className="mt-7 grid grid-cols-2 gap-3 border-y border-[#e5e1d8] py-5 sm:grid-cols-3">
      <div className="flex gap-2.5 text-sm text-[#42524a]">
        <Clock
          className="mt-0.5 h-4 w-4 shrink-0 text-[#566259]"
          aria-hidden="true"
        />
        <span>{tour.durationLabel}</span>
      </div>
      <div className="flex gap-2.5 text-sm text-[#42524a]">
        <MapPin
          className="mt-0.5 h-4 w-4 shrink-0 text-[#566259]"
          aria-hidden="true"
        />
        <span>{regionName(tour.regionSlug)}</span>
      </div>
      <div className="flex gap-2.5 text-sm text-[#42524a]">
        <Users
          className="mt-0.5 h-4 w-4 shrink-0 text-[#566259]"
          aria-hidden="true"
        />
        <span>
          {tour.groupMax
            ? `Tối đa ${tour.groupMax} khách`
            : "Quy mô theo xác nhận"}
        </span>
      </div>
    </div>
  )
}

function itineraryTime(item: TourItineraryItem): string {
  if (item.timeLabel) return item.timeLabel
  if (item.startTime && item.endTime) {
    return `${item.startTime}–${item.endTime}`
  }
  if (item.startTime) return item.startTime
  if (item.endTime) return item.endTime
  return "Theo chương trình"
}

const COLLAPSE_AT = 320

/**
 * Long itinerary copy stays scannable: past COLLAPSE_AT characters it clamps to
 * four lines behind a real toggle button, so each day reads as a short outline
 * that opens on demand.
 */
function ExpandableText({ text, className = "" }: { text: string; className?: string }) {
  const [open, setOpen] = useState(false)
  const long = text.length > COLLAPSE_AT
  const id = useId()

  return (
    <div className={className}>
      <p
        id={id}
        className={`m-0 max-w-[68ch] whitespace-pre-line text-base leading-7 text-[#47524a] ${
          long && !open ? "line-clamp-4" : ""
        }`}
      >
        {text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={id}
          className="mt-1 inline-flex min-h-11 items-center text-xs font-bold uppercase tracking-[0.12em] text-[#a24627] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a24627]"
        >
          {open ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    </div>
  )
}

function DayTimeline({ day }: { day: TourItineraryDay }) {
  if (day.items.length === 0) {
    return (
      <ExpandableText
        className="mt-5"
        text={day.body || "Lịch trình đang được cập nhật."}
      />
    )
  }

  return (
    <ol className="mt-7 m-0 list-none space-y-0 p-0">
      {day.items.map((item, index) => {
        const isLegacySummary =
          !item.timeLabel &&
          !item.startTime &&
          !item.endTime &&
          item.title === day.title

        return (
          <li
            key={`${day.dayNumber}-${item.order}-${item.title}`}
            className="grid grid-cols-[5.5rem_1rem_minmax(0,1fr)] gap-3 sm:grid-cols-[6.5rem_1rem_minmax(0,1fr)] sm:gap-4"
          >
            <div className="pt-0.5 text-right text-xs font-bold uppercase leading-5 tracking-[0.12em] text-[#a24627]">
              {itineraryTime(item)}
            </div>
            <div className="relative flex justify-center">
              <span className="relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#b4502f] ring-4 ring-[#f6f3ec]" />
              {index < day.items.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-3 h-full w-px -translate-x-1/2 bg-[#c8cfc3]"
                />
              )}
            </div>
            <div className="pb-8 last:pb-0">
              {!isLegacySummary && item.title && (
                <h4 className="m-0 mb-1 font-display text-xl leading-snug tracking-[-0.02em] text-[#183024]">
                  {item.title}
                </h4>
              )}
              {item.description && (
                <ExpandableText className="mt-1" text={item.description} />
              )}
              {item.destination && (
                <p className="mt-2 text-xs text-[#566259]">
                  Địa điểm: {item.destination}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function TourDetailsContent({ tour }: { tour: TourDetails }) {
  return (
    <>
      <div className="mb-12 overflow-hidden rounded-[2px] bg-[#e4e0d6]">
        <img
          src={tour.image}
          alt={`${tour.title}, ${regionName(tour.regionSlug)}`}
          fetchPriority="high"
          decoding="async"
          className="h-[min(56vw,520px)] w-full object-cover"
        />
        {tour.imageCredit && (
          <p className="m-0 px-3 py-2 text-xs leading-4 text-[#566259]">
            Ảnh minh họa: {" "}
            <a
              href={tour.imageCredit.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-6 items-center underline underline-offset-2"
            >
              {tour.imageCredit.label}
            </a>
          </p>
        )}
      </div>
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold uppercase tracking-[0.16em] text-[#566259]">
            <span>{regionName(tour.regionSlug)}</span>
            <span aria-hidden="true" className="text-[#c8c4b8]">
              /
            </span>
            <span>{tour.durationLabel}</span>
          </div>
          <h1 className="max-w-4xl text-balance font-display text-[clamp(2.1rem,4.6vw,4rem)] leading-[1.04] tracking-[-0.04em] text-[#183024]">
            {tour.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-[#566259]">
            {tour.blurb}
          </p>
          <TourSummary tour={tour} />

          <div className="mt-7 flex flex-wrap gap-3">
            {tour.destinations.map((destination) => (
              <span
                key={destination}
                className="rounded-full border border-[#c8cfc3] px-4 py-2 text-xs text-[#42524a]"
              >
                {destination}
              </span>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-[2px] border border-[#e0dcd2] bg-white p-6 lg:p-7">
          <p className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-[#566259]">
            Giá tham khảo
          </p>
          <p className="mt-2 font-display text-4xl tracking-[-0.04em] text-[#a24627]">
            {tour.priceVnd === null ? "Liên hệ" : formatVnd(tour.priceVnd)}
          </p>
          {tour.departureText && (
            <p className="mt-3 border-t border-[#e5e1d8] pt-4 text-[15px] leading-6 text-[#47524a]">
              <strong className="font-semibold text-[#183024]">
                Khởi hành:
              </strong>{" "}
              {tour.departureText}
            </p>
          )}
          {tour.groupLabel && (
            <p className="mt-2 text-[15px] leading-6 text-[#47524a]">
              {tour.groupLabel}
            </p>
          )}
          <a
            href="#contact"
            onClick={goToEnquiry}
            className="group mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#183024] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#a24627] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
          >
            Đặt hành trình
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
          <p className="mt-4 text-center text-xs leading-5 text-[#566259]">
            Giá và lịch khởi hành được xác nhận lại trước khi đặt.
          </p>
        </aside>
      </section>

      <section className="mt-20 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
        <div>
          <div className="mb-8 flex items-end justify-between gap-5 border-b border-[#d9d4c9] pb-5">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#a24627]">
                Lịch trình
              </p>
              <h2 className="font-display text-4xl tracking-[-0.05em] text-[#183024]">
                Từng ngày trên đường đi
              </h2>
            </div>
          </div>

          {tour.itinerary.length > 0 ? (
            <ol className="m-0 list-none space-y-12 p-0">
              {tour.itinerary.map((day, index) => (
                <li key={day.dayNumber} className="relative pl-16">
                  {index < tour.itinerary.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-[-3rem] left-[19px] top-10 w-px bg-[#c8cfc3]"
                    />
                  )}
                  <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#183024] font-display text-lg text-white">
                    {String(day.dayNumber).padStart(2, "0")}
                  </span>
                  <h3 className="m-0 font-display text-2xl tracking-[-0.03em] text-[#183024]">
                    {day.title}
                  </h3>
                  <DayTimeline day={day} />
                  {day.meals.length > 0 && (
                    <p className="mt-3 text-xs uppercase tracking-[0.1em] text-[#566259]">
                      Bữa ăn: {day.meals.join(" · ")}
                    </p>
                  )}
                  {day.overnightLocation && (
                    <p className="mt-2 text-xs text-[#566259]">
                      Nghỉ đêm: {day.overnightLocation}
                      {day.accommodationNotes
                        ? ` — ${day.accommodationNotes}`
                        : ""}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm leading-6 text-[#566259]">
              Lịch trình đang được cập nhật.
            </p>
          )}
        </div>

        <aside className="space-y-7">
          <div className="rounded-[2px] border border-[#e0dcd2] bg-white p-6 lg:p-7">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-[#566259]">
              Bảng giá
            </p>
            {tour.priceOptions.length > 0 ? (
              <ul className="m-0 list-none p-0">
                {tour.priceOptions.map((option, index) => (
                  <PriceOption
                    key={`${option.amountVnd}-${index}`}
                    option={option}
                  />
                ))}
              </ul>
            ) : (
              <p className="m-0 text-sm leading-6 text-[#566259]">
                Liên hệ để nhận báo giá phù hợp với đoàn.
              </p>
            )}
          </div>

          <div className="rounded-[2px] bg-[#e9e6dd] p-6 lg:p-7">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-[#566259]">
              Điểm nổi bật
            </p>
            <BulletList items={tour.highlights} />
          </div>
        </aside>
      </section>

      <section className="mt-20 grid gap-12 border-t border-[#d9d4c9] pt-10 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <h2 className="font-display text-2xl tracking-[-0.03em] text-[#183024]">
            Bao gồm
          </h2>
          <div className="mt-5">
            <BulletList items={tour.inclusions} />
          </div>
        </div>
        <div>
          <h2 className="font-display text-2xl tracking-[-0.03em] text-[#183024]">
            Không bao gồm
          </h2>
          <div className="mt-5">
            <BulletList items={tour.exclusions} />
          </div>
        </div>
        <div className="space-y-5">
          <h2 className="font-display text-2xl tracking-[-0.03em] text-[#183024]">
            Thông tin cần biết
          </h2>
          <NoteBlock label="Lưu trú" value={tour.accommodationNotes} />
          <NoteBlock label="Di chuyển" value={tour.transportNotes} />
        </div>
      </section>
    </>
  )
}

export default function TourDetailsPage({ query }: { query: string }) {
  const slug = new URLSearchParams(query).get("slug")?.trim() ?? ""
  const [tour, setTour] = useState<TourDetails | null>(null)
  const [loading, setLoading] = useState(Boolean(slug))
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)
    loadPublishedTourDetails(slug)
      .then((nextTour) => {
        if (!active) return
        setTour(nextTour)
        setError(false)
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug])

  if (!slug || (!loading && !tour && !error)) {
    return (
      <section className="bg-[#f6f3ec] px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm text-[#566259]">
            Không tìm thấy hành trình này.
          </p>
          <button
            type="button"
            onClick={() => navigateTo("/explore")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#183024] px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Về danh mục
          </button>
        </div>
      </section>
    )
  }

  return (
    <div className="bg-[#f6f3ec] px-6 pb-24 pt-28 lg:px-12 lg:pb-32 lg:pt-36">
      <div className="mx-auto max-w-[1240px]">
        <button
          type="button"
          onClick={() => navigateTo("/explore")}
          className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#566259] transition-colors hover:text-[#8f3d21]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Tất cả hành trình
        </button>

        {loading ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="h-96 animate-pulse rounded-[2px] bg-[#e9e6dd]" />
            <div className="h-80 animate-pulse rounded-[2px] bg-[#e9e6dd]" />
          </div>
        ) : error || !tour ? (
          <div
            role="alert"
            className="rounded-[2px] border border-[#e0dcd2] bg-white px-6 py-14 text-center"
          >
            <p className="text-sm text-[#566259]">
              Không thể tải nội dung hành trình lúc này.
            </p>
            <button
              type="button"
              onClick={() => navigateTo("/explore")}
              className="mt-6 rounded-full bg-[#183024] px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white"
            >
              Về danh mục
            </button>
          </div>
        ) : (
          <TourDetailsContent tour={tour} />
        )}
      </div>
    </div>
  )
}
