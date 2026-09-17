import { useState } from "react"
import {
  ArrowUpRight,
  Clock,
  MapPin,
  Mountains,
  Users,
} from "@phosphor-icons/react"
import { difficultyLabel, themeLabel } from "@/data/filters"
import { regionName } from "@/data/regions"
import type { Tour } from "@/data/tours"
import { formatVnd } from "@/lib/text"
import { goToEnquiry } from "@/components/layout/Navigation"

/**
 * Catalogue card.
 *
 * Reuses the landing page's card treatment: 2px radius, hairline border, a
 * locked image aspect ratio so the grid cannot shift as images arrive, and one
 * booking action carrying the site's existing label.
 */
export default function TourCard({ tour }: { tour: Tour }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[2px] border border-[#e0dcd2] bg-white transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_24px_60px_rgba(24,48,36,0.14)]">
      <div className="relative aspect-[1.5/1] w-full shrink-0 overflow-hidden bg-[#e4e0d6]">
        {imageFailed ? (
          <div className="flex h-full w-full items-center justify-center bg-[#e4e0d6] text-[#69746b]">
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

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5 lg:px-6 lg:pb-6 lg:pt-6">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#5b665d]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {regionName(tour.regionSlug)}
          </span>
          <span aria-hidden="true" className="text-[#c8c4b8]">
            /
          </span>
          <span>{tour.theme ? themeLabel(tour.theme) : "Đang cập nhật"}</span>
        </div>

        <h3 className="mt-3.5 font-display text-[26px] leading-[1.1] tracking-[-0.04em] text-[#183024]">
          {tour.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-[13px] leading-6 text-[#69746b]">
          {tour.blurb}
        </p>

        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-[#e5e1d8] pt-4 text-[11px] leading-4 text-[#42524a]">
          <div>
            <dt className="sr-only">Thời lượng</dt>
            <dd className="flex items-start gap-1.5">
              <Clock
                className="mt-px h-3 w-3 shrink-0 text-[#69746b]"
                aria-hidden="true"
              />
              <span>{tour.durationLabel}</span>
            </dd>
          </div>
          <div>
            <dt className="sr-only">Thể lực</dt>
            <dd className="flex items-start gap-1.5">
              <Mountains
                className="mt-px h-3 w-3 shrink-0 text-[#69746b]"
                aria-hidden="true"
              />
              <span>
                {tour.difficulty
                  ? difficultyLabel(tour.difficulty)
                  : "Đang cập nhật"}
              </span>
            </dd>
          </div>
          <div>
            <dt className="sr-only">Quy mô nhóm</dt>
            <dd className="flex items-start gap-1.5">
              <Users
                className="mt-px h-3 w-3 shrink-0 text-[#69746b]"
                aria-hidden="true"
              />
              <span>
                {tour.groupMax ? `Tối đa ${tour.groupMax}` : "Liên hệ quy mô"}
              </span>
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#e5e1d8] pt-4">
          <p className="m-0">
            <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-[#69746b]">
              Giá từ / khách
            </span>
            <strong className="mt-1 block text-[15px] font-semibold text-[#b4502f]">
              {tour.priceVnd === null
                ? "Liên hệ để biết giá"
                : formatVnd(tour.priceVnd)}
            </strong>
          </p>
          <a
            href="#contact"
            onClick={goToEnquiry}
            aria-label={`Đặt hành trình ${tour.title}`}
            className="group/cta inline-flex shrink-0 items-center gap-2 rounded-full bg-[#183024] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.13em] text-white transition-colors hover:bg-[#b4502f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
          >
            Đặt hành trình
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform motion-safe:group-hover/cta:-translate-y-0.5 motion-safe:group-hover/cta:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </article>
  )
}
