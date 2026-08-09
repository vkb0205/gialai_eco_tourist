import { useState, useMemo } from "react"
import { ArrowUpRight, CheckCircle, Sparkle } from "@phosphor-icons/react"
import img0 from "@/imports/image.jpeg"
import services from "@/data/services"
import type { Service } from "@/data/services"
import { goToEnquiry } from "@/components/layout/Navigation"
import { useHashRoute, navigateTo } from "@/lib/useHashRoute"

/* ───────────────────────────── Hero ───────────────────────────── */

function ServicesHero() {
  return (
    <section
      id="services-hero"
      className="relative isolate min-h-[520px] overflow-hidden bg-[#183024] text-white lg:min-h-[620px]"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={img0}
          alt="Dịch vụ du lịch Gia Lai"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,26,19,0.72)_0%,rgba(8,26,19,0.45)_50%,rgba(8,26,19,0.82)_100%)]" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-noise opacity-[0.035] mix-blend-overlay" />

      <div className="relative z-20 mx-auto flex min-h-[520px] max-w-[1440px] flex-col justify-end px-6 pb-16 pt-32 lg:min-h-[620px] lg:px-12 lg:pb-24">
        <div className="max-w-3xl">
          <div className="mb-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f2b08e]">
            <span className="h-px w-10 bg-[#f2b08e]" />
            Hỗ trợ hành trình
          </div>
          <h1 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] font-medium leading-[1.06] tracking-[-0.045em]">
            Dịch vụ khác
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/75 lg:text-lg">
            Từ thuê xe, vé máy bay, đặt phòng đến visa và hướng dẫn viên —
            chúng tôi đồng hành cùng bạn trên mọi chặng đường, để mỗi chuyến đi
            thêm trọn vẹn.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── Services Tabs ─────────────────────── */

/** Parse the `dichvu` param from the hash query string. */
function parseActiveSlug(query: string): string {
  const params = new URLSearchParams(query)
  return params.get("dichvu") ?? ""
}

