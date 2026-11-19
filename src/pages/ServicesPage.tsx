import { useEffect, useState } from "react"
import ServiceForm, { FORM_ID } from "@/components/services/ServiceForm"
import type { FormService } from "@/components/services/ServiceForm"
import { loadPublishedTourDetails } from "@/data/toursRepository"

type PickerKey = "car" | "visa" | "flight"
type ServiceFilterKey = "all" | "transport" | "documents" | "air"

type ServiceCard = {
  key: PickerKey
  filterKey: Exclude<ServiceFilterKey, "all">
  label: string
  eyebrow: string
  title: string
  summary: string
  perks: string
  tone: string
  eyebrowTone: string
}

const serviceCards: ServiceCard[] = [
  {
    key: "car",
    filterKey: "transport",
    label: "Thuê xe",
    eyebrow: "Di chuyển",
    title: "Thuê xe du lịch",
    summary: "Xe riêng, tài xế địa phương, lịch trình linh hoạt cho gia đình hoặc đoàn nhỏ.",
    perks: "Xe 4–45 chỗ · Đưa đón sân bay · Giá theo hành trình",
    tone: "bg-leaf",
    eyebrowTone: "text-forest",
  },
  {
    key: "visa",
    filterKey: "documents",
    label: "Visa",
    eyebrow: "Giấy tờ",
    title: "Tư vấn visa",
    summary: "Kiểm tra hồ sơ, nhắc lịch nộp và giấy tờ cần chuẩn bị cho chuyến đi nước ngoài.",
    perks: "Kiểm tra hồ sơ · Nhắc lịch nộp",
    tone: "bg-sky",
    eyebrowTone: "text-forest",
  },
  {
    key: "flight",
    filterKey: "air",
    label: "Vé máy bay",
    eyebrow: "Bay",
    title: "Vé máy bay",
    summary: "So sánh khung giờ, giữ vé theo thông tin bạn gửi. Nội địa và quốc tế.",
    perks: "Một chiều hoặc khứ hồi · Hỗ trợ đoàn",
    tone: "bg-blush",
    eyebrowTone: "text-lake",
  },
]

const serviceFilters: { key: ServiceFilterKey; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "transport", label: "Di chuyển" },
  { key: "documents", label: "Giấy tờ" },
  { key: "air", label: "Bay" },
]

function parseQuery(query: string): { key: FormService; tour: string } {
  const params = new URLSearchParams(query)
  const raw = params.get("service") ?? params.get("dichvu")
  let key: FormService = "car"
  if (raw === "visa") key = "visa"
  else if (raw === "flight" || raw === "ve-may-bay") key = "flight"
  else if (raw === "general") key = "general"
  return { key, tour: params.get("tour") ?? "" }
}

function scrollToForm() {
  document.getElementById(FORM_ID)?.scrollIntoView({ block: "start", behavior: "smooth" })
}

