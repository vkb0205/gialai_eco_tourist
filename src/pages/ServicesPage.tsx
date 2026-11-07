import { useEffect, useMemo, useState } from "react"
import PageBackdrop from "@/components/layout/PageBackdrop"
import type { FormEvent, ReactNode } from "react"
import {
  AirplaneTilt,
  ArrowUpRight,
  CarProfile,
  CheckCircle,
  FileText,
} from "@phosphor-icons/react"
import img0 from "@/imports/photos/bien-ho-aerial.webp"
import img1 from "@/imports/tours/kon-tum-church.webp"
import img2 from "@/imports/tours/buon-don.webp"
import {
  submissionErrorMessage,
  submitServiceSubmission,
} from "@/lib/submitServiceSubmission"

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
    icon: <CarProfile weight="regular" className="h-5 w-5" aria-hidden="true" />,
    benefits: ["Xe 4-45 chỗ", "Đưa đón sân bay", "Báo giá theo hành trình"],
  },
  {
    key: "visa",
    label: "Visa",
    title: "Tư vấn visa",
    summary: "Tư vấn hồ sơ, lịch nộp và các giấy tờ cần chuẩn bị cho chuyến đi nước ngoài.",
    image: img2,
    icon: <FileText weight="regular" className="h-5 w-5" aria-hidden="true" />,
    benefits: ["Kiểm tra hồ sơ", "Nhắc lịch nộp", "Theo sát từng trường hợp"],
  },
  {
    key: "flight",
    label: "Vé máy bay",
    title: "Vé máy bay",
    summary: "Tìm chuyến bay phù hợp, so sánh khung giờ và giữ vé theo thông tin bạn cung cấp.",
    image: img0,
    icon: <AirplaneTilt weight="regular" className="h-5 w-5" aria-hidden="true" />,
    benefits: ["Nội địa và quốc tế", "Một chiều hoặc khứ hồi", "Hỗ trợ đoàn"],
  },
]

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-[15px] font-semibold text-[#183024]">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass = "min-h-12 w-full rounded-[2px] bg-white px-4 text-[16px] text-[#183024] outline-none transition-colors placeholder:text-[#4f5b53] hover:bg-[#eaf4ec] focus:bg-[#f0f7f1] focus:outline focus:outline-2 focus:outline-[#183024]"
const textareaClass = `${inputClass} min-h-28 resize-y py-3`

function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#1f7a3a] px-8 text-[16px] font-semibold text-white transition-colors hover:bg-[#15602b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#183024] sm:w-auto"
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
    </button>
  )
}

