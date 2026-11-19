import { useEffect, useId, useState } from "react"
import { ArrowLeft, ChatCircleDots, Phone } from "@phosphor-icons/react"
import { regionName } from "@/data/regions"
import {
  loadPublishedTourDetails,
  type TourDetails,
} from "@/data/toursRepository"
import TourEnquiry from "@/components/tour-detail/TourEnquiry"
import { FORM_ID } from "@/components/services/ServiceForm"
import { priceLabel } from "@/components/ui/TourCard"
import ContactDock from "@/components/ui/ContactDock"
import TourGallery from "@/lib/TourGallery"
import SectionTabs, { type SectionTab } from "@/components/tour-detail/SectionTabs"
import SummaryCard from "@/components/tour-detail/SummaryCard"
import Itinerary from "@/components/tour-detail/Itinerary"
import PriceBlock from "@/components/tour-detail/PriceBlock"
import PolicyAccordion, { type PolicyItem } from "@/components/tour-detail/PolicyAccordion"
import SimilarTours from "@/pages/SimilarToursStorage"
import { navigateTo } from "@/lib/useHashRoute"

const COLLAPSE_AT = 280

function mobileTitle(title: string) {
  return title
    .replace(/\s*\(\s*\d+\s*ngày[^)]*\)\s*$/i, "")
    .replace(/\s+\d+\s*ngày(?:\s*\d+\s*đêm)?\s*$/i, "")
    .replace(/[–—]/g, "·")
    .trim()
}

