import { useState } from "react"
import { ArrowUpRight, Mountains } from "@phosphor-icons/react"
import { difficultyLabel, themeLabel } from "@/data/filters"
import { regionName } from "@/data/regions"
import type { Tour } from "@/data/tours"
import { formatVnd } from "@/lib/text"
import { navigateTo } from "@/lib/useHashRoute"

export function tourDetailsHref(slug: string): string {
  return `#/tour?slug=${encodeURIComponent(slug)}`
}

/** The duration is shown as its own chip, so drop "(3 ngày 2 đêm)" from the title. */
function shortTitle(title: string): string {
  return title.replace(/\s*\(\s*\d+\s*ngày[^)]*\)\s*$/i, "").trim() || title
}

/**
 * Catalogue card.
 *
 * A white surface on the stone page ground, with no border or shadow. The
 * image keeps a locked aspect ratio so the grid cannot shift as images arrive.
 * Cards lead to the source-backed detail route; booking remains available there.
 */
export default function TourCard({ tour }: { tour: Tour }) {
  const [imageFailed, setImageFailed] = useState(false)

  const facts = [
    { label: "Thời lượng", value: tour.durationLabel },
    {
      label: "Thể lực",
      value: tour.difficulty
        ? difficultyLabel(tour.difficulty)
        : "Đang cập nhật",
    },
    {
      label: "Quy mô nhóm",
      value: tour.groupMax ? `Tối đa ${tour.groupMax}` : "Liên hệ quy mô",
    },
  ]

  return (
    <a
      href={tourDetailsHref(tour.slug)}
      onClick={(event) => {
        event.preventDefault()
        navigateTo("/tour", `slug=${encodeURIComponent(tour.slug)}`)
      }}
      aria-label={`Xem chi tiết ${tour.title}`}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[2px] bg-[#f0f7f1] transition-transform duration-300 motion-safe:hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#183024]"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#e1f0e4]">
        {imageFailed ? (
          <div className="flex h-full w-full items-center justify-center text-[#4f5b53]">
            <Mountains className="h-9 w-9" aria-hidden="true" />
            <span className="sr-only">Ảnh chưa tải được</span>
          </div>
        ) : (
          <img
            src={tour.image}
            alt={`${tour.title}, ${regionName(tour.regionSlug)}`}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 lg:p-6">
        <p className="m-0 text-[15px] font-semibold text-[#4f5b53]">
          {regionName(tour.regionSlug)} ·{" "}
          {tour.theme ? themeLabel(tour.theme) : "Đang cập nhật"}
        </p>

        <h3 className="m-0 font-display text-[20px] leading-[1.2] sm:text-[24px] sm:leading-[1.15] tracking-[-0.02em] text-[#1f7a3a]">
          {shortTitle(tour.title)}
        </h3>

        <p className="m-0 line-clamp-2 text-[16px] leading-6 text-[#2f3d35]">
          {tour.blurb}
        </p>

        <dl className="m-0 flex flex-wrap gap-2">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-[#183024]"
            >
              <dt className="sr-only">{fact.label}</dt>
              <dd className="m-0 whitespace-nowrap">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex items-end justify-between gap-4 pt-2">
          <p className="m-0">
            <span className="block text-sm text-[#4f5b53]">Giá từ / khách</span>
            <strong className="mt-0.5 block text-xl font-semibold text-[#183024]">
              {tour.priceVnd === null
                ? "Liên hệ để biết giá"
                : formatVnd(tour.priceVnd)}
            </strong>
          </p>
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1f7a3a] text-white transition-colors group-hover:bg-[#15602b]"
          >
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </div>
    </a>
  )
}
