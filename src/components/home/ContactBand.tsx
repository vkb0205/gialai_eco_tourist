import { FORM_ID } from "@/components/services/ServiceForm"
import { navigateTo } from "@/lib/useHashRoute"

export default function ContactBand() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-sunlight py-16 lg:py-24"
    >
      <div className="page-container">
        <h2
          id="contact-title"
          className="max-w-[720px] text-[28px] font-bold leading-[36px] text-ink lg:text-[32px] lg:leading-[42px]"
        >
          Chưa biết chọn tour nào? Nói chuyện với người đã đi.
        </h2>
        <p className="mt-5 max-w-[600px] text-base leading-[26px] text-body">
          Gửi ngày đi và số người, chúng tôi gợi ý lịch trình và báo giá trong
          ngày. Không cần đặt cọc online.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href="https://zalo.me/02693760898"
            target="_blank"
            rel="noreferrer noopener"
            className="btn-primary min-h-14 min-w-[220px] justify-center"
          >
            Nhắn Zalo
          </a>
          <a
            href="tel:02693760898"
            className="btn-blue min-h-14 min-w-[260px] justify-center"
          >
            Gọi 0269 376 0898
          </a>
          <a
            href="#/services?service=general"
            onClick={(event) => {
              event.preventDefault()
              navigateTo("/services", "service=general", { scrollTo: FORM_ID })
            }}
            className="btn-outline min-h-14 min-w-[240px] justify-center bg-transparent"
          >
            Gửi yêu cầu tư vấn
          </a>
        </div>
      </div>
    </section>
  )
}
