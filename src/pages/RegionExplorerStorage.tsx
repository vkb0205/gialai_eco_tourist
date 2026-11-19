import { useEffect, useState } from "react"
import { regions } from "@/data/regions"
import type { RegionSlug } from "@/data/regions"
import { homepageImageByKey } from "@/data/homepageImages"
import { loadPublishedTours } from "@/data/toursRepository"
import { navigateTo } from "@/lib/useHashRoute"
import MediaImage from "@/lib/MediaImage"

function goRegion(event: { preventDefault(): void }, slug: RegionSlug) {
  event.preventDefault()
  navigateTo("/explore", `vung=${slug}`)
}

const otherRegionConfig: Record<
  string,
  {
    placeholderText: string
    placeholderBoxClass: string
    description: string
  }
> = {
  "mien-bac": {
    placeholderText: "Ảnh Miền Bắc",
    placeholderBoxClass: "bg-[#EAF4FF] border-[#1971C2]/40 text-[#1971C2]",
    description: "Núi cao, làng nghề, vịnh đảo và phiên chợ vùng cao.",
  },
  "mien-trung": {
    placeholderText: "Ảnh Miền Trung",
    placeholderBoxClass: "bg-[#FFEDE5] border-[#C2410C]/40 text-[#C2410C]",
    description: "Di sản, hang động, phố cổ và dải biển nhiều nắng.",
  },
  "mien-nam": {
    placeholderText: "Ảnh Miền Nam",
    placeholderBoxClass: "bg-[#FFF4D6] border-[#B7791F]/40 text-[#8A5A00]",
    description: "Rừng ngập mặn, đảo xa và miền sông nước trù phú.",
  },
}

export default function RegionExplorer() {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    let active = true
    loadPublishedTours()
      .then((tours) => {
        if (!active) return
        const next: Record<string, number> = {}
        for (const tour of tours)
          next[tour.regionSlug] = (next[tour.regionSlug] ?? 0) + 1
        setCounts(next)
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [])

  const count = (slug: string) =>
    counts[slug] !== undefined ? `${counts[slug]} tour` : "Xem tour"
  const [home, ...others] = regions

  return (
    <section
      aria-labelledby="region-title"
      className="page-container pb-16 lg:pb-24"
    >
      <p className="t-eyebrow !text-lake">KHÁM PHÁ THEO VÙNG</p>
      <h2 id="region-title" className="t-h2 text-ink">
        Khám phá Việt Nam qua từng vùng miền
      </h2>

      <div className="mt-10 grid gap-6 lg:grid-cols-[616fr_632fr] lg:gap-8">
        {/* Tây Nguyên showcase card */}
        <a
          href={`#/explore?vung=${home.slug}`}
          onClick={(event) => goRegion(event, home.slug)}
          className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-[20px] bg-leaf shadow-card transition-shadow hover:shadow-search lg:min-h-[420px]"
        >
          <MediaImage
            src={homepageImageByKey.konPringVillage} slug="kon-pring-village"
            alt="Làng Kon Pring giữa rừng thông, Măng Đen, Kon Tum"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Desktop bottom overlay panel */}
          <div className="relative hidden bg-paper/95 p-6 lg:block lg:p-8">
            <p className="t-caption font-bold uppercase tracking-[0.8px] text-forest">
              VÙNG NHÀ · {count(home.slug)}
            </p>
            <h3 className="t-h3 mt-1 text-[32px] font-bold leading-[42px] text-ink">
              {home.name}
            </h3>
            <p className="t-body mt-1 text-base text-body">
              {home.characterisation}
            </p>
            <p className="mt-2 text-xs text-subtle">
              Ảnh: làng Kon Pring, Kon Tum
            </p>
          </div>
          {/* Mobile bottom overlay panel */}
          <div className="relative bg-paper/95 p-4 lg:hidden">
            <h3 className="text-[24px] font-bold leading-[32px] text-ink">
              {home.name}
            </h3>
            <p className="mt-1 text-sm text-body">
              {count(home.slug)} · Rừng già, thác nước, cồng chiêng
            </p>
          </div>
        </a>

        {/* Desktop: 3 tinted horizontal cards */}
        <ul className="m-0 hidden list-none flex-col gap-4 p-0 lg:flex">
          {others.map((region) => {
            const conf = otherRegionConfig[region.slug] ?? {
              placeholderText: `Ảnh ${region.name}`,
              placeholderBoxClass: "bg-leaf border-line text-forest",
              description: region.characterisation,
            }
            return (
              <li key={region.slug} className="flex-1">
                <a
                  href={`#/explore?vung=${region.slug}`}
                  onClick={(event) => goRegion(event, region.slug)}
                  className="flex h-full min-h-[128px] items-center gap-6 rounded-[20px] bg-paper p-2 shadow-card transition-shadow hover:shadow-search"
                >
                  <MediaImage
                    src={region.image}
                    slug={region.slug}
                    alt={`Ảnh ${region.name}`}
                    className="h-[112px] w-[160px] shrink-0 rounded-photo object-cover"
                  />
                  <div className="min-w-0 flex-1 py-1">
                    <h3 className="text-[20px] font-bold leading-[28px] text-ink">
                      {region.name}
                    </h3>
                    <p className="mt-1 text-[15px] leading-[22px] text-subtle">
                      {conf.description}
                    </p>
                  </div>
                  <span className="shrink-0 pr-6 text-right font-bold text-forest">
                    {count(region.slug)}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        {/* Mobile 390: row of 3 pills below Tây Nguyên */}
        <div className="grid grid-cols-3 gap-3 lg:hidden">
          {others.map((region) => (
            <a
              key={region.slug}
              href={`#/explore?vung=${region.slug}`}
              onClick={(event) => goRegion(event, region.slug)}
              className="flex min-h-[48px] items-center justify-center rounded-full border border-line bg-paper px-2 py-3 text-center text-sm font-semibold text-ink shadow-sm active:bg-leaf"
            >
              {region.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