function FormShell({ activeService, children }: { activeService: ServiceOption; children: ReactNode }) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    setSubmitted(false)
    setSubmitting(false)
    setSubmitError(null)
  }, [activeService.key])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    const formData = new FormData(event.currentTarget)
    const values: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") values[key] = value.trim()
    }

    // A hidden honeypot catches the cheapest automated submissions without
    // making the public form depend on a third-party captcha.
    if (values.website) return

    const contactFields = new Set([
      "full_name",
      "phone",
      "email",
      "contact_time",
      "privacy_consent",
      "website",
    ])
    const details = Object.fromEntries(
      Object.entries(values).filter(([key]) => !contactFields.has(key)),
    )

    setSubmitting(true)
    setSubmitError(null)
    try {
      await submitServiceSubmission({
        serviceKey: activeService.key,
        contactName: values.full_name ?? "",
        phone: values.phone ?? "",
        email: values.email,
        preferredContactTime: values.contact_time,
        details,
        privacyConsent: values.privacy_consent === "true",
      })
      setSubmitted(true)
    } catch (error) {
      setSubmitError(submissionErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={submitting}
      className="overflow-hidden rounded-[2px] bg-gradient-to-br from-[#f6fbf6] to-[#e4f2e8]"
    >
      <div aria-hidden="true" className="absolute left-[-10000px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
        <div className="relative min-h-[280px] bg-[#1f7a3a] text-white lg:min-h-full">
          <img src={activeService.image} alt={activeService.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#0c1f17]/65" />
          <div className="relative flex min-h-[280px] flex-col justify-end p-6 lg:min-h-[560px] lg:p-8">
            <h2 className="font-display text-3xl font-medium leading-tight tracking-[-0.03em] lg:text-4xl">
              {activeService.title}
            </h2>
            <p className="mt-4 max-w-sm text-[17px] leading-7 text-white">{activeService.summary}</p>
            <div className="mt-7 grid gap-3">
              {activeService.benefits.map((benefit) => (
                <span key={benefit} className="flex items-center gap-3 text-[16px] text-white">
                  <CheckCircle weight="fill" className="h-5 w-5 shrink-0 text-white" aria-hidden="true" />
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 lg:p-8">
          {submitted ? (
            <div className="flex min-h-[480px] flex-col items-start justify-center rounded-[2px] bg-white p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1f7a3a] text-white">
                <CheckCircle weight="fill" className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="mt-6 font-display text-3xl font-medium tracking-[-0.03em] text-[#1f7a3a]">
                Đã ghi nhận yêu cầu
              </h3>
              <p className="mt-4 max-w-md text-[17px] leading-7 text-[#2f3d35]">
                Cảm ơn bạn. Đội ngũ tư vấn sẽ liên hệ lại để xác nhận thông tin và gửi báo giá phù hợp.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-7 min-h-12 rounded-full bg-[#f0f7f1] px-6 text-[15px] font-semibold text-[#183024] transition-colors hover:bg-[#e1f0e4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#183024]"
              >
                Gửi yêu cầu mới
              </button>
            </div>
          ) : (
            <>
              {submitError ? (
                <p role="alert" className="mb-5 rounded-[2px] bg-[#f4dfd6] px-4 py-3 text-[16px] leading-6 text-[#6b2a14]">
                  {submitError}
                </p>
              ) : null}
              <div className="grid gap-6">{children}</div>
            </>
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
          <label key={item} className="flex min-h-14 cursor-pointer items-center justify-center rounded-[2px] bg-white px-4 text-[16px] font-semibold text-[#183024] transition-colors hover:bg-[#e0dfd7] has-[:checked]:bg-[#1f7a3a] has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#183024]">
            <input required name="vehicle" type="radio" className="sr-only" />
            {item}
          </label>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="car-from" label="Điểm đón"><input id="car-from" name="from" required className={inputClass} placeholder="Sân bay Pleiku" /></Field>
        <Field id="car-to" label="Điểm đến"><input id="car-to" name="to" required className={inputClass} placeholder="Măng Đen" /></Field>
        <Field id="car-date" label="Ngày đi"><input id="car-date" name="date" required type="date" className={inputClass} /></Field>
        <Field id="car-guests" label="Số khách"><input id="car-guests" name="guests" required min="1" type="number" className={inputClass} placeholder="4" /></Field>
      </div>
      <Field id="car-note" label="Ghi chú hành trình"><textarea id="car-note" name="note" className={textareaClass} placeholder="Thêm số điểm dừng, hành lý hoặc yêu cầu riêng" /></Field>
      <ContactFields prefix="car" />
      <ConsentField />
      <SubmitButton>Gửi yêu cầu thuê xe</SubmitButton>
    </>
  )
}

function VisaForm() {
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="visa-country" label="Quốc gia hoặc vùng lãnh thổ"><input id="visa-country" name="country" required className={inputClass} placeholder="Nhật Bản" /></Field>
        <Field id="visa-date" label="Ngày dự kiến đi"><input id="visa-date" name="date" type="date" className={inputClass} /></Field>
        <Field id="visa-purpose" label="Mục đích chuyến đi"><select id="visa-purpose" name="purpose" required className={inputClass} defaultValue=""><option value="" disabled>Chọn mục đích</option><option>Du lịch</option><option>Công tác</option><option>Thăm thân</option><option>Du học</option></select></Field>
        <Field id="visa-people" label="Số người làm hồ sơ"><input id="visa-people" name="people" required min="1" type="number" className={inputClass} placeholder="2" /></Field>
      </div>
      <Field id="visa-note" label="Tình trạng hồ sơ hiện tại"><textarea id="visa-note" name="note" className={textareaClass} placeholder="Bạn đã có hộ chiếu, lịch bay hoặc thư mời chưa" /></Field>
      <ContactFields prefix="visa" />
      <div className="rounded-[2px] bg-white p-4 text-[16px] leading-6 text-[#183024]">
        Phí và thời gian xử lý phụ thuộc vào từng lãnh sự quán. Tư vấn viên sẽ kiểm tra trước khi báo giá.
      </div>
      <ConsentField />
      <SubmitButton>Gửi yêu cầu visa</SubmitButton>
    </>
  )
}

function FlightForm() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {["Một chiều", "Khứ hồi"].map((item) => (
          <label key={item} className="flex min-h-14 cursor-pointer items-center justify-center rounded-[2px] bg-white px-4 text-[16px] font-semibold text-[#183024] transition-colors hover:bg-[#e0dfd7] has-[:checked]:bg-[#1f7a3a] has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#183024]">
            <input required name="trip" type="radio" className="sr-only" />
            {item}
          </label>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="flight-from" label="Đi từ"><input id="flight-from" name="from" required className={inputClass} placeholder="TP. Hồ Chí Minh" /></Field>
        <Field id="flight-to" label="Đi đến"><input id="flight-to" name="to" required className={inputClass} placeholder="Pleiku" /></Field>
        <Field id="flight-date" label="Ngày đi"><input id="flight-date" name="date" required type="date" className={inputClass} /></Field>
        <Field id="flight-return" label="Ngày về"><input id="flight-return" name="return_date" type="date" className={inputClass} /></Field>
        <Field id="flight-passengers" label="Số hành khách"><input id="flight-passengers" name="passengers" required min="1" type="number" className={inputClass} placeholder="3" /></Field>
        <Field id="flight-class" label="Hạng ghế"><select id="flight-class" name="flight_class" required className={inputClass} defaultValue=""><option value="" disabled>Chọn hạng ghế</option><option>Phổ thông</option><option>Phổ thông đặc biệt</option><option>Thương gia</option></select></Field>
      </div>
      <ContactFields prefix="flight" />
      <ConsentField />
      <SubmitButton>Gửi yêu cầu vé máy bay</SubmitButton>
    </>
  )
}

function ContactFields({ prefix }: { prefix: string }) {
  return (
    <div className="grid gap-5 pt-2 md:grid-cols-2">
      <Field id={`${prefix}-name`} label="Họ và tên"><input id={`${prefix}-name`} name="full_name" required className={inputClass} placeholder="Nguyễn Minh Anh" /></Field>
      <Field id={`${prefix}-phone`} label="Số điện thoại"><input id={`${prefix}-phone`} name="phone" required type="tel" className={inputClass} placeholder="090 000 0000" /></Field>
      <Field id={`${prefix}-email`} label="Email"><input id={`${prefix}-email`} name="email" type="email" className={inputClass} placeholder="email@cuaban.com" /></Field>
      <Field id={`${prefix}-contact-time`} label="Thời gian liên hệ"><input id={`${prefix}-contact-time`} name="contact_time" className={inputClass} placeholder="Sau 18:00" /></Field>
    </div>
  )
}

function ConsentField() {
  return (
    <label className="flex items-start gap-3 text-[15px] leading-6 text-[#2f3d35]">
      <input
        required
        name="privacy_consent"
        value="true"
        type="checkbox"
        className="mt-1 h-[18px] w-[18px] shrink-0 accent-[#183024]"
      />
      <span>
        Tôi đồng ý để Gia Lai Eco Tourist sử dụng thông tin này cho việc tư vấn và liên hệ về yêu cầu của tôi.
      </span>
    </label>
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
    <div className="bg-white text-[#183024]">
      <header className="relative isolate overflow-hidden bg-[#e1f2f8]">
        <PageBackdrop />
      <div className="mx-auto grid max-w-[1440px] items-end gap-10 px-6 pb-10 pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16 lg:px-12 lg:pb-12 lg:pt-36">
          <div className="motion-safe:animate-[rise-in_700ms_cubic-bezier(0.32,0.72,0,1)_both]">
            <h1 className="m-0 max-w-[16ch] font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1] tracking-[-0.04em] text-[#15602b]">
              Cần thêm hỗ trợ cho chuyến đi?
            </h1>
            <p className="m-0 mt-6 max-w-[34rem] text-lg leading-7 text-[#183024]">
              Thuê xe, visa hoặc vé máy bay: chọn dịch vụ, để lại thông tin. Tư vấn viên sẽ kiểm tra và phản hồi phương án phù hợp.
            </p>
          </div>
          <ul className="m-0 flex list-none flex-col gap-3 p-0 text-lg text-[#183024] motion-safe:animate-[rise-in_700ms_cubic-bezier(0.32,0.72,0,1)_220ms_both]">
            {["Lịch trình rõ ràng", "Liên hệ trong ngày", "Thông tin được bảo mật"].map((text) => (
              <li key={text} className="flex items-center gap-3">
                <CheckCircle weight="fill" className="h-6 w-6 shrink-0" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section className="px-6 py-14 lg:px-12 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-[102px] lg:self-start">
            <h2 className="m-0 font-display text-2xl tracking-[-0.02em]">Chọn dịch vụ</h2>
            <div className="mt-4 grid gap-2" role="group" aria-label="Chọn dịch vụ">
              {serviceOptions.map((service) => {
                const active = service.key === activeKey
                return (
                  <button
                    key={service.key}
                    type="button"
                    onClick={() => setActiveKey(service.key)}
                    aria-pressed={active}
                    className={`flex min-h-12 items-center gap-3 rounded-full px-5 text-left text-[16px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024] ${
                      active ? "bg-[#1f7a3a] text-white" : "bg-[#f0f7f1] text-[#183024] hover:bg-[#1f7a3a] hover:text-white"
                    }`}
                  >
                    {service.icon}
                    {service.label}
                  </button>
                )
              })}
            </div>
            <p className="mt-6 text-[16px] leading-6 text-[#2f3d35]">
              Bạn có thể gửi từng dịch vụ riêng lẻ. Nếu cần trọn gói, hãy ghi rõ trong phần ghi chú.
            </p>
          </aside>

          <FormShell activeService={activeService}>
            <ActiveForm activeKey={activeKey} />
          </FormShell>
        </div>
      </section>
    </div>
  )
}
