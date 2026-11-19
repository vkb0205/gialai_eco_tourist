import { useEffect, useRef, useState } from "react"
import { List, Phone, X } from "@phosphor-icons/react"
import logo from "@/imports/logo_color.webp"
import { navigateTo, useHashRoute } from "@/lib/useHashRoute"
import type { RoutePath } from "@/lib/useHashRoute"
import { FORM_ID } from "@/components/services/ServiceForm"

export type NavLink = { label: string; path: RoutePath; query?: string; section?: string }
export const navLinks: NavLink[] = [
  { label: "Trang chủ", path: "/" },
  { label: "Khám phá tour", path: "/explore" },
  { label: "Dịch vụ khác", path: "/services" },
  { label: "Về chúng tôi", path: "/", section: "about" },
]
export function hrefFor(link: NavLink) {
  return link.section ? `#${link.section}` : `#${link.path}${link.query ? `?${link.query}` : ""}`
}
export function followNavLink(event: { preventDefault(): void }, link: NavLink) {
  event.preventDefault()
  navigateTo(link.path, link.query ?? "", link.section ? { scrollTo: link.section } : undefined)
}
export function goToEnquiry(event: { preventDefault(): void }) {
  event.preventDefault()
  navigateTo("/services", "service=general", { scrollTo: FORM_ID })
}
function LanguageSwitch({ tourDetail }: { tourDetail: boolean }) {
  const itemClass = "inline-flex h-5 items-center leading-5"

  return (
    <div
      aria-label="Ngôn ngữ"
      className={`flex shrink-0 items-center justify-center rounded-button border border-ink/25 text-[14px] font-bold ${tourDetail ? "h-12 w-[72px] xl:h-11 xl:w-[88px]" : "h-11 w-[56px] xl:w-[88px]"}`}
    >
      <span lang="vi" aria-current="true" className={`${itemClass} px-2`}>
        VI
      </span>
      {tourDetail ? (
        <>
          <span aria-hidden="true" className={itemClass}>
            /
          </span>
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="English sắp ra mắt"
            className={`${itemClass} cursor-not-allowed px-1 text-subtle`}
          >
            EN
          </button>
        </>
      ) : (
        <>
          <span aria-hidden="true" className={`${itemClass} hidden xl:inline-flex`}>
            /
          </span>
          <button
            type="button"
            disabled
            aria-disabled="true"
            title="English sắp ra mắt"
            className={`${itemClass} hidden min-w-11 cursor-not-allowed px-1 text-subtle xl:inline-flex`}
          >
            EN
          </button>
        </>
      )}
    </div>
  )
}
export default function Navigation() {
  const route = useHashRoute()
  const [open, setOpen] = useState(false)
  const tourDetail = route.path === "/tour"
  const toggle = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)
  useEffect(() => setOpen(false), [route.path, route.query, route.anchor])
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus() }
    }
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("keydown", close)
    document.addEventListener("pointerdown", outside)
    return () => { document.removeEventListener("keydown", close); document.removeEventListener("pointerdown", outside) }
  }, [open])
  const links = navLinks.map(link => <a key={link.label} href={hrefFor(link)} onClick={event => { setOpen(false); followNavLink(event, link) }} aria-current={route.path === link.path && !link.section && !route.anchor ? "page" : undefined} className="nav-link flex min-h-11 items-center text-[15px] leading-[22px] font-medium hover:text-forest aria-[current=page]:font-bold aria-[current=page]:text-forest">{link.label}</a>)
  return <header ref={header} className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper text-ink">
    <div className="page-container flex h-[72px] items-center justify-between gap-2 xl:h-[88px] xl:gap-6">
      <a href="#/" onClick={event => { event.preventDefault(); setOpen(false); navigateTo("/", "", { scrollTo: "home" }) }} className="flex min-h-11 min-w-0 items-center gap-2 xl:gap-3">
        <img src={logo} alt="" width={72} height={72} className={`shrink-0 object-contain xl:h-[72px] xl:w-[72px] ${tourDetail ? "h-11 w-11" : "h-[52px] w-[52px]"}`} />
        <span className="min-w-0"><span className={`block font-bold ${tourDetail ? "text-[13px] leading-5 xl:text-lg xl:leading-[27px]" : "text-lg leading-[27px]"}`}>Gia Lai Eco Tourist</span><span className="mt-1 hidden text-[11px] font-bold tracking-wider text-subtle xl:block">TOUR KHẮP VIỆT NAM</span></span>
      </a>
      <nav aria-label="Điều hướng chính" className="hidden items-center gap-6 xl:flex">{links}</nav>
      <div className="flex items-center gap-2 xl:gap-4"><LanguageSwitch tourDetail={tourDetail} /><a href="tel:02693760898" className="hidden min-h-12 items-center gap-3 rounded-button bg-forest px-6 text-white xl:flex"><Phone size={20} aria-hidden="true" /><span><span className="block text-[11px] text-leaf">Hotline 7:30 - 21:00</span><strong className="block text-base">0269 376 0898</strong></span></a><button ref={toggle} type="button" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} className={`flex shrink-0 items-center justify-center rounded-button hover:bg-leaf xl:hidden ${tourDetail ? "h-12 w-12" : "h-11 w-11"}`}>{open ? <X size={24} /> : <List size={24} />}</button></div>
    </div>
    {open && <nav id="mobile-navigation" aria-label="Điều hướng di động" className="page-container grid gap-2 border-t border-line bg-paper py-4 shadow-card xl:hidden">{links}<a href="tel:02693760898" className="btn-primary mt-2">Gọi 0269 376 0898</a></nav>}
  </header>
}
