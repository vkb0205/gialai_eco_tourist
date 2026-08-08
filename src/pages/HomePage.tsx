import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Leaf,
  Play,
  ShieldCheck,
  Users,
} from "@phosphor-icons/react"
import img0 from "@/imports/image.jpeg"
import img1 from "@/imports/image-1.png"
import img2 from "@/imports/image-2.png"
import { goToEnquiry } from "@/components/layout/Navigation"
import { navigateTo } from "@/lib/useHashRoute"

type Experience = {
  id: number
  category: string
  title: string
  description: string
  duration: string
  price: string
  image: string
  featured?: boolean
}

const experiences: Experience[] = [
  {
    id: 1,
    category: "Trekking",
    title: "Qua tầng rừng Kon Ka Kinh",
    description:
      "Băng qua rừng nguyên sinh, nghe tiếng suối và ngủ giữa một trong những hệ sinh thái giàu nhất Tây Nguyên.",
    duration: "3 ngày · 2 đêm",
    price: "2.400.000đ",
    image: img1,
    featured: true,
  },
  {
    id: 2,
    category: "Văn hóa",
    title: "Một đêm ở làng Bahnar",
    description:
      "Bữa cơm bên bếp lửa, tiếng cồng chiêng và một nhịp sống không cần vội vàng.",
    duration: "2 ngày · 1 đêm",
    price: "1.850.000đ",
    image:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 3,
    category: "Thiên nhiên",
    title: "Bình minh trên Biển Hồ",
    description:
      "Đạp xe qua những đồi chè, ngắm mặt hồ đổi màu và thưởng thức cà phê rang tại chỗ.",
    duration: "1 ngày",
    price: "980.000đ",
    image: img0,
  },
  {
    id: 4,
    category: "Phiêu lưu",
    title: "Dòng thác Kon Chư Răng",
    description:
      "Cung đường dành cho người thích thử thách: vượt suối, đi sâu vào rừng và chạm đến thác K50.",
    duration: "4 ngày · 3 đêm",
    price: "3.600.000đ",
    image:
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=85",
  },
]

const destinations = [
  {
    index: "01",
    name: "Biển Hồ",
    caption: "Mặt nước trong miệng núi lửa",
    image: img0,
  },
  {
    index: "02",
    name: "Kon Ka Kinh",
    caption: "Rừng già và những tầng mây",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85",
  },
  {
    index: "03",
    name: "Làng Bahnar",
    caption: "Văn hóa sống bên bếp lửa",
    image: img2,
  },
  {
    index: "04",
    name: "Kon Chư Răng",
    caption: "Thác nước giữa đại ngàn",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
  },
]

const galleryImages = [
  { src: img1, alt: "Đường mòn xuyên rừng", className: "md:row-span-2" },
  { src: img0, alt: "Biển Hồ lúc bình minh", className: "" },
  {
    src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1100&q=85",
    alt: "Bữa cơm bên hiên nhà",
    className: "",
  },
  { src: img2, alt: "Gương mặt người Tây Nguyên", className: "md:col-span-2" },
]

