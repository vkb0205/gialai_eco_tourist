import { useEffect, useState } from "react"
import { ArrowUpRight, CaretDown, List, X } from "@phosphor-icons/react"
import logo from "@/imports/logo.png"
import logoWhite from "@/imports/logo_white.png"
import { navigateTo, useHashRoute } from "@/lib/useHashRoute"
import type { RoutePath } from "@/lib/useHashRoute"

export type NavLink = {
  label: string
  /** Route the link resolves to. */
  path: RoutePath
  /** Hash query string, used for explore-filter presets. */
  query?: string
  /** Landing-page section id, when the link targets a section of `/`. */
  section?: string
}

const domesticExploreQuery = "tourGroup=domestic"
const internationalExploreQuery = "tourGroup=international"
const specialExploreQuery = "tourGroup=special"

const domesticRegions = [
  { label: "Tây Nguyên", query: "tourGroup=domestic&vung=tay-nguyen" },
  { label: "Miền Bắc", query: "tourGroup=domestic&vung=mien-bac" },
  { label: "Miền Nam", query: "tourGroup=domestic&vung=mien-nam" },
  { label: "Miền Trung", query: "tourGroup=domestic&vung=mien-trung" },
]

const internationalDestinations = [
  "Thái Lan",
  "Campuchia",
  "Singapore",
  "Hàn Quốc",
  "Nhật Bản",
  "Trung Quốc",
  "Mỹ",
  "Khác",
].map((label) => ({
  label,
  query: `tourGroup=international&destination=${encodeURIComponent(label)}`,
}))

const specialTours = [
  "Tour du thuyền",
  "Tour trải nghiệm học sinh-sinh viên",
  "Tour Cựu Chiến Binh",
].map((label) => ({
  label,
  query: `tourGroup=special&special=${encodeURIComponent(label)}`,
}))

/**
 * Primary navigation model, shared with the footer so both stay in step.
 * Section links carry a route as well, so they still work from `#/explore`.
 */
export const navLinks: NavLink[] = [
  { label: "Hành trình", path: "/", section: "experiences" },
  {
    label: "Tour trong nước",
    path: "/explore",
    query: domesticExploreQuery,
  },
  {
    label: "Tour ngoài nước",
    path: "/explore",
    query: internationalExploreQuery,
  },
  {
    label: "Tour đặc biệt",
    path: "/explore",
    query: specialExploreQuery,
  },
]

const secondaryLinks: Record<string, { label: string; query: string }[]> = {
  "Tour trong nước": domesticRegions,
  "Tour ngoài nước": internationalDestinations,
  "Tour đặc biệt": specialTours,
}

const serviceOptions: { label: string; slug: string; query: string }[] = [
  { label: "Thuê xe", slug: "thue-xe", query: "dichvu=thue-xe" },
  { label: "Visa", slug: "visa", query: "dichvu=visa" },
  { label: "Vé máy bay", slug: "ve-may-bay", query: "dichvu=ve-may-bay" },
]

/** Href for a nav link, so links stay real anchors and remain openable in a new tab. */
export function hrefFor(link: NavLink): string {
  if (link.path === "/explore") {
    return link.query ? `#/explore?${link.query}` : "#/explore"
  }
  return link.section ? `#${link.section}` : "#/"
}

/**
 * Follow a nav link through the router rather than the browser's default hash
 * jump, so a section link pressed on `#/explore` returns home and then scrolls.
 */
export function followNavLink(
  event: { preventDefault(): void },
  link: NavLink,
): void {
  event.preventDefault()
  navigateTo(
    link.path,
    link.query ?? "",
    link.section ? { scrollTo: link.section } : undefined,
  )
}

/** Send the traveller to the enquiry form, from whichever route they are on. */
export function goToEnquiry(event: { preventDefault(): void }): void {
  event.preventDefault()
  navigateTo("/", "", { scrollTo: "contact" })
}

/**
 * Watch a zero-height sentinel at the top of the document instead of listening
 * to every scroll event. The observer fires twice per page rather than on each
 * frame, which keeps the main thread free while the catalogue is filtering.
 */
