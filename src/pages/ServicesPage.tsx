import { useEffect, useMemo, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import {
  AirplaneTilt,
  ArrowUpRight,
  CalendarBlank,
  CarProfile,
  CheckCircle,
  FileText,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Users,
} from "@phosphor-icons/react"
import img0 from "@/imports/image.jpeg"
import img1 from "@/imports/image-1.png"
import img2 from "@/imports/image-2.png"

type ServiceKey = "car" | "visa" | "flight"

type ServiceOption = {
  key: ServiceKey
  label: string
  title: string
  summary: string
  image: string
  icon: ReactNode
  benefits: string[]
}

const serviceOptions: ServiceOption[] = [
  {
    key: "car",
    label: "Thuê xe",
    title: "Thuê xe du lịch",
    summary: "Xe riêng, tài xế địa phương và lịch trình linh hoạt cho cá nhân, gia đình hoặc đoàn nhỏ.",
    image: img1,
    icon: <CarProfile weight="duotone" className="h-5 w-5" aria-hidden="true" />,
    benefits: ["Xe 4-45 chỗ", "Đưa đón sân bay", "Báo giá theo hành trình"],
  },
  {
    key: "visa",
    label: "Visa",
    title: "Tư vấn visa",
    summary: "Tư vấn hồ sơ, lịch nộp và các giấy tờ cần chuẩn bị cho chuyến đi nước ngoài.",
    image: img2,
    icon: <FileText weight="duotone" className="h-5 w-5" aria-hidden="true" />,
    benefits: ["Kiểm tra hồ sơ", "Nhắc lịch nộp", "Theo sát từng trường hợp"],
  },
  {
    key: "flight",
    label: "Vé máy bay",
    title: "Vé máy bay",
    summary: "Tìm chuyến bay phù hợp, so sánh khung giờ và giữ vé theo thông tin bạn cung cấp.",
    image: img0,
    icon: <AirplaneTilt weight="duotone" className="h-5 w-5" aria-hidden="true" />,
    benefits: ["Nội địa và quốc tế", "Một chiều hoặc khứ hồi", "Hỗ trợ đoàn"],
  },
]

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#526257]">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass = "min-h-12 rounded-xl border border-[#d9d4c9] bg-white px-4 text-sm text-[#183024] outline-none transition-colors placeholder:text-[#7a857d] focus:border-[#d56742] focus:ring-2 focus:ring-[#d56742]/20"
const textareaClass = `${inputClass} min-h-28 resize-y py-3`

function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#183024] px-7 py-4 text-xs font-bold uppercase tracking-[0.12em] text-white transition-all hover:-translate-y-0.5 hover:bg-[#d56742] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742] sm:w-auto"
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
    </button>
  )
}

