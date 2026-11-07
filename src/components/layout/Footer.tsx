import { ArrowRight, EnvelopeSimple, Globe, MapPin, Phone } from "@phosphor-icons/react"
import logoColor from "@/imports/logo_color.webp"
import { followNavLink, goToEnquiry, hrefFor, navLinks } from "./Navigation"
import { navigateTo } from "@/lib/useHashRoute"

export default function Footer() {
  return (
    <footer className="border-t border-[#15602b]/15 bg-gradient-to-b from-white to-[#eef7f0] px-6 pb-8 pt-16 text-[#183024] lg:px-12">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.6fr_1fr]">
          <div>
            <a
              href="#/"
              className="flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15602b]"
              onClick={(event) => {
                event.preventDefault()
                navigateTo("/", "", { scrollTo: "home" })
              }}
            >
              <img
                src={logoColor}
                alt=""
                width={48}
                height={36}
                className="h-11 w-auto object-contain"
              />
              <span className="flex items-baseline gap-2.5 whitespace-nowrap leading-none">
                <span className="font-display text-[19px] font-semibold text-[#15602b]">
                  Gialai
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#183024]/70">
                  Eco Tourist
                </span>
              </span>
            </a>
            <p className="mt-6 max-w-xs text-sm leading-6 text-[#183024]/75 xl:max-w-none xl:whitespace-nowrap">
              Những trải nghiệm có trách nhiệm giữa thiên nhiên và văn hóa Tây
              Nguyên.
            </p>
            <address className="mt-6 max-w-sm space-y-1 text-[15px] not-italic leading-6 text-[#183024]">
              <strong className="block font-semibold uppercase">
                Công ty TNHH TM Du lịch Sinh thái Gia Lai
              </strong>
              <span className="block whitespace-nowrap font-medium">GIALAI ECOTOURIST Co., LTD</span>
              <span className="flex items-center gap-2">
                <MapPin
                  weight="fill"
                  className="h-4 w-4 shrink-0 text-[#15602b]"
                  aria-hidden="true"
                />
                82 Hùng Vương – Phường Pleiku – Gia Lai
              </span>
              <span className="flex items-center gap-2">
                <Phone
                  weight="fill"
                  className="h-4 w-4 shrink-0 text-[#15602b]"
                  aria-hidden="true"
                />
                Tel: 02693760898 - 3760899
              </span>
              <span className="flex items-center gap-2">
                <Globe
                  weight="fill"
                  className="h-4 w-4 shrink-0 text-[#15602b]"
                  aria-hidden="true"
                />
                Web:{" "}
                <a
                  href="https://www.gialaiecotourist.com"
                  className="text-[#15602b] underline underline-offset-2 hover:text-[#1f7a3a]"
                >
                  www.gialaiecotourist.com
                </a>
              </span>
              <span className="flex items-center gap-2">
                <EnvelopeSimple
                  weight="fill"
                  className="h-4 w-4 shrink-0 text-[#15602b]"
                  aria-hidden="true"
                />
                Email:{" "}
                <a
                  href="mailto:info@gialaiecotourist.com"
                  className="text-[#15602b] underline underline-offset-2 hover:text-[#1f7a3a]"
                >
                  info@gialaiecotourist.com
                </a>
              </span>
              <span className="block">
                Giấy phép KDLHQT số 64-004/2015/TCDL-GPLHQT
              </span>
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
                  className="inline-flex min-h-11 items-center text-sm text-[#183024]/80 transition-colors hover:text-[#15602b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15602b]"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={goToEnquiry}
                className="inline-flex min-h-11 items-center text-sm text-[#183024]/80 transition-colors hover:text-[#15602b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15602b]"
              >
                Đặt hành trình
              </a>
            </div>
          </div>

          <div>
            <h2 className="footer-heading">Bắt đầu hành trình</h2>
            <p className="mb-5 max-w-sm text-sm leading-6 text-[#183024]/75">
              Kể chúng tôi nghe bạn muốn đi đâu. Một người địa phương sẽ phản
              hồi và cùng bạn phác thảo chuyến đi.
            </p>
            <a
              href="#contact"
              onClick={goToEnquiry}
              className="group inline-flex min-h-11 items-center gap-3 rounded-full bg-[#fed24f] px-6 text-xs font-bold uppercase tracking-[0.12em] text-[#4a3220] transition-colors hover:bg-[#ffe07a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15602b]"
            >
              Gửi yêu cầu
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-3 border-t border-[#183024]/10 pt-6 text-xs uppercase tracking-[0.12em] text-[#183024]/70 sm:flex-row">
          <span>© {new Date().getFullYear()} Gialai Eco Tourist</span>
          <span>Đi chậm. Nhìn kỹ. Sống sâu.</span>
        </div>
      </div>
    </footer>
  )
}