function ServicesTabs() {
  const route = useHashRoute()
  const activeSlug = parseActiveSlug(route.query)

  const activeService: Service = useMemo(
    () => services.find((s) => s.slug === activeSlug) ?? services[0],
    [activeSlug],
  )

  const handleTabClick = (slug: string) => {
    const query = slug ? `dichvu=${slug}` : ""
    navigateTo("/services", query, { replace: true })
  }

  return (
    <section className="border-b border-[#d9d4c9] bg-[#f6f3ec] py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-14 max-w-2xl">
          <div className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#d56742]">
            <span className="h-px w-10 bg-[#d56742]" />
            Dịch vụ bổ trợ
          </div>
          <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.5rem)] font-medium leading-[1.15] tracking-[-0.03em] text-[#183024]">
            Mọi nhu cầu hành trình, một điểm tin cậy
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#69746b]">
            Không chỉ bán tour, chúng tôi cung cấp chuỗi dịch vụ trọn gói để
            bạn yên tâm khám phá Tây Nguyên và xa hơn nữa.
          </p>
        </div>

        {/* Tab bar — horizontally scrollable on small screens */}
        <div className="-mx-1 mb-10 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-1 whitespace-nowrap sm:flex-wrap">
            {services.map((service) => {
              const isActive = service.slug === activeService.slug
              return (
                <button
                  key={service.slug}
                  type="button"
                  onClick={() => handleTabClick(service.slug)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d56742] ${
                    isActive
                      ? "bg-[#d56742] text-white shadow-[0_4px_12px_rgba(213,103,66,0.3)]"
                      : "bg-white text-[#526257] hover:bg-[#e9e6dd] hover:text-[#183024] border border-[#e0dcd2]"
                  }`}
                >
                  <span className="text-base">{service.icon}</span>
                  {service.title}
                </button>
              )
            })}
          </div>
        </div>

        {/* Active service detail panel */}
        <div className="rounded-2xl border border-[#e0dcd2] bg-white p-8 shadow-[0_8px_24px_rgba(10,25,17,0.04)] lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-16">
            {/* Left: details */}
            <div>
              <div className="mb-2">
                <span className="rounded-full bg-[#f6f3ec] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#7f887f]">
                  {activeService.category}
                </span>
              </div>
              <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-[#183024] lg:text-3xl">
                {activeService.title}
              </h3>
              <p className="mt-4 max-w-prose text-sm leading-7 text-[#69746b]">
                {activeService.description}
              </p>

              <ul className="mt-8 space-y-3">
                {activeService.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm leading-6 text-[#526257]"
                  >
                    <CheckCircle
                      weight="duotone"
                      className="mt-0.5 h-5 w-5 shrink-0 text-[#d56742]"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={activeService.ctaHref}
                onClick={goToEnquiry}
                className="group/btn mt-8 inline-flex items-center gap-2 rounded-full bg-[#183024] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-all hover:-translate-y-0.5 hover:bg-[#d56742] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742]"
              >
                {activeService.cta}
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>

            {/* Right: large icon card */}
            <div className="flex items-center justify-center rounded-2xl bg-[#f6f3ec] p-10">
              <span className="text-8xl">{activeService.icon}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────── Trust Strip ───────────────────── */

function TrustStrip() {
  const stats = [
    { value: "12+", label: "Năm kinh nghiệm" },
    { value: "5000+", label: "Khách hàng hài lòng" },
    { value: "24/7", label: "Hỗ trợ mọi lúc" },
    { value: "100%", label: "Cam kết giá tốt" },
  ]
  return (
    <section className="border-b border-[#d9d4c9] bg-[#183024] py-14 text-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-8 px-6 sm:grid-cols-4 lg:px-12">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <span className="block font-display text-[clamp(2rem,4vw,3rem)] font-medium text-[#fed24f]">
              {stat.value}
            </span>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/65">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── FAQ ───────────────────────── */

type FaqItem = { question: string; answer: string }

const faqItems: FaqItem[] = [
  {
    question: "Tôi có thể đặt dịch vụ riêng lẻ hay phải mua kèm tour?",
    answer:
      "Bạn hoàn toàn có thể đặt từng dịch vụ riêng biệt — thuê xe, vé máy bay, phòng, visa — mà không cần mua tour. Tuy nhiên, khi đặt trọn gói kèm tour, bạn sẽ nhận được mức giá ưu đãi hơn.",
  },
  {
    question: "Làm sao để tôi biết giá cụ thể của từng dịch vụ?",
    answer:
      "Giá dịch vụ phụ thuộc vào thời điểm, số lượng người và yêu cầu cụ thể. Vui lòng liên hệ qua form 'Đặt hành trình' hoặc hotline để nhận báo giá chi tiết và nhanh nhất.",
  },
  {
    question: "Dịch vụ thuê xe có tài xế không?",
    answer:
      "Có. Tất cả xe thuê đều đi kèm tài xế người địa phương, am hiểu cung đường Tây Nguyên. Nếu bạn cần xe tự lái, chúng tôi cũng có lựa chọn phù hợp với điều kiện giấy phép hợp lệ.",
  },
  {
    question: "Có hỗ trợ đặt vé máy bay khứ hồi không?",
    answer:
      "Có. Chúng tôi săn vé khứ hồi nội địa và quốc tế với mức giá tốt nhất, đồng thời hỗ trợ đổi/hoàn vé theo chính sách của hãng hàng không.",
  },
]

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="border-b border-[#d9d4c9] bg-[#f6f3ec] py-20 lg:py-28">
      <div className="mx-auto max-w-[900px] px-6 lg:px-12">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#d56742]">
            <span className="h-px w-10 bg-[#d56742]" />
            Câu hỏi thường gặp
            <span className="h-px w-10 bg-[#d56742]" />
          </div>
          <h2 className="font-display text-[clamp(1.6rem,3.5vw,2.5rem)] font-medium leading-[1.15] tracking-[-0.03em] text-[#183024]">
            Bạn cần thêm thông tin?
          </h2>
        </div>

        <div className="divide-y divide-[#e0dcd2] rounded-2xl border border-[#e0dcd2] bg-white">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div key={item.question}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#d56742]"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="text-sm font-semibold text-[#183024]">
                    {item.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#e0dcd2] text-[#d56742] transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <span className="text-lg leading-none">+</span>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm leading-6 text-[#69746b]">
                    {item.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── CTA Section ─────────────────────── */

function CtaSection() {
  return (
    <section className="bg-[#f6f3ec] py-20 lg:py-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-3xl bg-[#183024] px-8 py-16 text-center text-white lg:px-16 lg:py-24">
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="mb-5 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f2b08e]">
              <Sparkle weight="fill" className="h-4 w-4" aria-hidden="true" />
              Sẵn sàng lên đường?
            </div>
            <h2 className="font-display text-[clamp(1.6rem,4vw,3rem)] font-medium leading-[1.15] tracking-[-0.03em]">
              Hãy để chúng tôi lo mọi thứ
            </h2>
            <p className="mt-5 text-base leading-7 text-white/70">
              Từ xe cộ, vé máy bay, phòng nghỉ đến visa — chỉ cần nói cho chúng
              tôi biết kế hoạch của bạn, phần còn lại để chúng tôi lo.
            </p>
            <a
              href="#contact"
              onClick={goToEnquiry}
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#fed24f] px-8 py-4 text-xs font-bold uppercase tracking-[0.14em] text-[#6f4e37] transition-all hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Đặt hành trình
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────── Page ─────────────────────── */

export default function ServicesPage() {
  return (
    <div className="pt-[78px]">
      <ServicesHero />
      <ServicesTabs />
      <TrustStrip />
      <FaqSection />
      <CtaSection />
    </div>
  )
}