function FormShell({ activeService, children }: { activeService: ServiceOption; children: ReactNode }) {
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setSubmitted(false)
  }, [activeService.key])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden rounded-[24px] border border-[#d9d4c9] bg-white shadow-[0_18px_46px_rgba(24,48,36,0.08)]">
      <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
        <div className="relative min-h-[280px] bg-[#183024] text-white lg:min-h-full">
          <img src={activeService.image} alt={activeService.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,48,36,0.16)_0%,rgba(24,48,36,0.84)_100%)]" />
          <div className="relative flex min-h-[280px] flex-col justify-end p-6 lg:min-h-[560px] lg:p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#d56742]">
              {activeService.icon}
            </div>
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-[-0.03em] lg:text-4xl">
              {activeService.title}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/78">{activeService.summary}</p>
            <div className="mt-7 grid gap-3">
              {activeService.benefits.map((benefit) => (
                <span key={benefit} className="flex items-center gap-3 text-sm text-white/86">
                  <CheckCircle weight="fill" className="h-5 w-5 text-[#fed24f]" aria-hidden="true" />
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 lg:p-8">
          {submitted ? (
            <div className="flex min-h-[480px] flex-col items-start justify-center rounded-2xl bg-[#f6f3ec] p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d56742] text-white">
                <CheckCircle weight="fill" className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="mt-6 font-display text-3xl font-semibold tracking-[-0.03em] text-[#183024]">
                Đã ghi nhận yêu cầu
              </h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#526257]">
                Cảm ơn bạn. Đội ngũ tư vấn sẽ liên hệ lại để xác nhận thông tin và gửi báo giá phù hợp.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-7 rounded-full border border-[#d9d4c9] bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#183024] transition-colors hover:border-[#d56742] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d56742]"
              >
                Gửi yêu cầu mới
              </button>
            </div>
          ) : (
            <div className="grid gap-6">{children}</div>
          )}
        </div>
      </div>
    </form>
  )
}

function CarForm() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        {["Xe 4-7 chỗ", "Xe 16-29 chỗ", "Xe 35-45 chỗ"].map((item) => (
          <label key={item} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#d9d4c9] bg-[#f6f3ec] p-4 text-sm font-semibold text-[#183024] has-[:checked]:border-[#d56742] has-[:checked]:bg-[#fff4ef]">
            <input required name="vehicle" type="radio" className="h-4 w-4 accent-[#d56742]" />
            {item}
          </label>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="car-from" label="Điểm đón"><input id="car-from" required className={inputClass} placeholder="Sân bay Pleiku" /></Field>
        <Field id="car-to" label="Điểm đến"><input id="car-to" required className={inputClass} placeholder="Măng Đen" /></Field>
        <Field id="car-date" label="Ngày đi"><input id="car-date" required type="date" className={inputClass} /></Field>
        <Field id="car-guests" label="Số khách"><input id="car-guests" required min="1" type="number" className={inputClass} placeholder="4" /></Field>
      </div>
      <Field id="car-note" label="Ghi chú hành trình"><textarea id="car-note" className={textareaClass} placeholder="Thêm số điểm dừng, hành lý hoặc yêu cầu riêng" /></Field>
      <ContactFields prefix="car" />
      <SubmitButton>Gửi yêu cầu thuê xe</SubmitButton>
    </>
  )
}

function VisaForm() {
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="visa-country" label="Quốc gia hoặc vùng lãnh thổ"><input id="visa-country" required className={inputClass} placeholder="Nhật Bản" /></Field>
        <Field id="visa-date" label="Ngày dự kiến đi"><input id="visa-date" type="date" className={inputClass} /></Field>
        <Field id="visa-purpose" label="Mục đích chuyến đi"><select id="visa-purpose" required className={inputClass} defaultValue=""><option value="" disabled>Chọn mục đích</option><option>Du lịch</option><option>Công tác</option><option>Thăm thân</option><option>Du học</option></select></Field>
        <Field id="visa-people" label="Số người làm hồ sơ"><input id="visa-people" required min="1" type="number" className={inputClass} placeholder="2" /></Field>
      </div>
      <Field id="visa-note" label="Tình trạng hồ sơ hiện tại"><textarea id="visa-note" className={textareaClass} placeholder="Bạn đã có hộ chiếu, lịch bay hoặc thư mời chưa" /></Field>
      <ContactFields prefix="visa" />
      <div className="rounded-2xl bg-[#f6f3ec] p-4 text-sm leading-6 text-[#526257]">
        Phí và thời gian xử lý phụ thuộc vào từng lãnh sự quán. Tư vấn viên sẽ kiểm tra trước khi báo giá.
      </div>
      <SubmitButton>Gửi yêu cầu visa</SubmitButton>
    </>
  )
}

function FlightForm() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {["Một chiều", "Khứ hồi"].map((item) => (
          <label key={item} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#d9d4c9] bg-[#f6f3ec] p-4 text-sm font-semibold text-[#183024] has-[:checked]:border-[#d56742] has-[:checked]:bg-[#fff4ef]">
            <input required name="trip" type="radio" className="h-4 w-4 accent-[#d56742]" />
            {item}
          </label>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="flight-from" label="Đi từ"><input id="flight-from" required className={inputClass} placeholder="TP. Hồ Chí Minh" /></Field>
        <Field id="flight-to" label="Đi đến"><input id="flight-to" required className={inputClass} placeholder="Pleiku" /></Field>
        <Field id="flight-date" label="Ngày đi"><input id="flight-date" required type="date" className={inputClass} /></Field>
        <Field id="flight-return" label="Ngày về"><input id="flight-return" type="date" className={inputClass} /></Field>
        <Field id="flight-passengers" label="Số hành khách"><input id="flight-passengers" required min="1" type="number" className={inputClass} placeholder="3" /></Field>
        <Field id="flight-class" label="Hạng ghế"><select id="flight-class" required className={inputClass} defaultValue=""><option value="" disabled>Chọn hạng ghế</option><option>Phổ thông</option><option>Phổ thông đặc biệt</option><option>Thương gia</option></select></Field>
      </div>
      <ContactFields prefix="flight" />
      <SubmitButton>Gửi yêu cầu vé máy bay</SubmitButton>
    </>
  )
}

function ContactFields({ prefix }: { prefix: string }) {
  return (
    <div className="grid gap-5 border-t border-[#e0dcd2] pt-6 md:grid-cols-2">
      <Field id={`${prefix}-name`} label="Họ và tên"><input id={`${prefix}-name`} required className={inputClass} placeholder="Nguyễn Minh Anh" /></Field>
      <Field id={`${prefix}-phone`} label="Số điện thoại"><input id={`${prefix}-phone`} required type="tel" className={inputClass} placeholder="090 000 0000" /></Field>
      <Field id={`${prefix}-email`} label="Email"><input id={`${prefix}-email`} type="email" className={inputClass} placeholder="email@cuaban.com" /></Field>
      <Field id={`${prefix}-contact-time`} label="Thời gian liên hệ"><input id={`${prefix}-contact-time`} className={inputClass} placeholder="Sau 18:00" /></Field>
    </div>
  )
}

function ActiveForm({ activeKey }: { activeKey: ServiceKey }) {
  if (activeKey === "visa") return <VisaForm />
  if (activeKey === "flight") return <FlightForm />
  return <CarForm />
}

function keyFromQuery(query: string): ServiceKey {
  const slug = new URLSearchParams(query).get("dichvu")
  if (slug === "visa") return "visa"
  if (slug === "ve-may-bay") return "flight"
  return "car"
}

export default function ServicesPage({ query = "" }: { query?: string }) {
  const [activeKey, setActiveKey] = useState<ServiceKey>(() => keyFromQuery(query))
  useEffect(() => {
    setActiveKey(keyFromQuery(query))
  }, [query])

  const activeService = useMemo(
    () => serviceOptions.find((service) => service.key === activeKey) ?? serviceOptions[0],
    [activeKey],
  )

  return (
    <div className="bg-[#f6f3ec] pt-[78px] text-[#183024]">
      <section className="border-b border-[#d9d4c9] px-6 py-14 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.6fr)] lg:items-end">
          <div>
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d56742]">Dịch vụ khác</p>
            <h1 className="font-display text-[clamp(2.4rem,6vw,4.7rem)] font-semibold leading-[1.04] tracking-[-0.05em]">
              Cần thêm hỗ trợ cho chuyến đi?
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#526257] lg:text-lg">
              Chọn dịch vụ, để lại thông tin. Tư vấn viên sẽ kiểm tra và phản hồi phương án phù hợp.
            </p>
          </div>
          <div className="grid gap-4 rounded-[24px] border border-[#d9d4c9] bg-white p-5 shadow-[0_14px_34px_rgba(24,48,36,0.06)] sm:grid-cols-3 lg:grid-cols-1">
            {[{ icon: <MapPin className="h-5 w-5" />, text: "Lịch trình rõ ràng" }, { icon: <PhoneCall className="h-5 w-5" />, text: "Liên hệ trong ngày" }, { icon: <ShieldCheck className="h-5 w-5" />, text: "Thông tin được bảo mật" }].map((item) => (
              <div key={item.text} className="flex items-center gap-3 rounded-2xl bg-[#f6f3ec] p-4 text-sm font-semibold text-[#183024]">
                <span className="text-[#d56742]">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-[102px] lg:self-start">
            <div className="rounded-[24px] border border-[#d9d4c9] bg-white p-3 shadow-[0_14px_34px_rgba(24,48,36,0.05)]">
              <p className="px-3 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#69746b]">Chọn dịch vụ</p>
              <div className="grid gap-2">
                {serviceOptions.map((service) => {
                  const active = service.key === activeKey
                  return (
                    <button
                      key={service.key}
                      type="button"
                      onClick={() => setActiveKey(service.key)}
                      className={`flex items-center justify-between rounded-2xl px-4 py-4 text-left text-sm font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d56742] ${
                        active ? "bg-[#183024] text-white" : "bg-[#f6f3ec] text-[#183024] hover:bg-[#e9e6dd]"
                      }`}
                    >
                      <span className="flex items-center gap-3">{service.icon}{service.label}</span>
                      {active ? <CheckCircle weight="fill" className="h-5 w-5 text-[#fed24f]" aria-hidden="true" /> : null}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="mt-4 rounded-[24px] border border-[#d9d4c9] bg-[#183024] p-5 text-white">
              <div className="flex items-center gap-3 text-[#fed24f]"><CalendarBlank className="h-5 w-5" /><Users className="h-5 w-5" /></div>
              <p className="mt-4 text-sm leading-6 text-white/78">Bạn có thể gửi từng dịch vụ riêng lẻ. Nếu cần trọn gói, hãy ghi rõ trong phần ghi chú.</p>
            </div>
          </aside>

          <FormShell activeService={activeService}>
            <ActiveForm activeKey={activeKey} />
          </FormShell>
        </div>
      </section>
    </div>
  )
}
