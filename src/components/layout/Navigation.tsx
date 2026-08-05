import { useEffect, useState } from "react"
import { ArrowUpRight, Leaf, List, X } from "@phosphor-icons/react"
import { navigateTo, useHashRoute } from "@/lib/useHashRoute"
import type { RoutePath } from "@/lib/useHashRoute"

export type NavLink = {
  label: string
  /** Route the link resolves to. */
  path: RoutePath
  /** Landing-page section id, when the link targets a section of `/`. */
  section?: string
}

/**
 * Primary navigation model, shared with the footer so both stay in step.
 * Section links carry a route as well, so they still work from `#/explore`.
 */
export const navLinks: NavLink[] = [
  { label: "Hành trình", path: "/", section: "experiences" },
  { label: "Khám phá", path: "/explore" },
  { label: "Điểm đến", path: "/", section: "destinations" },
  { label: "Câu chuyện", path: "/", section: "story" },
  { label: "Nhật ký ảnh", path: "/", section: "journal" },
]

/** Href for a nav link, so links stay real anchors and remain openable in a new tab. */
export function hrefFor(link: NavLink): string {
  if (link.path === "/explore") return "#/explore"
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
    "",
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
  const [menuOpen, setMenuOpen] = useState(false)

  // The landing hero is a dark photograph, so the bar starts transparent there.
  // Explore has no hero, so it stays solid from the first paint.
  const solid = route.path !== "/" || scrolledPastTop

  useEffect(() => {
    setMenuOpen(false)
  }, [route.path])

  return (
    <>
      {/* Zero net height: 40px tall, pulled back by an equal negative margin. */}
      <div ref={setSentinel} aria-hidden="true" className="h-10 -mb-10" />

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid
            ? "border-b border-[#d9d4c9]/80 bg-[#f6f3ec]/95 text-[#183024] shadow-[0_10px_35px_rgba(27,48,36,0.08)] backdrop-blur-xl"
            : "bg-transparent text-white"
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
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                solid
                  ? "bg-[#d56742] text-white"
                  : "bg-white/15 text-white backdrop-blur-md"
              }`}
            >
              <Leaf className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[17px] font-semibold tracking-[-0.03em]">
                Gialai
              </span>
              <span
                className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] transition-colors ${
                  solid ? "text-[#5c6b5c]" : "text-white/70"
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
                link.path === "/explore" && route.path === "/explore"
              return (
                <a
                  key={link.label}
                  href={hrefFor(link)}
                  aria-current={active ? "page" : undefined}
                  onClick={(event) => followNavLink(event, link)}
                  className={`whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742] ${
                    solid
                      ? active
                        ? "text-[#d56742]"
                        : "text-[#4a5a50] hover:text-[#d56742]"
                      : active
                        ? "text-white"
                        : "text-white/85 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              )
            })}
            <a
              href="#contact"
              onClick={goToEnquiry}
              className={`ml-1 inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024] ${
                solid
                  ? "bg-[#183024] text-[#f6f3ec] hover:bg-[#d56742]"
                  : "bg-[#d56742] text-white hover:bg-[#e27b57]"
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
                : "bg-white/15 text-white backdrop-blur-md"
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
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={hrefFor(link)}
                  className="text-sm font-semibold uppercase tracking-[0.12em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742]"
                  onClick={(event) => {
                    setMenuOpen(false)
                    followNavLink(event, link)
                  }}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d56742] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
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
