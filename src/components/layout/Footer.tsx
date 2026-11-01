import { ArrowRight } from "@phosphor-icons/react"
import logoWhite from "@/imports/logo_white.webp"
import { followNavLink, goToEnquiry, hrefFor, navLinks } from "./Navigation"
import { navigateTo } from "@/lib/useHashRoute"

export default function Footer() {
  return (
    <footer className="bg-[#10231a] px-6 pb-8 pt-16 text-white lg:px-12">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.65fr_1fr]">
          <div>
            <a
              href="#/"
              className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2b08e]"
              onClick={(event) => {
                event.preventDefault()
                navigateTo("/", "", { scrollTo: "home" })
              }}
            >
              <img
                src={logoWhite}
                alt=""
                width={48}
                height={36}
                className="h-11 w-auto object-contain"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-[17px] font-semibold">
                  Gialai
                </span>
                <span className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                  Eco Tourist
                </span>
              </span>
            </a>
            <p className="mt-6 max-w-xs text-sm leading-6 text-white/75">
              Những trải nghiệm có trách nhiệm giữa thiên nhiên và văn hóa Tây
              Nguyên.
            </p>
            <address className="mt-6 max-w-xs text-[15px] not-italic leading-6 text-white">
              <strong className="block font-semibold">
                CÔNG TY TNHH THƯƠNG MẠI DU LỊCH SINH THÁI GIALAI
              </strong>
              82 Hùng Vương, Phường Pleiku, Gia Lai, Việt Nam
            </address>
          </div>

          <div>
            <h2 className="footer-heading">Khám phá</h2>
            <div className="flex flex-col items-start">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={hrefFor(link)}
                  onClick={(event) => followNavLink(event, link)}
                  className="inline-flex min-h-11 items-center text-sm text-white/80 transition-colors hover:text-[#f2b08e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2b08e]"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={goToEnquiry}
                className="inline-flex min-h-11 items-center text-sm text-white/80 transition-colors hover:text-[#f2b08e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2b08e]"
              >
                Đặt hành trình
              </a>
            </div>
          </div>

          <div>
            <h2 className="footer-heading">Bắt đầu hành trình</h2>
            <p className="mb-5 max-w-sm text-sm leading-6 text-white/75">
              Kể chúng tôi nghe bạn muốn đi đâu. Một người địa phương sẽ phản
              hồi và cùng bạn phác thảo chuyến đi.
            </p>
            <a
              href="#contact"
              onClick={goToEnquiry}
              className="group inline-flex min-h-11 items-center gap-3 rounded-full bg-[#fed24f] px-6 text-xs font-bold uppercase tracking-[0.12em] text-[#4a3220] transition-colors hover:bg-[#ffe07a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Gửi yêu cầu
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.12em] text-white/70 sm:flex-row">
          <span>© {new Date().getFullYear()} Gialai Eco Tourist</span>
          <span>Đi chậm. Nhìn kỹ. Sống sâu.</span>
        </div>
      </div>
    </footer>
  )
}
