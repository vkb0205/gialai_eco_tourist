import { ArrowRight } from "@phosphor-icons/react"
import festivalImage from "@/imports/photos/festival-cong-chieng-2026.webp"
import { navigateTo } from "@/lib/useHashRoute"

export default function CultureStory() {
  return (
    <section
      id="story"
      aria-labelledby="culture-title"
      className="page-container py-16 lg:py-24"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[680fr_520fr] lg:gap-20">
        <figure className="m-0">
          <img
            src={festivalImage}
            alt="Festival Cồng Chiêng Tây Nguyên năm 2026 tại Gia Lai"
            width={2835}
            height={1418}
            loading="lazy"
            decoding="async"
            className="aspect-[17/10] w-full rounded-photo object-cover shadow-card"
          />
        </figure>
        <div>
          <p className="t-eyebrow !text-clay">CÂU CHUYỆN CAO NGUYÊN</p>
          <h2
            id="culture-title"
            className="text-[28px] font-bold leading-[36px] text-ink lg:text-[32px] lg:leading-[42px]"
          >
            Cồng chiêng không phải để biểu diễn
          </h2>
          <p className="mt-5 text-base leading-[26px] text-body">
            Với người Ba Na và Jrai, tiếng chiêng mở đầu mùa rẫy, mừng lúa mới,
            tiễn người đi xa. UNESCO ghi danh Không gian văn hoá Cồng chiêng Tây
            Nguyên năm 2005.
          </p>
          <p className="mt-4 text-base leading-[26px] text-body">
            Chúng tôi chỉ đưa khách đến khi làng mời, và luôn hỏi trước khi chụp
            ảnh.
          </p>
          <a
            href="#/explore?theme=van-hoa"
            onClick={(event) => {
              event.preventDefault()
              navigateTo("/explore", "theme=van-hoa")
            }}
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-[15px] font-bold text-forest hover:text-forest-hover"
          >
            Đọc về làng Kon K'Tu, Plei Ốp{" "}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
