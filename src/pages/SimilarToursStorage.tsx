import { useEffect, useState } from "react"
import { loadPublishedTours } from "@/data/toursRepository"
import type { Tour } from "@/data/tours"
import TourCard, { shortTitle } from "@/components/ui/TourCard"

/** Other published tours from the same region, using the shared tour card. */
export default function SimilarTours({ tour, region }: { tour: Tour; region: string }) {
  const [similar, setSimilar] = useState<Tour[]>([])

  useEffect(() => {
    let active = true
    loadPublishedTours()
      .then((all) => {
        if (!active) return
        setSimilar(
          all
            .filter((t) => t.slug !== tour.slug && t.regionSlug === tour.regionSlug)
            .slice(0, 3),
        )
      })
      .catch(() => {
        if (active) setSimilar([])
      })
    return () => {
      active = false
    }
  }, [tour.slug, tour.regionSlug])

  if (similar.length === 0) return null

  return (
    <section id="tour-tuong-tu" aria-labelledby="tour-tuong-tu-title" className="mt-16 scroll-mt-40 md:mt-20">
      <p className="mb-2 hidden text-[13px] font-bold uppercase leading-[19px] tracking-[0.8px] text-forest md:block">
        Cùng vùng {region}
      </p>
      <h2 id="tour-tuong-tu-title" className="m-0 font-display text-[26px] font-bold leading-9 text-ink md:text-[32px] md:leading-[47px]">
        <span className="hidden md:inline">Có thể bạn cũng thích</span>
        <span className="md:hidden">Cùng vùng {region}</span>
      </h2>
      <p className="m-0 mt-2 text-[13px] leading-[21px] text-subtle md:hidden">
        {similar.map((item) => shortTitle(item.title)).join(" · ")}
      </p>
      <ul className="m-0 mt-5 grid list-none gap-5 p-0 sm:grid-cols-2 lg:mt-6 lg:grid-cols-3">
        {similar.map((item, index) => (
          <li key={item.slug}>
            <TourCard tour={item} index={index} />
          </li>
        ))}
      </ul>
    </section>
  )
}
