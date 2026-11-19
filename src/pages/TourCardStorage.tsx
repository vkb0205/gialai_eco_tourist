import { ArrowRight } from "@phosphor-icons/react"
import { regionName } from "@/data/regions"
import type { Tour } from "@/data/tours"
import { navigateTo } from "@/lib/useHashRoute"
import MediaImage from "@/lib/MediaImage"

export function tourDetailsHref(slug: string): string {
  return `#/tour?slug=${encodeURIComponent(slug)}`
}

const customPriceBySlug: Record<string, string> = {
  "buon-ma-thuot-buon-don-nui-da-voi-ho-lak-3n2d": "Liên hệ báo giá",
  "pleiku-kon-tum-mang-den-3n2d-ghep-doan": "Từ 2.890.000 ₫ / khách",
  "pleiku-kon-tum-mang-den-buon-ma-thuot-4n3d-ghep-doan": "Từ 1.650.000 ₫ / khách",
  "hanoi-pleiku-mang-den-cot-moc-3n2d": "Từ 690.000 ₫ / khách",
  "hanoi-pleiku-mang-den-cot-moc-kon-ka-kinh-4n3d": "Từ 1.980.000 ₫ / khách",
  "ha-noi-pleiku-mang-den-buon-ma-thuot-3n2d": "Từ 1.450.000 ₫ / khách",
}

/** "Từ X ₫ / khách", or "Liên hệ báo giá" when there is no price. */
export function priceLabel(tour: Tour): string {
  if (customPriceBySlug[tour.slug]) return customPriceBySlug[tour.slug]
  if (tour.priceVnd === null) return "Liên hệ báo giá"
  const grouped = Math.round(tour.priceVnd)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `Từ ${grouped} ₫ / khách`
}

/** Remove parentheses around duration: "(3 ngày 2 đêm)" -> "3 ngày 2 đêm" */
export function cleanTitle(title: string): string {
  return title.replace(/\((\d+\s*ngày[^)]*)\)/gi, "$1").trim()
}

/** Drop "(3 ngày 2 đêm)" from the title when short form is needed. */
export function shortTitle(title: string): string {
  return title.replace(/\s*\(\s*\d+\s*ngày[^)]*\)\s*$/i, "").trim() || title
}

export const tourTagsBySlug: Record<string, string> = {
  "pleiku-kon-tum-mang-den-3n2d-ghep-doan": "RỪNG THÔNG · SUỐI · LÀNG BA NA",
  "pleiku-kon-tum-mang-den-buon-ma-thuot-4n3d-ghep-doan": "KIẾN TRÚC · VĂN HOÁ BẢN ĐỊA",
  "hanoi-pleiku-mang-den-cot-moc-3n2d": "HỒ NÚI LỬA · NÚI CHƯ ĐĂNG YA",
  "hanoi-pleiku-mang-den-cot-moc-kon-ka-kinh-4n3d": "TREKKING · RỪNG NGUYÊN SINH",
  "buon-ma-thuot-buon-don-nui-da-voi-ho-lak-3n2d": "HỒ NƯỚC · BUÔN M'NÔNG",
  "ha-noi-pleiku-mang-den-buon-ma-thuot-3n2d": "CÀ PHÊ · NÔNG TRẠI",
}

export const tourMetaBySlug: Record<string, string> = {
  "pleiku-kon-tum-mang-den-3n2d-ghep-doan": "Ghép đoàn tối đa 12 khách · Khởi hành Pleiku",
  "pleiku-kon-tum-mang-den-buon-ma-thuot-4n3d-ghep-doan": "Nhóm riêng từ 2 khách · Khởi hành Pleiku",
  "hanoi-pleiku-mang-den-cot-moc-3n2d": "Đi trong ngày · Đón tại khách sạn Pleiku",
  "hanoi-pleiku-mang-den-cot-moc-kon-ka-kinh-4n3d": "Đi bộ 6 km/ngày · Tối đa 10 khách",
  "buon-ma-thuot-buon-don-nui-da-voi-ho-lak-3n2d": "Nhóm riêng · Khởi hành Buôn Ma Thuột",
  "ha-noi-pleiku-mang-den-buon-ma-thuot-3n2d": "Hái, phơi, rang cùng nông hộ · Tối đa 8 khách",
}

