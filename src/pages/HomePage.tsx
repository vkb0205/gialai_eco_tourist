import HeroBackdrop from "@/components/layout/HeroBackdrop"
import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import type { ChangeEvent, FormEvent } from "react"
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Play,
} from "@phosphor-icons/react"
import heroImage from "@/imports/photos/bien-ho-aerial.webp"
import churchImage from "@/imports/tours/kon-tum-church.webp"
import drayNurImage from "@/imports/tours/dray-nur.webp"
import buonDonImage from "@/imports/tours/buon-don.webp"
import hoLakImage from "@/imports/tours/ho-lak.webp"
import coffeeImage from "@/imports/tours/coffee-buon-ma-thuot.webp"
import { goToEnquiry } from "@/components/layout/Navigation"
import { imageCredits } from "@/data/tourImages"
import { festivalBanner, siteMediaUrl } from "@/data/siteMedia"
import { loadPublishedTours } from "@/data/toursRepository"
import type { Tour } from "@/data/tours"
import { formatVnd } from "@/lib/text"
import {
  submissionErrorMessage,
  submitServiceSubmission,
} from "@/lib/submitServiceSubmission"
import { navigateTo } from "@/lib/useHashRoute"

type GalleryImage = {
  src: string
  alt: string
  caption: string
  className: string
  credit?: { label: string; href: string }
}

/** Real Gia Lai / Tây Nguyên photography. Credits are listed under the grid. */
const galleryImages: GalleryImage[] = [
  {
    src: heroImage,
    alt: "Biển Hồ nhìn từ trên cao, mặt nước xanh thẫm ôm lấy dải đất phủ thông",
    caption: "Biển Hồ nhìn từ trên cao",
    className: "sm:col-span-2 sm:row-span-2",
  },
  {
    src: drayNurImage,
    alt: "Dòng thác Dray Nur đổ xuống giữa vách đá và tán rừng",
    caption: "Thác Dray Nur",
    className: "",
    credit: imageCredits.drayNur,
  },
  {
    src: buonDonImage,
    alt: "Hai người chèo thuyền độc mộc trên mặt sông ở Buôn Đôn",
    caption: "Thuyền độc mộc, Buôn Đôn",
    className: "",
    credit: imageCredits.buonDon,
  },
  {
    src: coffeeImage,
    alt: "Chùm cà phê chín đỏ trên cành ở Buôn Ma Thuột",
    caption: "Cà phê Buôn Ma Thuột",
    className: "",
    credit: imageCredits.coffee,
  },
  {
    src: hoLakImage,
    alt: "Hồ Lắk trong xanh dưới bầu trời cao nguyên",
    caption: "Hồ Lắk",
    className: "",
    credit: imageCredits.hoLak,
  },
]