function ReadMore({
  text,
  mobileText,
}: {
  text: string
  mobileText?: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const long = text.length > COLLAPSE_AT

  return (
    <div>
      {mobileText ? (
        <>
          <p id={id} className={`m-0 hidden max-w-[68ch] whitespace-pre-line text-base leading-[26px] text-body md:block ${long && !open ? "line-clamp-4" : ""}`}>
            {text}
          </p>
          <p className={`m-0 max-w-[68ch] whitespace-pre-line text-base leading-[26px] text-body md:hidden ${mobileText.length > COLLAPSE_AT && !open ? "line-clamp-4" : ""}`}>
            {mobileText}
          </p>
        </>
      ) : (
        <p
          id={id}
          className={`m-0 max-w-[68ch] whitespace-pre-line text-base leading-[26px] text-body md:leading-[26px] ${long && !open ? "line-clamp-4" : ""}`}
        >
          {text}
        </p>
      )}
      {long && (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={id}
          className={`mt-2 inline-flex min-h-11 items-center font-bold text-forest underline underline-offset-4 ${mobileText ? "hidden md:inline-flex" : ""}`}
        >
          {open ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    </div>
  )
}

function Section({
  id,
  eyebrow,
  title,
  mobileTitle,
  tone = "forest",
  mobileTitleOnly = false,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  mobileTitle?: string
  tone?: "forest" | "lake" | "clay"
  mobileTitleOnly?: boolean
  children: React.ReactNode
}) {
  const toneClass =
    tone === "lake" ? "text-lake" : tone === "clay" ? "text-clay" : "text-forest"

  return (
    <section id={id} aria-labelledby={`${id}-title`} aria-label={mobileTitleOnly ? title : undefined} className={`scroll-mt-40 ${mobileTitleOnly ? "mt-2 md:mt-0" : ""}`}>
      <p className={`mb-2 hidden text-[13px] font-bold uppercase leading-[19px] tracking-[0.8px] md:block ${toneClass}`}>
        {eyebrow}
      </p>
      <h2
        id={`${id}-title`}
        className={`m-0 font-display text-[26px] font-bold leading-9 text-ink md:text-[32px] md:leading-10 ${mobileTitleOnly ? "md:hidden" : ""}`}
      >
        {mobileTitle ? (
          <>
            <span className="hidden md:inline">{title}</span>
            <span className="md:hidden">{mobileTitle}</span>
          </>
        ) : title}
      </h2>
      <div className={id === "gioi-thieu" ? "mt-4 md:mt-3" : id === "bao-gom" || id === "chinh-sach" ? "mt-5 md:mt-6" : "mt-6 md:mt-6"}>
        {children}
      </div>
    </section>
  )
}

function Highlights({ items }: { items: string[] }) {
  if (items.length === 0) return null

  return (
    <ul className="m-0 hidden list-none grid-cols-2 gap-x-6 gap-y-4 p-0 md:grid">
      {items.slice(0, 4).map((item) => (
        <li key={item} className="flex min-h-14 items-center gap-3 rounded-photo bg-paper px-4 py-3 text-[15px] font-semibold leading-[22px] text-ink">
          <span aria-hidden="true" className="size-4 shrink-0 rounded-full bg-forest" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function MobilePrice({ tour }: { tour: TourDetails }) {
  return (
    <section aria-label="Giá tour" className="rounded-card bg-sunlight px-4 pb-3 pt-4 xl:hidden">
      <p className="m-0 font-display text-[24px] font-bold leading-9 text-ink">
        {priceLabel(tour)}
      </p>
      <p className="m-0 mt-1 text-[13px] leading-[22px] text-body">
        Giá chốt theo ngày đi và số người.
        <br />
        Nhắn Zalo để nhận lịch trình và báo giá.
      </p>
    </section>
  )
}

function ContactActions({ slug }: { slug: string }) {
  const enquiryQuery = `service=general&tour=${encodeURIComponent(slug)}`

  return (
    <section aria-labelledby="tour-contact-title" className="rounded-card bg-leaf p-6">
      <h2 id="tour-contact-title" className="m-0 text-[18px] font-bold leading-7 text-ink">
        Liên hệ đặt tour
      </h2>
      <div className="mt-4 grid gap-3">
        <a
          href="https://zalo.me/02693760898"
          target="_blank"
          rel="noreferrer noopener"
          className="flex min-h-12 items-center justify-center gap-2 rounded-button bg-forest px-4 text-sm font-bold text-paper hover:bg-forest-hover"
        >
          <ChatCircleDots size={19} aria-hidden="true" />
          Nhắn Zalo xin lịch
        </a>
        <a
          href="tel:02693760898"
          className="flex min-h-12 items-center justify-center gap-2 rounded-button bg-sunflower px-4 text-sm font-bold text-ink hover:brightness-95"
        >
          <Phone size={19} aria-hidden="true" />
          Gọi 0269 376 0898
        </a>
        <a
          href={`#/services?${enquiryQuery}`}
          onClick={(event) => {
            event.preventDefault()
            navigateTo("/services", enquiryQuery, { scrollTo: FORM_ID })
          }}
          className="flex min-h-12 items-center justify-center rounded-button bg-paper px-4 text-sm font-bold text-ink hover:bg-air"
        >
          Gửi yêu cầu tư vấn
        </a>
      </div>
    </section>
  )
}

function TourFAQ() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-40 rounded-card bg-sunlight p-5 md:p-6">
      <h2 id="faq-title" className="m-0 font-display text-[20px] font-bold leading-7 text-ink">
        <span className="hidden md:inline">Câu hỏi thường gặp</span>
        <span className="md:hidden">Cần biết trước khi đi</span>
      </h2>
      <div className="mt-4">
        <h3 className="m-0 text-sm font-bold leading-5 text-ink">
          <span className="hidden md:inline">Có phải thanh toán online?</span>
          <span className="md:hidden">Có cần thanh toán trực tuyến?</span>
        </h3>
        <p className="m-0 mt-2 text-[13px] leading-[20px] text-body">
          <span className="hidden md:inline">Bạn trao đổi lịch trình và nhận báo giá qua Zalo, điện thoại hoặc biểu mẫu.</span>
          <span className="md:hidden">Không. Tư vấn viên gửi báo giá và hướng dẫn xác nhận trực tiếp qua Zalo hoặc điện thoại.</span>
        </p>
      </div>
      <div className="mt-4 hidden md:block">
        <h3 className="m-0 text-sm font-bold leading-5 text-ink">Có thể đi nhóm riêng?</h3>
        <p className="m-0 mt-2 text-[13px] leading-[20px] text-body">Có. Gửi số người, ngày dự kiến và nhu cầu; chúng tôi tư vấn hành trình phù hợp.</p>
      </div>
      <div className="mt-4 hidden md:block">
        <h3 className="m-0 text-sm font-bold leading-5 text-ink">Lịch giao lưu cồng chiêng?</h3>
        <p className="m-0 mt-2 text-[13px] leading-[20px] text-body">Xác nhận theo lịch đón khách của làng.</p>
      </div>
    </section>
  )
}

function DesktopContactDock() {
  return (
    <aside aria-label="Liên hệ nhanh" className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
      <a href="https://zalo.me/02693760898" target="_blank" rel="noreferrer noopener" className="flex min-h-11 min-w-16 items-center justify-center rounded-button bg-forest px-4 text-sm font-bold text-paper shadow-card hover:bg-forest-hover">
        Zalo
      </a>
      <a href="tel:02693760898" className="flex min-h-11 min-w-16 items-center justify-center rounded-button bg-sunflower px-4 text-sm font-bold text-ink shadow-card hover:brightness-95">
        Gọi
      </a>
    </aside>
  )
}

function TourDetailsContent({ tour }: { tour: TourDetails }) {
  const region = regionName(tour.regionSlug)
  const title = mobileTitle(tour.title)
  const images = tour.galleryImages.length
    ? tour.galleryImages
    : [{ src: null, slug: tour.slug, alt: title }]

  const policies: PolicyItem[] = [
    { title: "Huỷ và đổi ngày", body: tour.cancellationPolicy ?? "" },
    { title: "Trẻ em và người lớn tuổi", body: tour.childPolicy ?? "" },
    { title: "Phụ thu", body: tour.surchargePolicy ?? "" },
    { title: "Lưu trú", body: tour.accommodationNotes ?? "" },
    { title: "Di chuyển", body: tour.transportNotes ?? "" },
  ].filter((policy) => policy.body.trim())

  const hasItinerary = tour.itinerary.length > 0
  const hasOverview = Boolean(tour.blurb.trim() || tour.highlights.length > 0)
  const desktopTabs: SectionTab[] = [
    ...(hasOverview ? [{ id: "gioi-thieu", label: "Tổng quan" }] : []),
    ...(hasItinerary ? [{ id: "lich-trinh", label: "Lịch trình" }] : []),
    ...(tour.inclusions.length > 0 || tour.exclusions.length > 0
      ? [{ id: "bao-gom", label: "Bao gồm & không" }]
      : []),
    ...(policies.length > 0 ? [{ id: "chinh-sach", label: "Lưu ý & chính sách" }] : []),
    { id: "faq", label: "Câu hỏi thường gặp" },
  ]
  const mobileTabs = desktopTabs
    .filter((tab) => ["gioi-thieu", "lich-trinh", "chinh-sach"].includes(tab.id))
    .map((tab) => tab.id === "chinh-sach" ? { ...tab, label: "Chính sách" } : tab)
  const groupMeta = tour.groupLabel
    ? tour.groupMax
      ? `${tour.groupLabel} tối đa ${tour.groupMax} khách`
      : tour.groupLabel
    : tour.groupMax
      ? `Tối đa ${tour.groupMax} khách`
      : null
  const mobilePrimaryMeta = [
    tour.durationLabel.replace(" · ", " "),
    tour.departureText ? `Khởi hành ${tour.departureText}` : null,
  ].filter(Boolean)
  const desktopMeta = [groupMeta, tour.departureText ? `Khởi hành ${tour.departureText}` : null]
    .filter(Boolean)
  if (desktopMeta.length === 0) desktopMeta.push(tour.durationLabel)
  const mobileSecondaryMeta = [groupMeta].filter(Boolean)

  return (
    <>
      <article className="mx-auto max-w-[1280px] px-4 pb-20 pt-24 md:px-8 md:pb-24 md:pt-[120px] xl:px-0">
        <header>
          <nav aria-label="Breadcrumb" className="text-xs font-medium leading-[18px] text-subtle md:text-sm md:leading-[21px]">
            <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 p-0">
              <li className="hidden md:block">
                <a href="#/" className="inline-flex min-h-6 items-center hover:underline">Trang chủ</a>
              </li>
              <li aria-hidden="true" className="hidden md:block">/</li>
              <li><a href="#/explore" className="inline-flex min-h-6 items-center hover:underline">Khám phá tour</a></li>
              <li aria-hidden="true" className="md:hidden">/</li>
              <li aria-current="page">{region}</li>
            </ol>
          </nav>
          <h1 className="m-0 mt-3.5 font-display text-[30px] font-bold leading-[40px] text-ink md:mt-3 md:text-[48px] md:leading-[56px]">
            <span className="hidden md:inline">{tour.title}</span>
            <span className="md:hidden">{title}</span>
          </h1>
          <p className="m-0 mt-4 text-sm leading-6 text-body md:mt-4 md:text-base">
            <span className="hidden md:inline">{desktopMeta.join("  ·  ")}</span>
            <span className="md:hidden">{mobilePrimaryMeta.join("  ·  ")}</span>
            {mobileSecondaryMeta.length > 0 && <><br className="md:hidden" /><span className="md:hidden">{mobileSecondaryMeta.join("  ·  ")}</span></>}
          </p>
        </header>

        {images.length > 0 && (
          <div className="mt-6 md:mt-8">
            <TourGallery images={images} destinations={tour.destinations} />
          </div>
        )}

        <div className="mt-7 xl:hidden">
          <MobilePrice tour={tour} />
        </div>

        <div className="mt-8 grid gap-10 xl:mt-10 xl:grid-cols-[minmax(0,1.905fr)_minmax(0,1fr)] xl:gap-12">
          <div className="min-w-0">
            {desktopTabs.length > 0 && <SectionTabs tabs={desktopTabs} mobileTabs={mobileTabs} />}

            <div className={`${desktopTabs.length > 0 ? "mt-10 md:mt-12" : ""} grid gap-10 md:gap-16`}>
              {hasOverview && (
              <Section
                id="gioi-thieu"
                eyebrow="Tổng quan"
                title={tour.slug === "pleiku-kon-tum-mang-den-3n2d-ghep-doan" ? "Ba ngày đi từ phố núi Pleiku lên rừng thông Măng Đen" : title}
                mobileTitle={tour.slug === "pleiku-kon-tum-mang-den-3n2d-ghep-doan" ? "Ba ngày giữa phố núi và rừng thông" : undefined}
              >
                <ReadMore
                  text={tour.blurb}
                  mobileText={tour.slug === "pleiku-kon-tum-mang-den-3n2d-ghep-doan" ? "Sáng ngắm Biển Hồ, trưa ăn cơm lam ở Kon Tum, tối nghỉ giữa rừng thông Măng Đen. Đi chậm để có thời gian trò chuyện cùng người làng." : undefined}
                />
                <div className="mt-11">
                  <Highlights items={tour.highlights} />
                </div>
              </Section>
              )}

              {hasItinerary && (
                <Section id="lich-trinh" eyebrow="Lịch trình" title="Từng ngày, từng chặng" mobileTitle="Lịch trình từng ngày" tone="lake">
                  <Itinerary days={tour.itinerary} />
                </Section>
              )}

              {(tour.inclusions.length > 0 || tour.exclusions.length > 0) && (
                <Section id="bao-gom" eyebrow="Bao gồm & không bao gồm" title="Bao gồm trong giá" tone="clay" mobileTitleOnly>
                  <PriceBlock tour={tour} />
                </Section>
              )}

              {policies.length > 0 && (
                <Section id="chinh-sach" eyebrow="Lưu ý & chính sách" title="Lưu ý & chính sách" tone="clay" mobileTitleOnly>
                  <PolicyAccordion items={policies} />
                </Section>
              )}
            </div>
          </div>

          <aside aria-label="Thông tin và hỗ trợ tour" className="grid content-start gap-5">
            <SummaryCard tour={tour} />
            <div className="hidden xl:block"><ContactActions slug={tour.slug} /></div>
            <div className="order-2 xl:order-3"><TourFAQ /></div>
            <div className="order-3 xl:order-2"><TourEnquiry slug={tour.slug} /></div>
          </aside>
        </div>

        <SimilarTours tour={tour} region={region} />
      </article>
      <DesktopContactDock />
    </>
  )
}

export default function TourDetailsPage({ query }: { query: string }) {
  const slug = new URLSearchParams(query).get("slug")?.trim() ?? ""
  const [tour, setTour] = useState<TourDetails | null>(null)
  const [loading, setLoading] = useState(Boolean(slug))
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)
    loadPublishedTourDetails(slug)
      .then((nextTour) => {
        if (!active) return
        setTour(nextTour)
        setError(false)
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug])

  if (!slug || (!loading && !tour && !error)) {
    return (
      <section className="bg-air px-4 py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base text-subtle">Không tìm thấy hành trình này.</p>
          <button type="button" onClick={() => navigateTo("/explore")} className="btn-primary mt-6">
            <ArrowLeft size={18} aria-hidden="true" />
            Về danh mục
          </button>
        </div>
      </section>
    )
  }

  return (
    <div className="tour-detail bg-air">
      {loading ? (
        <div className="mx-auto min-h-[70vh] max-w-[1280px] px-4 pt-24 md:px-8 md:pt-[120px] xl:px-0" role="status" aria-label="Đang tải hành trình">
          <div className="h-12 w-2/3 animate-pulse rounded-field bg-leaf" />
          <div className="mt-6 aspect-[16/8] animate-pulse rounded-panel bg-leaf" />
        </div>
      ) : error || !tour ? (
        <div className="min-h-[70vh] bg-air px-4 pt-24 md:pt-[120px]">
          <div role="alert" className="mx-auto max-w-2xl rounded-panel bg-paper px-6 py-14 text-center shadow-card">
            <p className="text-base text-subtle">Không thể tải nội dung hành trình lúc này.</p>
            <button type="button" onClick={() => navigateTo("/explore")} className="btn-primary mt-6">
              Về danh mục
            </button>
          </div>
        </div>
      ) : (
        <TourDetailsContent key={tour.slug} tour={tour} />
      )}
      {tour && !loading && !error && <ContactDock variant="tour" tourSlug={tour.slug} />}
    </div>
  )
}