function useScrolledPastTop(): [boolean, (
  node: HTMLDivElement | null,
) => void] {
  const [scrolled, setScrolled] = useState(false)
  // State rather than a ref, so the effect re-runs exactly when the node changes.
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [sentinel])

  return [scrolled, setSentinel]
}

export default function Navigation() {
  const route = useHashRoute()
  const [scrolledPastTop, setSentinel] = useScrolledPastTop()
  const [scrollY, setScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const updateScrollY = () => setScrollY(window.scrollY)
    updateScrollY()
    window.addEventListener("scroll", updateScrollY, { passive: true })
    return () => window.removeEventListener("scroll", updateScrollY)
  }, [])

  // The landing hero is a dark photograph, so the bar starts transparent there.
  // While scrolling inside the hero it stays transparent and only blurs; once
  // outside the hero, or on non-home routes, it becomes the solid green bar.
  const insideHero = route.path === "/" && scrollY < window.innerHeight - 78
  const atHeroTop = route.path === "/" && !scrolledPastTop
  const solid = route.path !== "/" || !insideHero

  useEffect(() => {
    setMenuOpen(false)
  }, [route.path])

  return (
    <>
      {/* Zero net height: 40px tall, pulled back by an equal negative margin. */}
      <div ref={setSentinel} aria-hidden="true" className="h-10 -mb-10" />

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          solid
            ? "border-b border-[#07552f]/20 bg-[#07552f]/92 text-white shadow-[0_8px_24px_rgba(8,127,60,0.12)] backdrop-blur-[2px]"
            : atHeroTop
              ? "bg-transparent text-white"
              : "bg-transparent text-white backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex h-[78px] max-w-[1440px] items-center justify-between gap-4 px-6 lg:px-12">
          <a
            href="#/"
            className="group flex shrink-0 items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742]"
            onClick={(event) => {
              event.preventDefault()
              setMenuOpen(false)
              navigateTo("/", "", { scrollTo: "home" })
            }}
          >
            <img
              src={solid || !atHeroTop ? logoWhite : logo}
              alt="Gia Lai Eco-Tourist Co.,Ltd"
              className="h-12 w-12 object-contain"
            />
            <span className="flex flex-col leading-none">
              <span
                className={`font-display text-[17px] font-semibold tracking-[-0.03em] transition-colors ${
                  solid || !atHeroTop ? "text-white" : "text-[#6f4e37]"
                }`}
              >
                Gialai
              </span>
              <span
                className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] transition-colors ${
                  solid || !atHeroTop ? "text-white/80" : "text-[#6f4e37]"
                }`}
              >
                Eco Tourist
              </span>
            </span>
          </a>

          <nav
            className="hidden items-center gap-5 lg:flex xl:gap-7"
            aria-label="Điều hướng chính"
          >
            {navLinks.map((link) => {
              const active =
                link.path === "/explore" && route.path === "/explore" && route.query === (link.query ?? "")
              const children = secondaryLinks[link.label]
              return (
                <div key={link.label} className="group/nav relative">
                <a
                  key={link.label}
                  href={hrefFor(link)}
                  aria-current={active ? "page" : undefined}
                  onClick={(event) => followNavLink(event, link)}
                  className={`whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742] ${
                    solid || !atHeroTop
                      ? active
                        ? "text-[#d56742]"
                        : "text-white/85 hover:text-white"
                      : active
                        ? "text-[#6f4e37]"
                        : "text-[#6f4e37] hover:text-[#6f4e37]"
                  }`}
                >
                  {link.label}
                </a>
                {children && (
                  <div className="invisible absolute left-1/2 top-full z-10 mt-4 w-max -translate-x-1/2 translate-y-1 rounded-2xl border border-[#d9d4c9] bg-[#f6f3ec] p-2 text-[#183024] opacity-0 shadow-[0_18px_40px_rgba(10,25,17,0.16)] transition-all group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100">
                    <div className="grid gap-1">
                      {children.map((child) => (
                        <button
                          key={child.query}
                          type="button"
                          onClick={() => navigateTo("/explore", child.query)}
                          className="rounded-xl px-4 py-2.5 text-left text-[11px] font-semibold normal-case tracking-normal text-[#183024] transition-colors hover:bg-[#e9e6dd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d56742]"
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              )
            })}
            <div className="group relative">
              <button
                type="button"
                onClick={() => navigateTo("/services")}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742] ${
                  solid || !atHeroTop
                    ? route.path === "/services"
                      ? "text-[#d56742]"
                      : "text-white/85 hover:text-white"
                    : route.path === "/services"
                      ? "text-[#6f4e37]"
                      : "text-[#6f4e37] hover:text-[#6f4e37]"
                }`}
              >
                Dịch vụ khác
                <CaretDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <div className="invisible absolute right-0 top-full z-10 mt-3 min-w-[190px] rounded-2xl border border-[#d9d4c9] bg-[#f6f3ec] p-2 text-[#183024] opacity-0 shadow-[0_18px_40px_rgba(10,25,17,0.16)] transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {serviceOptions.map((option) => (
                  <button
                    key={option.slug}
                    type="button"
                    onClick={() => navigateTo("/services", option.query)}
                    className="block w-full rounded-xl px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-[#183024] transition-colors hover:bg-[#e9e6dd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d56742]"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              className={`whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742] ${
                solid || !atHeroTop
                  ? "text-white/85 hover:text-white"
                  : "text-[#6f4e37] hover:text-[#6f4e37]"
              }`}
            >
              Nhật ký hành trình
            </button>
            <a
              href="#contact"
              onClick={goToEnquiry}
              className={`ml-1 inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024] ${
                solid
                  ? "bg-[#fed24f] text-[#6f4e37] hover:bg-[#fed24f]"
                  : "bg-[#fed24f] text-[#6f4e37] hover:bg-[#fed24f]"
              }`}
            >
              Đặt hành trình{" "}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </nav>

          <button
            type="button"
            className={`flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d56742] lg:hidden ${
              solid
                ? "bg-[#183024] text-white"
                : "bg-white/15 text-[#6f4e37] backdrop-blur-md"
            }`}
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <List className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {menuOpen && (
          <nav
            className="border-t border-[#d9d4c9] bg-[#f6f3ec] px-6 py-6 text-[#183024] lg:hidden"
            aria-label="Menu di động"
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => {
                const children = secondaryLinks[link.label]
                return (
                  <div key={link.label}>
                    <a
                      href={hrefFor(link)}
                      className="text-sm font-semibold uppercase tracking-[0.12em] text-[#183024] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742]"
                      onClick={(event) => {
                        setMenuOpen(false)
                        followNavLink(event, link)
                      }}
                    >
                      {link.label}
                    </a>
                    {children && (
                      <div className="mt-2 grid gap-2 border-l border-[#d9d4c9] pl-4">
                        {children.map((child) => (
                          <button
                            key={child.query}
                            type="button"
                            onClick={() => {
                              setMenuOpen(false)
                              navigateTo("/explore", child.query)
                            }}
                            className="text-left text-xs font-medium text-[#5b665d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d56742]"
                          >
                            {child.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="border-t border-[#d9d4c9] pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    navigateTo("/services")
                  }}
                  className="text-sm font-semibold uppercase tracking-[0.12em] text-[#183024] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742]"
                >
                  Dịch vụ khác
                </button>
                <div className="mt-3 grid gap-2">
                  {serviceOptions.map((option) => (
                    <button
                      key={option.slug}
                      type="button"
                      onClick={() => {
                        setMenuOpen(false)
                        navigateTo("/services", option.query)
                      }}
                      className="text-left text-sm font-medium uppercase tracking-[0.1em] text-[#5b665d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742]"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <a
                href="#contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d56742] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#6f4e37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
                onClick={(event) => {
                  setMenuOpen(false)
                  goToEnquiry(event)
                }}
              >
                Đặt hành trình{" "}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </nav>
        )}
      </header>
    </>
  )
}
