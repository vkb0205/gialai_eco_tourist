import { useEffect, useState } from "react"
import { ArrowRight } from "@phosphor-icons/react"
import { loadPublishedTours } from "@/data/toursRepository"
import TourCard from "@/components/ui/TourCard"
import type { Tour } from "@/data/tours"
import { navigateTo } from "@/lib/useHashRoute"

const preferredSlugs = [
  "pleiku-kon-tum-mang-den-3n2d-ghep-doan",
  "pleiku-kon-tum-mang-den-buon-ma-thuot-4n3d-ghep-doan",
  "hanoi-pleiku-mang-den-cot-moc-3n2d",
  "hanoi-pleiku-mang-den-cot-moc-kon-ka-kinh-4n3d",
  "buon-ma-thuot-buon-don-nui-da-voi-ho-lak-3n2d",
  "ha-noi-pleiku-mang-den-buon-ma-thuot-3n2d",
]

/** Sort so the design's 6 showcase tours appear in exact order, followed by other distinct tours */
function sortFeatured(tours: Tour[]): Tour[] {
  const map = new Map<string, Tour>()
  for (const t of tours) map.set(t.slug, t)

  const showcase: Tour[] = []
  for (const slug of preferredSlugs) {
    const t = map.get(slug)
    if (t) {
      showcase.push(t)
      map.delete(slug)
    }
  }

  // Then add remaining varied tours
  const seenImages = new Set(showcase.map((t) => t.image))
  const rest: Tour[] = []
  for (const t of map.values()) {
    if (!seenImages.has(t.image)) {
      seenImages.add(t.image)
      rest.push(t)
    }
  }

  return [...showcase, ...rest].slice(0, 6)
}

export default function FeaturedTours() {
  const [tours, setTours] = useState<Tour[]>([])
  const [total, setTotal] = useState(0)
  const [state, setState] = useState<"loading" | "ready" | "error">("loading")

  useEffect(() => {
    let active = true
    loadPublishedTours()
      .then((next) => {
        if (!active) return
        setTours(sortFeatured(next))
        setTotal(next.length)
        setState("ready")
      })
      .catch(() => {
        if (active) setState("error")
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <section
      id="experiences"
      aria-labelledby="featured-title"
      className="page-container py-16 lg:py-24"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="t-eyebrow !text-clay">TOUR NỔI BẬT MÙA NÀY</p>
          <h2 id="featured-title" className="t-h2 text-ink">
            Những hành trình đáng đi
          </h2>
        </div>
        <a
          href="#/explore"
          onClick={(event) => {
            event.preventDefault()
            navigateTo("/explore")
          }}
          className="t-btn hidden min-h-11 items-center gap-2 font-bold text-forest hover:text-forest-hover md:flex"
        >
          {total > 0 ? `Xem tất cả ${total} tour  →` : "Xem tất cả tour  →"}
        </a>
      </div>

      {state === "loading" && (
        <p role="status" className="py-16 text-center text-body">
          Đang tải các hành trình…
        </p>
      )}
      {state === "error" && (
        <p role="alert" className="py-16 text-center text-body">
          Chưa thể tải hành trình lúc này. Bạn có thể xem toàn bộ danh mục ở
          trang Khám phá tour.
        </p>
      )}
      {state === "ready" && (
        <>
          <div className="mt-10 grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
            {tours.map((tour, index) => {
              // Mobile 390 displays Măng Đen (0), K50 (3), Cà phê (5)
              const isMobileShown = index === 0 || index === 3 || index === 5
              return (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  index={index}
                  className={`home-tour-card ${!isMobileShown ? "max-md:hidden" : ""}`}
                />
              )
            })}
          </div>
          <div className="mt-6 md:hidden">
            <a
              href="#/explore"
              onClick={(event) => {
                event.preventDefault()
                navigateTo("/explore")
              }}
              className="btn-outline flex w-full items-center justify-center rounded-full text-center"
            >
              Xem cả 6 tour nổi bật
            </a>
          </div>
        </>
      )}
    </section>
  )
}