/** Fades and lifts its children once as they scroll into view. Reduced motion shows them at rest. */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : undefined }}
      className={`motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.32,0.72,0,1)] ${
        shown
          ? "opacity-100"
          : "motion-safe:translate-y-6 motion-safe:opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  )
}

/** Loads the festival banner from Supabase Storage; resolves to its URL only once the file really exists. */
function useFestivalBannerUrl(): string | null {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const candidate = siteMediaUrl(festivalBanner.path)
    if (!candidate) return
    let active = true
    const probe = new Image()
    probe.onload = () => {
      if (active) setUrl(candidate)
    }
    probe.src = candidate
    return () => {
      active = false
    }
  }, [])

  return url
}

function Hero() {
  const bannerUrl = useFestivalBannerUrl()
  const slideCount = bannerUrl ? 2 : 1
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  // Auto-advance every 5 seconds, looping. Pauses while the visitor hovers or
  // focuses the hero, and never runs for visitors who prefer reduced motion.
  // Depending on `active` restarts the timer after any manual navigation.
  useEffect(() => {
    if (slideCount < 2 || paused) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setTimeout(() => {
      goTo((active + 1) % slideCount)
    }, 5000)
    return () => window.clearTimeout(timer)
  }, [active, paused, slideCount])

  const goTo = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    track.scrollTo({
      left: index * track.clientWidth,
      behavior: reduced ? "auto" : "smooth",
    })
  }

  const onScroll = () => {
    const track = trackRef.current
    if (!track || track.clientWidth === 0) return
    setActive(Math.round(track.scrollLeft / track.clientWidth))
  }

  return (
    <section
      id="home"
      aria-roledescription="carousel"
      aria-label="Giới thiệu nổi bật"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative bg-[#dff1f8] text-[#183024]"
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain"
      >
        <div
          role="group"
          aria-roledescription="slide"
          aria-label={`1 / ${slideCount}`}
          className="relative isolate min-h-[100svh] w-full min-w-full shrink-0 basis-full snap-start overflow-hidden"
        >
          <HeroBackdrop />

                    <div className="relative z-20 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-between px-6 pb-10 pt-32 lg:px-12 lg:pb-14">
            <div className="flex w-full max-w-[56rem] flex-1 flex-col justify-center">
              <h1 className="max-w-[min(100%,54rem)] break-words font-display font-medium text-[#183024] tracking-[-0.065em]">
                <span className="block text-[clamp(1.9rem,4.6vw,4.2rem)] leading-[1.05] motion-safe:animate-[rise-in_800ms_cubic-bezier(0.32,0.72,0,1)_100ms_both]">
                  Vi vu muôn phương
                </span>
                <span className="block text-[clamp(1.9rem,4.6vw,4.2rem)] leading-[1.05] text-[#1f7a3a] motion-safe:animate-[rise-in_800ms_cubic-bezier(0.32,0.72,0,1)_260ms_both]">
                  Chạm ngàn cung đường
                </span>
              </h1>

              {/* The paragraph stays in a left-side safe zone, away from the tower crop. */}
              <div className="mt-10 w-fit max-w-full lg:mt-14 motion-safe:animate-[rise-in_800ms_cubic-bezier(0.32,0.72,0,1)_460ms_both]">
                <p className="max-w-[17rem] text-base leading-7 text-[#183024] sm:max-w-[min(30rem,42vw)] lg:max-w-[min(34rem,34vw)] lg:text-lg">
                  Từ phố thị đến biển xanh nắng vàng và cao nguyên rộng mở, mỗi
                  chuyến đi đều là một trải nghiệm mới đầy cảm hứng.
                </p>

                <div className="mt-8 flex max-w-[17rem] flex-wrap items-center gap-4 sm:max-w-[min(30rem,42vw)] lg:mt-9 lg:max-w-[min(34rem,34vw)]">
                  <a
                    href="#/explore"
                    onClick={(event) => {
                      event.preventDefault()
                      navigateTo("/explore")
                    }}
                    className="group inline-flex items-center gap-3 rounded-full bg-[#fed24f] px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-[#6f4e37] transition-all hover:-translate-y-1 hover:bg-[#fed24f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
                  >
                    Xem hành trình{" "}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                  <a
                    href="#story"
                    className="group inline-flex items-center gap-3 px-3 py-4 text-xs font-bold uppercase tracking-[0.12em] text-[#183024] transition-colors hover:text-[#15602b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#183024]/40">
                      <Play
                        weight="fill"
                        className="ml-0.5 h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    </span>
                    Câu chuyện của chúng tôi
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between border-t border-white/30 pt-5">
              <a
                href="#story"
                className="group flex items-center gap-3 text-[15px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:text-[#ffe07a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-[17px] sm:tracking-[0.2em]"
              >
                Khám phá tiếp{" "}
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {bannerUrl && (
        <div
          role="group"
          aria-roledescription="slide"
          aria-label="2 / 2: Festival Cồng Chiêng 2026"
          className="relative isolate flex min-h-[100svh] w-full min-w-full shrink-0 basis-full snap-start flex-col justify-center overflow-hidden bg-[#b9d3e3] md:block"
        >
          {/* Phones are portrait: the banner sits whole over a soft copy of itself, with its text set below. */}
          <img
            src={bannerUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-10 h-full w-full scale-110 object-cover blur-2xl md:hidden"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#0c1f17]/55 md:hidden" />
          <img
            src={bannerUrl}
            alt={festivalBanner.alt}
            width={festivalBanner.width}
            height={festivalBanner.height}
            decoding="async"
            className="relative h-auto w-full md:absolute md:inset-0 md:h-full md:object-cover md:object-center"
          />
          
        </div>
      )}
      </div>

      {slideCount > 1 && (
        <div className="absolute bottom-5 right-6 z-30 flex items-center gap-3 lg:bottom-8 lg:right-12">
          <div
            role="group"
            aria-label="Chọn slide"
            className="flex items-center"
          >
            {Array.from({ length: slideCount }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Chuyển tới slide ${index + 1}`}
                aria-current={index === active ? "true" : undefined}
                className="group flex h-11 w-7 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span
                  className={`h-2.5 rounded-full bg-white transition-all duration-300 ${
                    index === active
                      ? "w-7"
                      : "w-2.5 opacity-60 group-hover:opacity-100"
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Slide trước"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#15602b] transition-colors hover:bg-[#15602b] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#15602b]"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === slideCount - 1}
            aria-label="Slide sau"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#15602b] transition-colors hover:bg-[#15602b] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#15602b]"
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  )
}

function PhotoCredit({
  credit,
  className = "",
}: {
  credit: { label: string; href: string }
  className?: string
}) {
  return (
    <a
      href={credit.href}
      target="_blank"
      rel="noreferrer noopener"
      className={`inline-flex min-h-6 items-center text-sm text-[#2f3d35] underline underline-offset-2 hover:text-[#15602b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024] ${className}`}
    >
      Ảnh: {credit.label}
    </a>
  )
}