function Hero() {
  return (
    <section
      id="home"
      className="relative isolate min-h-[760px] overflow-hidden bg-[#183024] text-white lg:min-h-[860px]"
    >
      {/* Photographic band with the Explore header's layered forest scrim. */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={img0}
          alt="Phong cảnh xanh của Gia Lai"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,31,23,0.0)_0%,rgba(15,42,30,0.13)_0%,rgba(15,42,30,0.13)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,26,19,0)_0%,transparent_45%,rgba(8,26,19,0.25)_100%)]" /> */}
      </div>

      {/* Film-grain overlay, matching the Explore header. */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-noise opacity-[0.035] mix-blend-overlay" />

      <div className="relative z-20 mx-auto flex min-h-[760px] max-w-[1440px] flex-col justify-between px-6 pb-14 pt-32 lg:min-h-[860px] lg:px-12 lg:pb-20">
        <div className="grid items-end gap-14 lg:grid-cols-[minmax(0,760px)_1fr]">
          <div>
            {/* <div className="mb-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f2b08e]">
              <span className="h-px w-10 bg-[#f2b08e]" />
              Tây Nguyên · Việt Nam
            </div> */}
            <h1 className="translate-y-7 max-w-5xl font-display font-medium tracking-[-0.075em]">
              <span className="block text-[clamp(2.4rem,7vw,5rem)] leading-[1.05]">
                Vi vu muôn phương
              </span>
              <span className="block whitespace-nowrap text-[#fef2a0] text-[clamp(2.4rem,7vw,6rem)] leading-[1.05]">
                Chạm ngàn cung đường
              </span>
            </h1>
            <p className="mt-16 w-full whitespace-nowrap lg:max-w-[50%] text-base leading-7 text-white/75 lg:text-lg">
              Từ phố thị đến biển xanh nắng vàng và cao nguyên rộng mở,
              <br />
              mỗi chuyến đi đều là một trải nghiệm mới đầy cảm hứng.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#/explore"
                onClick={(event) => {
                  event.preventDefault()
                  navigateTo("/explore")
                }}
                className="group inline-flex items-center gap-3 rounded-full bg-[#fed24f] px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-[#6f4e37] transition-all hover:-translate-y-1 hover:bg-[#fed24f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Xem hành trình{" "}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
              <a
                href="#story"
                className="group inline-flex items-center gap-3 px-3 py-4 text-xs font-bold uppercase tracking-[0.12em] text-white/85 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35">
                  <Play
                    weight="fill"
                    className="ml-0.5 h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                </span>
                Câu chuyện của chúng tôi
              </a>
            </div>
          </div>

          {/* <div className="hidden justify-self-end lg:block">
            <div className="mb-7 flex items-center justify-end gap-3 text-right text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
              <span>13°58&apos;N · 108°00&apos;E</span>
              <span className="h-px w-10 bg-white/40" />
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-[#e0dcd2] bg-white shadow-[0_18px_40px_rgba(10,25,17,0.18)]">
              <div className="min-w-[120px] bg-white px-6 py-5">
                <span className="font-display text-4xl text-[#d56742]">12</span>
                <p className="mt-2 max-w-[90px] text-[10px] uppercase leading-4 tracking-[0.13em] text-[#69746b]">
                  năm dẫn lối
                </p>
              </div>
              <div className="min-w-[120px] bg-white px-6 py-5">
                <span className="font-display text-4xl text-[#d56742]">26</span>
                <p className="mt-2 max-w-[90px] text-[10px] uppercase leading-4 tracking-[0.13em] text-[#69746b]">
                  cung đường
                </p>
              </div>
              <div className="min-w-[120px] border-t border-[#e0dcd2] bg-white px-6 py-5">
                <span className="font-display text-4xl text-[#d56742]">8</span>
                <p className="mt-2 max-w-[90px] text-[10px] uppercase leading-4 tracking-[0.13em] text-[#69746b]">
                  vùng miền
                </p>
              </div>
              <div className="min-w-[120px] border-l border-t border-[#e0dcd2] bg-white px-6 py-5">
                <span className="font-display text-4xl text-[#d56742]">12</span>
                <p className="mt-2 max-w-[90px] text-[10px] uppercase leading-4 tracking-[0.13em] text-[#69746b]">
                  người tối đa
                </p>
              </div>
            </div>
          </div> */}
        </div>

        <div className="flex items-end justify-between border-t border-white/20 pt-5">
          {/* <span className="text-[20px] font-bold uppercase tracking-[0.25em] text-white/60">
            Gialai Eco Tourist
          </span> */}
          <a
            href="#story"
            className="group flex items-center gap-3 text-[17px] font-bold uppercase tracking-[0.2em] text-white/75 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Khám phá tiếp <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}

function IntroStrip() {
  return (
    <section className="border-b border-[#d9d4c9] bg-[#f6f3ec]">
      <div className="mx-auto grid max-w-[1440px] divide-y divide-[#d9d4c9] px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-12">
        {[
          {
            value: "01",
            title: "Nhóm nhỏ",
            text: "Tối đa 12 người mỗi chuyến",
          },
          {
            value: "02",
            title: "Người địa phương",
            text: "Dẫn lối bởi người hiểu đất",
          },
          { value: "03", title: "Dấu chân nhẹ", text: "Du lịch để gìn giữ" },
        ].map((item) => (
          <div
            key={item.value}
            className="flex items-center gap-5 py-6 first:sm:pl-0 last:sm:pr-0 sm:px-8 sm:py-8"
          >
            <span className="font-display text-2xl text-[#d56742]">
              {item.value}
            </span>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#183024]">
                {item.title}
              </h2>
              <p className="mt-1 text-xs text-[#69746b]">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Story() {
  return (
    <section id="story" className="bg-[#f6f3ec] px-6 py-24 lg:px-12 lg:py-36">
      <div className="mx-auto grid max-w-[1240px] items-center gap-16 lg:grid-cols-[0.9fr_1fr] lg:gap-28">
        <div className="relative pl-5 pt-5 lg:pl-8 lg:pt-8">
          <div className="absolute left-0 top-0 h-[82%] w-[82%] border border-[#d56742]/50" />
          <div className="relative overflow-hidden rounded-[2px] bg-[#d9d4c9]">
            <img
              src={img1}
              alt="Người dân địa phương trên con đường rừng"
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between border-t border-white/30 pt-4 text-white">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em]">
                Gia Lai / Việt Nam
              </span>
              <span className="font-display text-2xl italic">03°</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-5 hidden rounded-full bg-[#d56742] px-7 py-7 text-center text-white shadow-xl sm:block">
            <span className="block font-display text-3xl leading-none">
              14+
            </span>
            <span className="mt-2 block text-[9px] font-bold uppercase tracking-[0.15em]">
              năm bền bỉ
            </span>
          </div>
        </div>

        <div>
          <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#d56742]">
            <span className="h-px w-10 bg-[#d56742]" />
            Câu chuyện
          </div>
          <h2 className="max-w-xl font-display text-5xl font-medium leading-[0.98] tracking-[-0.06em] text-[#183024] sm:text-6xl">
            Không chỉ đi qua.
            <br />
            <em className="text-[#61703f]">Mà thuộc về nơi này.</em>
          </h2>
          <div className="mt-8 max-w-lg space-y-5 text-[15px] leading-7 text-[#55605a]">
            <p>
              Gialai Eco Tourist được bắt đầu từ một câu hỏi đơn giản: làm sao
              để mỗi lần du khách đặt chân đến Tây Nguyên, nơi này nhận lại
              nhiều hơn những gì đã trao đi?
            </p>
            <p>
              Vì vậy, chúng tôi đi cùng những người địa phương. Chọn những cung
              đường ít người biết. Giữ nhóm nhỏ. Và để thiên nhiên, văn hóa, con
              người kể câu chuyện của chính mình.
            </p>
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <span className="rounded-full border border-[#c8cfc3] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#42524a]">
              Đối tác cộng đồng
            </span>
            <span className="rounded-full border border-[#c8cfc3] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#42524a]">
              Du lịch có trách nhiệm
            </span>
            <span className="rounded-full border border-[#c8cfc3] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#42524a]">
              Được cấp phép
            </span>
          </div>
          <a
            href="#contact"
            onClick={goToEnquiry}
            className="group mt-10 inline-flex items-center gap-3 border-b border-[#183024] pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#183024] transition-colors hover:border-[#d56742] hover:text-[#b4502f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742]"
          >
            Đọc câu chuyện đầy đủ{" "}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-[2px] bg-white ${
        experience.featured ? "md:col-span-2 lg:col-span-1" : ""
      }`}
    >
      <div className="relative overflow-hidden">
        <img
          src={experience.image}
          alt={experience.title}
          loading="lazy"
          className="aspect-[1.3/1] w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10261a]/75 via-transparent to-transparent opacity-80" />
        <span className="absolute bottom-5 left-5 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
          {experience.duration}
        </span>
      </div>
      <div className="flex flex-1 flex-col border border-t-0 border-[#e5e1d8] p-6">
        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#69746b]">
          {experience.category}
        </span>
        <h3 className="mt-2 font-display text-2xl leading-tight tracking-[-0.04em] text-[#183024]">
          {experience.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-[#69746b]">
          {experience.description}
        </p>
        <div className="mt-7 flex items-end justify-between border-t border-[#e5e1d8] pt-4">
          <div>
            <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-[#7f887f]">
              Giá từ
            </span>
            <strong className="mt-1 block text-sm text-[#b4502f]">
              {experience.price}
            </strong>
          </div>
          <a
            href="#contact"
            onClick={goToEnquiry}
            className="group/link flex items-center gap-2 rounded-full bg-[#183024] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#6f4e37] transition-colors hover:bg-[#b4502f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742]"
          >
            <span className="text-[white]">Đặt hành trình</span>
            <ArrowUpRight
              className="h-4 w-4 text-[#6f4e37] transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
              aria-hidden="true"
            />
          </a>

        </div>
      </div>
    </article>
  )
}

function Experiences() {
  const filters = ["Tất cả", "Trekking", "Văn hóa", "Thiên nhiên", "Phiêu lưu"]
  const [activeFilter, setActiveFilter] = useState("Tất cả")
  const visibleExperiences =
    activeFilter === "Tất cả"
      ? experiences
      : experiences.filter((experience) => experience.category === activeFilter)

  return (
    <section
      id="experiences"
      className="bg-[#e9e6dd] px-6 py-24 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#b4502f]">
              <span className="h-px w-10 bg-[#b4502f]" />
              Hành trình nổi bật
            </div>
            <h2 className="max-w-2xl font-display text-5xl font-medium leading-[0.95] tracking-[-0.06em] text-[#183024] sm:text-6xl">
              Đi theo cách
              <br />
              <em className="text-[#61703f]">của riêng bạn.</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-[#69746b]">
            Từ một buổi sớm bên mặt hồ đến bốn ngày trong rừng sâu. Mỗi hành
            trình được thiết kế để bạn có thời gian thực sự ở đó.
          </p>
        </div>

        <div className="mt-10 flex gap-2 overflow-x-auto border-b border-[#d2d0c6] pb-4">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={`whitespace-nowrap rounded-full px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d56742] ${
                activeFilter === filter
                  ? "bg-[#183024] text-white"
                  : "border border-[#b7b7ad] text-[#5b665d] hover:border-[#183024] hover:text-[#183024]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {visibleExperiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
        {visibleExperiences.length === 0 && (
          <p className="py-16 text-center text-sm text-[#69746b]">
            Đang cập nhật hành trình mới.
          </p>
        )}
        <div className="mt-10 flex justify-end">
          <a
            href="#/explore"
            onClick={(event) => {
              event.preventDefault()
              navigateTo("/explore")
            }}
            className="group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.17em] text-[#183024] transition-colors hover:text-[#b4502f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742]"
          >
            Xem toàn bộ hành trình{" "}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  )
}

function Destinations() {
  return (
    <section
      id="destinations"
      className="bg-[#f6f3ec] px-6 py-24 lg:px-12 lg:py-36"
    >
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#b4502f]">
              <span className="h-px w-10 bg-[#b4502f]" />
              Điểm đến
            </div>
            <h2 className="max-w-2xl font-display text-5xl font-medium leading-[0.95] tracking-[-0.06em] text-[#183024] sm:text-6xl">
              Nơi rừng xanh
              <br />
              <em className="text-[#61703f]">gọi tên bạn.</em>
            </h2>
          </div>
          <a
            href="#/explore"
            onClick={(event) => {
              event.preventDefault()
              navigateTo("/explore")
            }}
            className="group flex items-center gap-3 pb-2 text-[10px] font-bold uppercase tracking-[0.17em] text-[#183024] transition-colors hover:text-[#b4502f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742]"
          >
            Xem theo vùng miền{" "}
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[260px_260px]">
          {destinations.map((destination, index) => (
            <a
              key={destination.name}
              href="#/explore"
              onClick={(event) => {
                event.preventDefault()
                navigateTo("/explore")
              }}
              className={`group relative min-h-[300px] overflow-hidden rounded-[2px] bg-[#183024] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d56742] ${
                index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
              } ${index === 3 ? "lg:col-span-2" : ""}`}
            >
              <img
                src={destination.image}
                alt={destination.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d2418] via-[#0d2418]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7">
                <div className="flex items-end justify-between gap-5">
                  <div>
                    <span className="mb-2 block text-[9px] font-bold uppercase tracking-[0.24em] text-[#f2b08e]">
                      {destination.index} / {destination.caption}
                    </span>
                    <h3 className="font-display text-3xl tracking-[-0.05em] text-white lg:text-4xl">
                      {destination.name}
                    </h3>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-all group-hover:border-[#f2b08e] group-hover:bg-[#d56742]">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function Philosophy() {
  return (
    <section className="relative overflow-hidden bg-[#183024] px-6 py-24 text-white lg:px-12 lg:py-32">
      <div className="absolute -right-32 -top-48 h-[580px] w-[580px] rounded-full border border-white/10" />
      <div className="absolute -right-3 -top-20 h-[360px] w-[360px] rounded-full border border-white/10" />
      <div className="relative mx-auto max-w-[1240px]">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-28">
          <div>
            <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f2b08e]">
              <span className="h-px w-10 bg-[#f2b08e]" />
              Điều chúng tôi tin
            </div>
            <h2 className="max-w-3xl font-display text-5xl font-medium leading-[0.95] tracking-[-0.06em] sm:text-7xl">
              Hành trình tốt là hành trình{" "}
              <em className="text-[#f2b08e]">để lại điều tốt.</em>
            </h2>
            <p className="mt-8 max-w-xl text-base leading-7 text-white/75">
              Mỗi chuyến đi đóng góp trực tiếp cho người dẫn đường, gia đình bản
              địa và những nỗ lực bảo tồn tại điểm đến. Bạn không chỉ là một vị
              khách, bạn là một phần của câu chuyện tiếp tục.
            </p>
          </div>
          <div className="grid gap-8 self-end sm:grid-cols-3 lg:grid-cols-1">
            {[
              {
                icon: <Leaf className="h-6 w-6" aria-hidden="true" />,
                title: "Thiên nhiên",
                text: "Không để lại gì ngoài dấu chân.",
              },
              {
                icon: <Users className="h-6 w-6" aria-hidden="true" />,
                title: "Cộng đồng",
                text: "Giá trị ở lại với người địa phương.",
              },
              {
                icon: <ShieldCheck className="h-6 w-6" aria-hidden="true" />,
                title: "An toàn",
                text: "Chuẩn bị kỹ để đi xa hơn.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 border-t border-white/15 pt-5"
              >
                <span className="text-[#f2b08e]">{item.icon}</span>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.12em]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-5 text-white/70">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 grid border-y border-white/15 sm:grid-cols-3">
          <div className="border-b border-white/15 py-7 sm:border-b-0 sm:border-r sm:pr-8">
            <span className="font-display text-5xl text-[#f2b08e]">70%</span>
            <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-white/65">
              chi phí tour trở về cộng đồng
            </p>
          </div>
          <div className="border-b border-white/15 py-7 sm:border-b-0 sm:border-r sm:px-8">
            <span className="font-display text-5xl text-[#f2b08e]">0</span>
            <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-white/65">
              chai nhựa dùng một lần
            </p>
          </div>
          <div className="py-7 sm:pl-8">
            <span className="font-display text-5xl text-[#f2b08e]">100%</span>
            <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-white/65">
              hướng dẫn viên bản địa
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Journal() {
  return (
    <section id="journal" className="bg-[#f6f3ec] px-6 py-24 lg:px-12 lg:py-36">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <div className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#b4502f]">
              <span className="h-px w-10 bg-[#b4502f]" />
              Nhật ký ảnh
            </div>
            <h2 className="font-display text-5xl font-medium leading-[0.95] tracking-[-0.06em] text-[#183024] sm:text-6xl">
              Những điều
              <br />
              <em className="text-[#61703f]">mắt thấy, tim nhớ.</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-[#69746b]">
            Một vài lát cắt từ những ngày chúng ta cùng nhau đi qua rừng, qua
            làng, qua những buổi chiều rất dài.
          </p>
        </div>
        <div className="grid auto-rows-[190px] gap-4 sm:auto-rows-[230px] md:grid-cols-3 md:grid-rows-[250px_250px]">
          {galleryImages.map((image) => (
            <figure
              key={image.alt}
              className={`group relative m-0 overflow-hidden rounded-[2px] bg-[#d9d4c9] ${image.className}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10261a]/85 via-[#10261a]/20 to-transparent" />
              <figcaption className="absolute bottom-4 left-4 right-4 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                {image.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    group: "",
    note: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="bg-[#e9e6dd] px-6 py-24 lg:px-12 lg:py-32">
      <div className="mx-auto grid max-w-[1240px] overflow-hidden rounded-[2px] bg-white shadow-[0_18px_60px_rgba(24,48,36,0.08)] lg:grid-cols-[0.82fr_1.18fr]">
        <div className="relative overflow-hidden bg-[#183024] p-8 text-white sm:p-12 lg:p-14">
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="relative flex h-full flex-col">
            <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f2b08e]">
              <span className="h-px w-10 bg-[#f2b08e]" />
              Liên hệ
            </div>
            <h2 className="max-w-sm font-display text-5xl font-medium leading-[0.93] tracking-[-0.06em] sm:text-6xl">
              Để rừng
              <br />
              <em className="text-[#f2b08e]">gọi đúng tên bạn.</em>
            </h2>
            <p className="mt-7 max-w-sm text-sm leading-6 text-white/75">
              Bạn đã có cung đường trong đầu, hay chỉ biết mình muốn đi? Kể
              chúng tôi nghe. Một người địa phương sẽ trả lời trong vòng 24 giờ.
            </p>
            <div className="mt-auto space-y-5 pt-14">
              <a
                href="tel:+84905123456"
                className="flex items-center gap-4 text-sm text-white/85 transition-colors hover:text-[#f2b08e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2b08e]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-xs">
                  01
                </span>
                +84 905 123 456
              </a>
              <a
                href="mailto:hello@gialai-eco.vn"
                className="flex items-center gap-4 text-sm text-white/85 transition-colors hover:text-[#f2b08e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2b08e]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-xs">
                  02
                </span>
                hello@gialai-eco.vn
              </a>
              <div className="flex items-center gap-4 text-sm text-white/85">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-xs">
                  03
                </span>
                Pleiku, Gia Lai
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 lg:p-14">
          {submitted ? (
            <div className="flex h-full min-h-[460px] flex-col justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e4eee4] text-[#3d5c3c]">
                <Leaf className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mt-7 font-display text-4xl tracking-[-0.05em] text-[#183024]">
                Đã nhận lời nhắn.
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#69746b]">
                Cảm ơn {form.name || "bạn"}. Chúng tôi sẽ liên hệ lại trong vòng
                24 giờ để cùng bạn phác thảo hành trình phù hợp.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-8 self-start text-[10px] font-bold uppercase tracking-[0.16em] text-[#b4502f] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742]"
              >
                Gửi yêu cầu khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="mb-2">
                <h3 className="font-display text-3xl tracking-[-0.05em] text-[#183024]">
                  Bắt đầu từ đây.
                </h3>
                <p className="mt-2 text-sm text-[#69746b]">
                  Điền vài thông tin, phần còn lại để chúng tôi lo.
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="form-label">Họ và tên *</span>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Tên của bạn"
                  />
                </label>
                <label className="block">
                  <span className="form-label">Email *</span>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="ban@email.com"
                  />
                </label>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="form-label">Thời gian dự kiến</span>
                  <input
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Tháng 10, 2025"
                  />
                </label>
                <label className="block">
                  <span className="form-label">Số người</span>
                  <select
                    name="group"
                    value={form.group}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Chọn số người</option>
                    <option value="1-2">1 – 2 người</option>
                    <option value="3-6">3 – 6 người</option>
                    <option value="7-12">7 – 12 người</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="form-label">Bạn muốn trải nghiệm gì?</span>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows={4}
                  className="form-input resize-none"
                  placeholder="Trekking, văn hóa, nghỉ dưỡng... hoặc chỉ viết 'tôi muốn đi'"
                />
              </label>
              <button
                type="submit"
                className="group mt-1 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#d56742] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-all hover:bg-[#e27b57] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
              >
                Gửi yêu cầu{" "}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
              <p className="text-center text-[10px] leading-4 text-[#7f887f]">
                Thông tin của bạn chỉ được dùng để tư vấn hành trình.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* <IntroStrip /> */}
      <Story />
      <Experiences />
      <Destinations />
      <Philosophy />
      <Journal />
      <Contact />
    </>
  )
}