const customDisplayTitleBySlug: Record<string, string> = {
  "pleiku-kon-tum-mang-den-3n2d-ghep-doan": "Pleiku – Kon Tum – Măng Đen 3 ngày 2 đêm",
  "pleiku-kon-tum-mang-den-buon-ma-thuot-4n3d-ghep-doan": "Nhà thờ gỗ Kon Tum và làng Kon K'Tu",
  "hanoi-pleiku-mang-den-cot-moc-3n2d": "Biển Hồ và núi lửa Chư Đăng Ya",
  "hanoi-pleiku-mang-den-cot-moc-kon-ka-kinh-4n3d": "Thác K50 giữa Kon Chư Răng",
  "buon-ma-thuot-buon-don-nui-da-voi-ho-lak-3n2d": "Hồ Lắk và buôn Jun bên thuyền độc mộc",
  "ha-noi-pleiku-mang-den-buon-ma-thuot-3n2d": "Một ngày làm nông dân cà phê Buôn Ma Thuột",
}

const customChipBySlug: Record<
  string,
  { label: string; tone: "sunlight" | "sky" | "blush" }
> = {
  "pleiku-kon-tum-mang-den-3n2d-ghep-doan": {
    label: "Kon Tum · 3N2Đ",
    tone: "sunlight",
  },
  "pleiku-kon-tum-mang-den-buon-ma-thuot-4n3d-ghep-doan": {
    label: "Kon Tum · 2N1Đ",
    tone: "sunlight",
  },
  "hanoi-pleiku-mang-den-cot-moc-3n2d": {
    label: "Gia Lai · 1 ngày",
    tone: "sky",
  },
  "hanoi-pleiku-mang-den-cot-moc-kon-ka-kinh-4n3d": {
    label: "Gia Lai · 2N1Đ",
    tone: "sky",
  },
  "buon-ma-thuot-buon-don-nui-da-voi-ho-lak-3n2d": {
    label: "Đắk Lắk · 3N2Đ",
    tone: "sky",
  },
  "ha-noi-pleiku-mang-den-buon-ma-thuot-3n2d": {
    label: "Đắk Lắk · 2N1Đ",
    tone: "blush",
  },
}

export function getTourChip(
  tour: Tour,
  index = 0
): { label: string; toneClass: string; metaClass: string } {
  if (customChipBySlug[tour.slug]) {
    const chip = customChipBySlug[tour.slug]
    if (chip.tone === "sunlight") {
      return {
        label: chip.label,
        toneClass: "bg-sunlight text-ink",
        metaClass: "text-forest",
      }
    }
    if (chip.tone === "blush") {
      return {
        label: chip.label,
        toneClass: "bg-blush text-ink",
        metaClass: "text-clay",
      }
    }
    return {
      label: chip.label,
      toneClass: "bg-sky text-ink",
      metaClass: "text-lake",
    }
  }

  // Automatic derivation for other tours
  let location = regionName(tour.regionSlug)
  const titleLower = tour.title.toLowerCase()
  if (titleLower.includes("măng đen") || titleLower.includes("kon tum")) {
    location = "Kon Tum"
  } else if (
    titleLower.includes("buôn ma thuột") ||
    titleLower.includes("hồ lắk") ||
    titleLower.includes("đắk lắk") ||
    titleLower.includes("buôn đôn")
  ) {
    location = "Đắk Lắk"
  } else if (
    titleLower.includes("pleiku") ||
    titleLower.includes("biển hồ") ||
    titleLower.includes("chư đăng ya") ||
    titleLower.includes("k50") ||
    titleLower.includes("gia lai")
  ) {
    location = "Gia Lai"
  }

  let duration = tour.durationLabel
  const match = tour.durationLabel.match(/(\d+)\s*ngày(?:\s*·?\s*(\d+)\s*đêm)?/)
  if (match) {
    const days = match[1]
    const nights = match[2]
    duration = nights ? `${days}N${nights}Đ` : `${days} ngày`
  }

  const tone = index % 2 === 0 ? "sunlight" : "sky"
  return {
    label: `${location} · ${duration}`,
    toneClass: tone === "sunlight" ? "bg-sunlight text-ink" : "bg-sky text-ink",
    metaClass: tone === "sunlight" ? "text-forest" : "text-lake",
  }
}