function Story() {
  return (
    <section id="story" className="bg-gradient-to-b from-[#f6fbf6] to-[#e4f2e8] px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-[0.9fr_1fr] lg:gap-24">
        <Reveal>
          <figure className="m-0">
            <img
              src={churchImage}
              alt="Nhà thờ gỗ Kon Tum dưới bầu trời xanh"
              width={1600}
              height={1061}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover object-[50%_35%]"
            />
            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[15px] text-[#2f3d35]">
              <span className="font-semibold">Nhà thờ gỗ Kon Tum, Gia Lai</span>
              <PhotoCredit credit={imageCredits.konTumChurch} />
            </figcaption>
          </figure>
        </Reveal>

        <div>
          <Reveal>
            <h2 className="m-0 max-w-[16ch] font-display text-[clamp(2.25rem,4.6vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[#1f7a3a]">
              Kết nối điểm đến, kiến tạo trải nghiệm
            </h2>
          </Reveal>
          <Reveal
            delay={80}
            className="mt-8 flex max-w-xl flex-col gap-5 text-[18px] leading-8 text-[#2f3d35]"
          >
            <p className="m-0 font-semibold text-[#183024]">
              Đồng hành cùng mỗi chuyến đi.
            </p>
            <p className="m-0">
              Được thành lập năm 2012, Gia Lai Eco-Tourist khởi nguồn từ niềm
              đam mê du lịch và thế mạnh tại Gia Lai - Tây Nguyên, từng bước mở
              rộng hành trình trong nước và quốc tế.
            </p>
            <p className="m-0">
              Với nền tảng uy tín, chất lượng và đổi mới, chúng tôi mang đến đa
              dạng dịch vụ từ tour, MICE đến visa, vé máy bay và xe du lịch,
              giúp khách hàng an tâm lên đường và tận hưởng trọn vẹn mỗi chuyến
              đi.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <dl className="m-0 mt-10 flex gap-12">
              {[
                ["2012", "năm thành lập"],
                ["14+", "năm bền bỉ"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dd className="m-0 font-display text-5xl leading-none tracking-[-0.03em] text-[#1f7a3a]">
                    {value}
                  </dd>
                  <dt className="mt-2 text-[16px] text-[#2f3d35]">{label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** Take tours with distinct photos first so the home row never repeats an image. */
function pickVariedTours(tours: Tour[], count: number): Tour[] {
  const seen = new Set<string>()
  const varied: Tour[] = []
  const rest: Tour[] = []
  for (const tour of tours) {
    if (seen.has(tour.image)) rest.push(tour)
    else {
      seen.add(tour.image)
      varied.push(tour)
    }
  }
  return [...varied, ...rest].slice(0, count)
}

function tourCategory(tour: Tour): string {
  if (tour.tourGroup === "international") return "Tour ngoài nước"
  if (tour.tourGroup === "special") return "Dịch vụ khác"
  return "Tour trong nước"
}

/** The duration is shown as its own chip, so drop "(3 ngày 2 đêm)" from the title. */
function shortTitle(title: string): string {
  return title.replace(/\s*\(\s*\d+\s*ngày[^)]*\)\s*$/i, "").trim() || title
}

function ExperienceCard({ tour }: { tour: Tour }) {
  const query = `slug=${encodeURIComponent(tour.slug)}`

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[2px] bg-[#f0f7f1] transition-transform duration-300 motion-safe:hover:-translate-y-1 focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-[#183024]">
      <div className="overflow-hidden bg-[#e1f0e4]">
        <img
          src={tour.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="aspect-[4/3] w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 lg:p-6">
        <p className="m-0 text-[15px] font-semibold text-[#4f5b53]">
          {tourCategory(tour)} · {tour.durationLabel}
        </p>
        <h3 className="m-0 font-display text-[22px] leading-[1.2] tracking-[-0.02em] text-[#1f7a3a]">
          {/* Stretched link: the whole card is one click target and one tab stop. */}
          <a
            href={`#/tour?${query}`}
            onClick={(event) => {
              event.preventDefault()
              navigateTo("/tour", query)
            }}
            className="transition-colors after:absolute after:inset-0 after:content-[''] hover:text-[#15602b] focus-visible:outline-none"
          >
            {shortTitle(tour.title)}
          </a>
        </h3>
        <p className="m-0 line-clamp-2 text-[16px] leading-6 text-[#2f3d35]">
          {tour.blurb}
        </p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-3 pt-2">
          <p className="m-0">
            <span className="block text-sm text-[#4f5b53]">Giá từ</span>
            <strong className="mt-0.5 block text-lg font-semibold text-[#183024]">
              {tour.priceVnd === null
                ? "Liên hệ để biết giá"
                : formatVnd(tour.priceVnd)}
            </strong>
          </p>
          <a
            href="#contact"
            onClick={goToEnquiry}
            className="group/link relative z-10 inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-[#1f7a3a] px-5 text-[15px] font-semibold text-white transition-colors hover:bg-[#15602b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
          >
            Đặt hành trình
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </article>
  )
}

function Experiences() {
  const filters = [
    "Tất cả",
    "Tour trong nước",
    "Tour ngoài nước",
    "Dịch vụ khác",
  ]
  const [activeFilter, setActiveFilter] = useState("Tất cả")
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    let active = true
    loadPublishedTours()
      .then((nextTours) => {
        if (!active) return
        setTours(nextTours)
        setLoadError(false)
      })
      .catch(() => {
        if (active) setLoadError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const visibleTours =
    activeFilter === "Tất cả"
      ? tours
      : tours.filter((tour) => tourCategory(tour) === activeFilter)
  const exploreQuery =
    activeFilter === "Tour ngoài nước"
      ? "tourGroup=international"
      : activeFilter === "Dịch vụ khác"
        ? "tourGroup=special"
        : activeFilter === "Tour trong nước"
          ? "tourGroup=domestic"
          : ""
  const allToursLabel =
    activeFilter === "Tất cả"
      ? "Xem toàn bộ hành trình"
      : `Xem toàn bộ ${activeFilter}`

  return (
    <section
      id="experiences"
      className="bg-white px-6 py-24 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end lg:gap-16">
          <h2 className="m-0 max-w-[20ch] text-balance font-display text-[clamp(2.25rem,5vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.04em] text-[#1f7a3a]">
            Đi theo cách của riêng bạn.
          </h2>
          <p className="m-0 max-w-md text-[18px] leading-8 text-[#2f3d35]">
            Từ một buổi sớm bên mặt hồ đến bốn ngày trong rừng sâu. Mỗi hành
            trình được thiết kế để bạn có thời gian thực sự ở đó.
          </p>
        </Reveal>

        <div
          className="mt-10 flex flex-wrap gap-2"
          role="group"
          aria-label="Lọc loại hành trình"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={`min-h-11 whitespace-nowrap rounded-full px-5 text-[15px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024] ${
                activeFilter === filter
                  ? "bg-[#1f7a3a] text-white"
                  : "bg-[#f0f7f1] text-[#183024] hover:bg-[#1f7a3a] hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <p className="col-span-full py-16 text-center text-[17px] text-[#2f3d35]">
              Đang tải các hành trình đã công bố…
            </p>
          ) : loadError ? (
            <p className="col-span-full py-16 text-center text-[17px] text-[#2f3d35]">
              Chưa thể tải hành trình lúc này. Bạn có thể xem toàn bộ danh mục ở
              trang Explore.
            </p>
          ) : (
            pickVariedTours(visibleTours, 4).map((tour) => (
              <ExperienceCard key={tour.id} tour={tour} />
            ))
          )}
        </div>
        {!loading && !loadError && visibleTours.length === 0 && (
          <p className="py-16 text-center text-[17px] text-[#2f3d35]">
            Đang cập nhật hành trình mới.
          </p>
        )}
        <div className="mt-10 flex justify-end">
          <a
            href={exploreQuery ? `#/explore?${exploreQuery}` : "#/explore"}
            onClick={(event) => {
              event.preventDefault()
              navigateTo("/explore", exploreQuery)
            }}
            className="group inline-flex min-h-14 items-center gap-3 rounded-full bg-[#1f7a3a] px-8 text-[16px] font-semibold text-white transition-colors hover:bg-[#15602b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
          >
            {allToursLabel}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  )
}

function Journal() {
  const credited = galleryImages.filter((image) => image.credit)
  return (
    <section id="journal" className="bg-gradient-to-b from-[#f6fbf6] to-[#e4f2e8] px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end lg:gap-16">
          <h2 className="m-0 max-w-[20ch] text-balance font-display text-[clamp(2.25rem,5vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.04em] text-[#1f7a3a]">
            Những điều mắt thấy, tim nhớ.
          </h2>
          <p className="m-0 max-w-md text-[18px] leading-8 text-[#2f3d35]">
            Một vài lát cắt từ Gia Lai và Tây Nguyên: mặt hồ lúc sớm, thác nước
            giữa rừng, những chuyến thuyền độc mộc trên sông.
          </p>
        </Reveal>
        <Reveal className="grid auto-rows-[220px] gap-4 sm:grid-cols-2 sm:auto-rows-[200px] lg:grid-cols-4 lg:auto-rows-[260px]">
          {galleryImages.map((image) => (
            <figure
              key={image.caption}
              className={`group relative m-0 overflow-hidden rounded-[2px] bg-[#e1f0e4] ${image.className.replace("sm:col-span-2", "sm:col-span-2 lg:col-span-2")}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
              />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-[#f0f7f1] px-4 py-1.5 text-[15px] font-semibold text-[#183024]">
                {image.caption}
              </figcaption>
            </figure>
          ))}
        </Reveal>
        <p className="m-0 mt-6 flex flex-wrap gap-x-5 gap-y-1">
          {credited.map((image) => (
            <PhotoCredit key={image.caption} credit={image.credit!} />
          ))}
        </p>
      </div>
    </section>
  )
}

const fieldLabel = "mb-2 block text-[15px] font-semibold text-[#183024]"
const fieldInput =
  "min-h-12 w-full rounded-[2px] bg-white px-4 text-[16px] text-[#183024] outline-none transition-colors placeholder:text-[#4f5b53] hover:bg-[#eaf4ec] focus:bg-[#f0f7f1] focus:outline focus:outline-2 focus:outline-[#183024]"

/** Example month shown in the form, always a few months ahead of today. */
function exampleDeparture(): string {
  const date = new Date()
  date.setMonth(date.getMonth() + 2)
  return `Ví dụ: tháng ${date.getMonth() + 1}/${date.getFullYear()}`
}

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    group: "",
    note: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    const formData = new FormData(event.currentTarget)
    const honeypot = formData.get("website")
    if (typeof honeypot === "string" && honeypot.trim()) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      await submitServiceSubmission({
        serviceKey: "general",
        contactName: form.name,
        phone: form.phone,
        email: form.email,
        details: {
          date: form.date,
          group: form.group,
          note: form.note,
        },
        privacyConsent: formData.get("privacy_consent") === "true",
      })
      setSubmitted(true)
    } catch (error) {
      setSubmitError(submissionErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="bg-white px-6 py-24 lg:px-12 lg:py-32">
      <Reveal className="mx-auto grid max-w-[1440px] overflow-hidden rounded-[2px] bg-gradient-to-br from-[#f6fbf6] to-[#e4f2e8] lg:grid-cols-[0.82fr_1.18fr]">
        <div className="bg-gradient-to-br from-[#2f9150] via-[#25834a] to-[#1b6e3c] p-8 text-white sm:p-12 lg:p-14">
          <div className="flex h-full flex-col justify-center">
            <h2 className="m-0 max-w-[12ch] font-display text-[clamp(2.25rem,4.4vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.04em]">
              Để rừng gọi đúng tên bạn.
            </h2>
            <p className="m-0 mt-7 max-w-sm text-[18px] leading-8">
              Bạn đã có cung đường trong đầu, hay chỉ biết mình muốn đi? Kể
              chúng tôi nghe. Một người địa phương sẽ trả lời trong vòng 24 giờ.
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-12 lg:p-14">
          {submitted ? (
            <div className="flex h-full min-h-[460px] flex-col justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1f7a3a] text-white">
                <Leaf className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="m-0 mt-7 font-display text-4xl tracking-[-0.03em] text-[#1f7a3a]">
                Đã nhận lời nhắn.
              </h3>
              <p className="m-0 mt-4 max-w-sm text-[17px] leading-7 text-[#2f3d35]">
                Cảm ơn {form.name || "bạn"}. Chúng tôi sẽ liên hệ lại trong vòng
                24 giờ để cùng bạn phác thảo hành trình phù hợp.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-8 min-h-12 self-start rounded-full bg-white px-6 text-[15px] font-semibold text-[#183024] transition-colors hover:bg-[#e1f0e4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
              >
                Gửi yêu cầu khác
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              aria-busy={submitting}
              className="grid gap-6"
            >
              <div
                aria-hidden="true"
                className="absolute left-[-10000px] h-px w-px overflow-hidden"
              >
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <div>
                <h3 className="m-0 font-display text-3xl tracking-[-0.03em] text-[#1f7a3a]">
                  Bắt đầu từ đây.
                </h3>
                <p className="m-0 mt-2 text-[17px] text-[#2f3d35]">
                  Điền vài thông tin, phần còn lại để chúng tôi lo.
                </p>
              </div>
              {submitError ? (
                <p
                  role="alert"
                  className="m-0 rounded-[2px] bg-[#f4dfd6] px-4 py-3 text-[16px] leading-6 text-[#6b2a14]"
                >
                  {submitError}
                </p>
              ) : null}
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className={fieldLabel}>Họ và tên *</span>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={fieldInput}
                    placeholder="Tên của bạn"
                  />
                </label>
                <label className="block">
                  <span className={fieldLabel}>Email *</span>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={fieldInput}
                    placeholder="ban@email.com"
                  />
                </label>
                <label className="block">
                  <span className={fieldLabel}>Số điện thoại *</span>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={fieldInput}
                    placeholder="09xx xxx xxx"
                  />
                </label>
                <label className="block">
                  <span className={fieldLabel}>Thời gian dự kiến</span>
                  <input
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className={fieldInput}
                    placeholder={exampleDeparture()}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className={fieldLabel}>Số người</span>
                  <select
                    name="group"
                    value={form.group}
                    onChange={handleChange}
                    className={fieldInput}
                  >
                    <option value="">Chọn số người</option>
                    <option value="1-2">1 – 2 người</option>
                    <option value="3-6">3 – 6 người</option>
                    <option value="7-12">7 – 12 người</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className={fieldLabel}>Bạn muốn trải nghiệm gì?</span>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows={4}
                  className={`${fieldInput} resize-y py-3`}
                  placeholder="Trekking, văn hóa, nghỉ dưỡng... hoặc chỉ viết 'tôi muốn đi'"
                />
              </label>
              <label className="flex items-start gap-3 text-[15px] leading-6 text-[#2f3d35]">
                <input
                  required
                  name="privacy_consent"
                  value="true"
                  type="checkbox"
                  className="mt-1 h-[18px] w-[18px] shrink-0 accent-[#183024]"
                />
                <span>
                  Tôi đồng ý để Gia Lai Eco Tourist sử dụng thông tin này cho
                  việc tư vấn và liên hệ về yêu cầu của tôi.
                </span>
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#1f7a3a] px-8 text-[16px] font-semibold text-white transition-colors hover:bg-[#15602b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
              >
                {submitting ? "Đang gửi..." : "Gửi yêu cầu"}{" "}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
              <p className="m-0 text-center text-[15px] text-[#2f3d35]">
                Thông tin của bạn chỉ được dùng để tư vấn hành trình.
              </p>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Story />
      <Experiences />
      <Journal />
      <Contact />
    </>
  )
}
