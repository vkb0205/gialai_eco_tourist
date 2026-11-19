import { useState } from "react"
import type { FormEvent } from "react"
import { ArrowRight, CaretDown } from "@phosphor-icons/react"
import heroImage from "@/imports/photos/bien-ho-aerial.webp"
import { navigateTo } from "@/lib/useHashRoute"

const regionOptions = [
  { value: "tay-nguyen", label: "Tây Nguyên" },
  { value: "mien-bac", label: "Miền Bắc" },
  { value: "mien-trung", label: "Miền Trung" },
  { value: "mien-nam", label: "Miền Nam" },
]
const themeOptions = [
  { value: "thien-nhien", label: "Thiên nhiên" },
  { value: "van-hoa", label: "Văn hoá" },
  { value: "trekking", label: "Trekking" },
  { value: "phieu-luu", label: "Phiêu lưu" },
  { value: "am-thuc", label: "Ẩm thực" },
  { value: "bien-dao", label: "Biển đảo" },
]
const durationOptions = [
  { value: "1", label: "1 ngày" },
  { value: "2-3", label: "2 – 3 ngày" },
  { value: "4+", label: "4 ngày trở lên" },
]

function SearchSelect({
  label,
  name,
  value,
  onChange,
  anyLabel,
  options,
}: {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  anyLabel: string
  options: { value: string; label: string }[]
}) {
  return (
    <label className="relative block min-h-11 flex-1 px-1 lg:px-8">
      <span className="block t-caption font-bold uppercase tracking-wider text-subtle">
        {label}
      </span>
      <select
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 min-h-11 w-full appearance-none bg-transparent pr-6 text-base font-bold text-ink"
      >
        <option value="">{anyLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <CaretDown
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-4 right-1 text-ink lg:right-8"
      />
    </label>
  )
}

export default function HomeHero() {
  const [region, setRegion] = useState("")
  const [theme, setTheme] = useState("")
  const [duration, setDuration] = useState("")

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (region) params.set("vung", region)
    if (theme) params.set("theme", theme)
    if (duration) params.set("duration", duration)
    navigateTo("/explore", params.toString())
  }

  return (
    <section id="home" className="relative bg-hero pt-[72px] xl:pt-[88px]">
      <div className="absolute inset-y-0 right-0 hidden w-[55%] lg:block">
        <img
          src={heroImage}
          alt="Biển Hồ nhìn từ trên cao, mặt nước xanh thẫm ôm lấy dải đất phủ thông"
          width={1600}
          height={900}
          decoding="async"
          className="h-full w-full object-cover"
        />
        <p className="absolute bottom-40 right-20 rounded-photo bg-paper px-4 py-2 t-caption text-ink">
          Biển Hồ, Pleiku
        </p>
      </div>

      <div className="page-container relative py-12 lg:pb-44 lg:pt-24">
        <div className="hero-copy max-w-[760px]">
          <p className="t-eyebrow !text-clay">HÀNH TRÌNH KHẮP VIỆT NAM</p>
          <h1 className="t-h1 text-ink">
            Khám phá Việt Nam qua những hành trình đáng nhớ
          </h1>
          <p className="t-lead mt-5 max-w-[560px] text-body">
            Từ núi rừng phía Bắc, di sản miền Trung đến miền sông nước, biển đảo
            phương Nam và Tây Nguyên, mỗi chuyến đi mở ra một sắc màu Việt Nam.
            Chúng tôi giúp bạn chọn hành trình phù hợp và chuẩn bị mọi điều cần thiết.
          </p>
          <div className="home-hero-actions mt-8 flex flex-wrap gap-3">
            <a
              href="#/explore"
              onClick={(event) => {
                event.preventDefault()
                navigateTo("/explore")
              }}
              className="btn-primary"
            >
              Khám phá tour <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a
              href="https://zalo.me/02693760898"
              target="_blank"
              rel="noreferrer noopener"
              className="btn-outline bg-paper/80"
            >
              Nhắn Zalo tư vấn
            </a>
          </div>
        </div>

        <figure className="m-0 mt-8 lg:hidden">
          <img
            src={heroImage}
            alt="Biển Hồ nhìn từ trên cao, mặt nước xanh thẫm ôm lấy dải đất phủ thông"
            width={1600}
            height={900}
            decoding="async"
            className="aspect-[2/1] w-full rounded-photo object-cover"
          />
        </figure>

        <form
          onSubmit={submit}
          aria-label="Tìm hành trình"
          className="mt-6 flex flex-col gap-4 rounded-panel bg-paper p-5 shadow-search lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:translate-y-1/2 lg:flex-row lg:items-center lg:gap-0 lg:p-6"
        >
          <SearchSelect
            label="Điểm đến"
            name="vung"
            value={region}
            onChange={setRegion}
            anyLabel="Tất cả vùng"
            options={regionOptions}
          />
          <span aria-hidden="true" className="hidden h-14 w-px bg-line lg:block" />
          <SearchSelect
            label="Chủ đề"
            name="theme"
            value={theme}
            onChange={setTheme}
            anyLabel="Mọi chủ đề"
            options={themeOptions}
          />
          <span aria-hidden="true" className="hidden h-14 w-px bg-line lg:block" />
          <SearchSelect
            label="Thời lượng"
            name="duration"
            value={duration}
            onChange={setDuration}
            anyLabel="Mọi thời lượng"
            options={durationOptions}
          />
          <button type="submit" className="home-search-submit btn-primary lg:ml-8 lg:w-64">
            Tìm hành trình
          </button>
        </form>
      </div>
    </section>
  )
}