/**
 * Tour card shared by Home and the Tours page. The whole card is one link
 * (stretched over the title); styling follows the v2 OpenPencil design.
 */
export default function TourCard({
  tour,
  index = 0,
  className = "",
}: {
  tour: Tour
  index?: number
  className?: string
}) {
  const query = `slug=${encodeURIComponent(tour.slug)}`
  const chipInfo = getTourChip(tour, index)
  const eyebrowText =
    tourTagsBySlug[tour.slug] ??
    (tour.highlights[0] ? tour.highlights[0].toUpperCase() : tour.category.toUpperCase())
  const displayTitle = customDisplayTitleBySlug[tour.slug] ?? cleanTitle(tour.title)
  const metaText =
    tourMetaBySlug[tour.slug] ??
    [
      tour.groupMax ? `Tối đa ${tour.groupMax} khách` : null,
      tour.highlights[1] ?? tour.highlights[0] ?? null,
    ]
      .filter(Boolean)
      .join(" · ")

  return (
    <article
      className={`group relative flex h-full flex-col rounded-card bg-paper p-2 shadow-card transition-shadow focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-ink hover:shadow-search xl:h-[480px] ${className}`}
    >
      <MediaImage
        src={tour.image}
        slug={tour.slug}
        alt={`Tour ${displayTitle}`}
        loading="lazy"
        decoding="async"
        className="aspect-[342/220] w-full rounded-photo object-cover md:aspect-[384/216]"
      />
      <div className="flex flex-1 flex-col px-3 pb-4 pt-4 md:p-4">
        <div className="hidden md:block">
          <span
            className={`inline-flex h-8 min-w-[136px] items-center justify-center rounded-full px-3.5 text-[13px] font-bold ${chipInfo.toneClass}`}
          >
            {chipInfo.label}
          </span>
        </div>
        <p
          className={`m-0 mt-0 text-[11px] font-bold uppercase leading-4 tracking-[0.8px] md:mt-4 ${chipInfo.metaClass}`}
        >
          {eyebrowText}
        </p>
        <h3 className="t-h3 tour-card-title m-0 mt-1 min-h-[56px] line-clamp-2 text-ink md:mt-2 md:min-h-[60px]">
          <a
            href={`#/tour?${query}`}
            onClick={(event) => {
              event.preventDefault()
              navigateTo("/tour", query)
            }}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {displayTitle}
          </a>
        </h3>
        {metaText && (
          <p className="m-0 mt-2 text-[14px] leading-[21px] text-subtle md:mt-3 md:text-[13px] md:leading-[19px]">
            {metaText}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-[15px] md:pt-[19px]">
          <strong className="min-w-0 flex-1 break-words text-[17px] font-bold leading-snug text-ink md:text-base">
            {priceLabel(tour)}
          </strong>
          <span className="hidden w-24 shrink-0 items-center justify-end gap-1 whitespace-nowrap text-sm font-bold text-forest md:flex">
            Xem tour <ArrowRight size={14} aria-hidden="true" />
          </span>
        </div>
      </div>
    </article>
  )
}