export default function ServicesPage({ query = "" }: { query?: string }) {
  const parsed = parseQuery(query)
  const [activeKey, setActiveKey] = useState<FormService>(parsed.key)
  const [activeFilter, setActiveFilter] = useState<ServiceFilterKey>("all")
  const [tourTitle, setTourTitle] = useState("")

  useEffect(() => {
    setActiveKey(parsed.key)
  }, [parsed.key])

  useEffect(() => {
    setTourTitle("")
    if (!parsed.tour) return
    let cancelled = false
    loadPublishedTourDetails(parsed.tour)
      .then((tour) => {
        if (!cancelled) setTourTitle(tour?.title ?? "")
      })
      .catch(() => {
        // Without the title the form simply opens with an empty details field.
      })
    return () => {
      cancelled = true
    }
  }, [parsed.tour])

  const choose = (key: PickerKey, scroll = false) => {
    setActiveKey(key)
    if (scroll) scrollToForm()
  }

  const visibleServiceCards =
    activeFilter === "all"
      ? serviceCards
      : serviceCards.filter((card) => card.filterKey === activeFilter)

  return (
    <div className="bg-air pb-24 pt-[104px] text-ink lg:pt-[128px]">
      <div className="page-container">
        <nav aria-label="Đường dẫn" className="text-[14px] leading-[21px] text-subtle">
          <a href="#/" className="hover:text-forest">Trang chủ</a>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">Dịch vụ khác</span>
        </nav>

        <h1 className="m-0 mt-[19px] text-[32px] font-semibold leading-[40px] tracking-[-0.02em] lg:text-[48px] lg:leading-[56px] lg:tracking-[-1px]">
          Dịch vụ khác
        </h1>
        <p className="m-0 mt-4 max-w-[680px] text-base leading-[26px] text-body">
          Ngoài tour, chúng tôi lo giúp xe, giấy tờ và chuyến bay. Chọn dịch vụ, điền một form, tư vấn viên liên hệ lại trong ngày.
        </p>

        <div role="group" aria-label="Lọc dịch vụ" className="mt-1 flex flex-wrap gap-2">
          {serviceFilters.map((filter) => {
            const selected = filter.key === activeFilter
            return (
              <button
                key={filter.key}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveFilter(filter.key)}
                className={`min-h-11 rounded-button px-5 text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
                  selected
                    ? "bg-forest text-paper"
                    : "border border-line bg-paper text-ink hover:border-forest"
                }`}
              >
                {filter.label}
              </button>
            )
          })}
        </div>

        <ul className="m-0 mt-0 grid list-none gap-4 p-0 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8">
          {visibleServiceCards.map((card) => {
            const selected = card.key === activeKey
            return (
              <li key={card.key} className="flex">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => choose(card.key, true)}
                  className={`relative flex w-full flex-col items-start rounded-panel border p-6 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 xl:h-[232px] xl:p-8 ${
                    selected ? "border-2 border-forest" : "border-line hover:border-forest"
                  } ${card.tone}`}
                >
                  {card.key === "flight" ? (
                    <span aria-hidden="true" className="absolute left-8 top-4 h-1 w-12 rounded-accent bg-coral" />
                  ) : null}
                  <span className={`text-[13px] font-bold leading-[19px] uppercase tracking-[0.8px] ${card.eyebrowTone}`}>
                    {selected ? "Đang chọn" : card.eyebrow}
                  </span>
                  <span className="mt-1 text-[24px] font-semibold leading-8 xl:text-[28px] xl:leading-[41px]">
                    {card.title}
                  </span>
                  <span className="mt-1 text-[15px] leading-6 text-body">{card.summary}</span>
                  <span className="mt-6 text-[14px] font-semibold leading-[21px] text-forest">
                    {card.perks}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-10 grid items-start gap-6 md:mt-12 xl:mt-16 xl:grid-cols-[minmax(0,1fr)_392px] xl:gap-8">
          <section
            id={FORM_ID}
            aria-labelledby="form-title"
            className="flex flex-col scroll-mt-28 rounded-form bg-paper p-6 md:p-8 xl:h-[1304px] xl:px-10 xl:pb-12 xl:pt-10"
          >
            <h2 id="form-title" className="m-0 text-[28px] font-semibold leading-9 tracking-[-0.01em] xl:text-[32px] xl:leading-[42px]">
              Gửi yêu cầu
            </h2>
            <p className="m-0 text-[15px] leading-[22px] text-subtle">
              Các mục có dấu * là bắt buộc. Không cần thanh toán trước.
            </p>

            <fieldset className="m-0 mt-6 border-0 p-0">
              <legend className="mb-2 p-0 text-[15px] font-semibold leading-[22px]">
                Dịch vụ <span aria-hidden="true">*</span>
              </legend>
              <div className="grid h-14 grid-cols-3 rounded-service-picker bg-sunlight p-1">
                {serviceCards.map((card) => {
                  const selected = card.key === activeKey
                  return (
                    <button
                      key={card.key}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => choose(card.key)}
                      className={`min-h-12 min-w-0 rounded-button px-1 text-[13px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-2 sm:text-base ${
                        selected
                          ? "bg-forest font-bold text-paper"
                          : "font-semibold text-ink hover:bg-paper"
                      }`}
                    >
                      {card.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="mt-8 flex flex-1 flex-col">
              <ServiceForm serviceKey={activeKey} tourSlug={parsed.tour} tourTitle={tourTitle} />
            </div>
          </section>

          <aside aria-label="Hỗ trợ nhanh" className="grid gap-6">
            <section className="rounded-form bg-sky p-6 md:p-8 xl:h-[440px]">
              <h2 className="m-0 text-[24px] font-semibold leading-8 xl:text-[28px] xl:leading-9">
                Cần gấp? Nói chuyện ngay.
              </h2>
              <p className="m-0 mt-5 text-[15px] leading-6 text-body">
                Đặt xe đón sân bay trong ngày hoặc hỏi nhanh về hồ sơ visa.
              </p>
              <div className="mt-9 grid gap-3">
                <a
                  href="https://zalo.me/02693760898"
                  className="btn-primary min-h-14 text-base"
                >
                  Nhắn Zalo
                </a>
                <a
                  href="tel:02693760898"
                  className="flex min-h-14 items-center justify-center gap-2 rounded-button bg-sunflower font-bold text-ink transition-colors hover:bg-sunflower/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Gọi 0269 376 0898
                </a>
              </div>
            </section>

            <section className="rounded-form bg-paper p-6 md:p-8 xl:min-h-[232px]">
              <h2 className="m-0 text-[18px] font-semibold leading-[27px]">Cam kết của chúng tôi</h2>
              <ul className="m-0 mt-4 grid list-none p-0 text-[15px] leading-[34px] text-body">
                {["Lịch trình, báo giá rõ ràng", "Liên hệ lại trong ngày", "Thông tin được bảo mật"].map((text) => (
                  <li key={text} className="flex min-h-[34px] items-center gap-2">
                    <span aria-hidden="true">✓</span>{text}
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
