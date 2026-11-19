import logo from "@/imports/logo_color.webp"
import { followNavLink } from "./Navigation"
import type { NavLink } from "./Navigation"
import { FORM_ID } from "@/components/services/ServiceForm"
import { navigateTo } from "@/lib/useHashRoute"

const explore: NavLink[] = [
  { label: "Tour Tây Nguyên", path: "/explore", query: "vung=tay-nguyen" },
  { label: "Tour khắp Việt Nam", path: "/explore", query: "tourGroup=domestic" },
  { label: "Thiết kế tour riêng", path: "/services", query: "service=general" },
  { label: "Dịch vụ khác", path: "/services" },
]
export default function Footer() {
  return <footer className="bg-night pt-12 pb-28 text-footer-text md:pb-8 lg:pt-18"><div className="page-container"><div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_0.8fr_1fr_1.2fr]">
    <div><a href="#/" className="flex min-h-12 items-center gap-3 text-[18px] font-bold leading-[27px] text-white"><img src={logo} alt="" width={72} height={72} className="rounded-photo bg-paper p-1" />Gia Lai Eco Tourist</a><p className="mt-5 max-w-sm text-[15px] leading-6 text-footer-muted">Gia Lai Eco Tourist là công ty lữ hành tại Pleiku, tổ chức những hành trình khám phá khắp Việt Nam — từ núi rừng, di sản đến biển đảo.</p></div>
    <div><h2 className="footer-v2-heading">Khám phá</h2>{explore.map(link => <a key={link.label} href={`#${link.path}${link.query ? `?${link.query}` : ""}`} onClick={event => { if (link.label === "Thiết kế tour riêng") { event.preventDefault(); navigateTo("/services", link.query ?? "", { scrollTo: FORM_ID }) } else followNavLink(event, link) }} className="footer-v2-link">{link.label}</a>)}</div>
    <div><h2 className="footer-v2-heading">Về chúng tôi</h2><a href="#culture" className="footer-v2-link" onClick={event => followNavLink(event, { label: "", path: "/", section: "culture" })}>Câu chuyện</a><a href="#about" className="footer-v2-link" onClick={event => followNavLink(event, { label: "", path: "/", section: "about" })}>Du lịch có trách nhiệm</a><p className="mt-3 text-[13px] leading-6 text-footer-muted">Giấy phép KDLHQT số<br />64-004/2015/TCDL-GPLHQT</p></div>
    <div><h2 className="footer-v2-heading">Liên hệ</h2><a href="tel:02693760898" className="footer-v2-link">Hotline 0269 376 0898</a><a href="https://zalo.me/02693760898" className="footer-v2-link">Zalo: Gia Lai Eco Tourist</a><address className="mt-2 text-[15px] not-italic leading-6">82 Hùng Vương – Phường Pleiku – Gia Lai</address><a href="mailto:info@gialaiecotourist.com" className="footer-v2-link break-all">info@gialaiecotourist.com</a></div>
  </div><div className="mt-12 border-t border-paper/15 pt-6 text-[13px] leading-[19px] text-footer-muted lg:mt-20">© {new Date().getFullYear()} Gia Lai Eco Tourist · Pleiku, Gia Lai</div></div></footer>
}
