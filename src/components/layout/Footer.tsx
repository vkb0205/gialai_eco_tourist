import { useState } from "react"
import type { FormEvent } from "react"
import { Leaf } from "@phosphor-icons/react"
import { followNavLink, goToEnquiry, hrefFor, navLinks } from "./Navigation"
import { navigateTo } from "@/lib/useHashRoute"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

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
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d56742] text-white">
                <Leaf className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-[17px] font-semibold">
                  Gialai
                </span>
                <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/55">
                  Eco Tourist
                </span>
              </span>
            </a>
            <p className="mt-6 max-w-xs text-sm leading-6 text-white/60">
              Những trải nghiệm có trách nhiệm giữa thiên nhiên và văn hóa Tây
              Nguyên.
            </p>
          </div>

          <div>
            <h2 className="footer-heading">Khám phá</h2>
            <div className="flex flex-col items-start gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={hrefFor(link)}
                  onClick={(event) => followNavLink(event, link)}
                  className="text-sm text-white/65 transition-colors hover:text-[#f2b08e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2b08e]"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={goToEnquiry}
                className="text-sm text-white/65 transition-colors hover:text-[#f2b08e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2b08e]"
              >
                Đặt hành trình
              </a>
            </div>
          </div>

          <div>
            <h2 className="footer-heading">Nhận câu chuyện mới</h2>
            <p className="mb-4 max-w-sm text-sm leading-6 text-white/60">
              Một email mỗi tháng về những cung đường, người bạn và điều đẹp đẽ
              ở lại.
            </p>
            {subscribed ? (
              <p className="text-sm text-[#f2b08e]">
                Đã đăng ký. Hẹn gặp bạn trong hộp thư.
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex max-w-sm border-b border-white/25 pb-2"
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email của bạn
                </label>
                <input
                  id="footer-email"
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email@cuaban.com"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45"
                />
                <button
                  type="submit"
                  className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#f2b08e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2b08e]"
                >
                  Đăng ký
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[0.14em] text-white/45 sm:flex-row">
          <span>© {new Date().getFullYear()} Gialai Eco Tourist</span>
          <span>Đi chậm. Nhìn kỹ. Sống sâu.</span>
        </div>
      </div>
    </footer>
  )
}
