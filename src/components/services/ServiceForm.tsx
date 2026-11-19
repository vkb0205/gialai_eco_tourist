import { useEffect, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { CheckCircle } from "@phosphor-icons/react"
import {
  submissionErrorMessage,
  submitServiceSubmission,
} from "@/lib/submitServiceSubmission"
import type { ServiceSubmissionKey } from "@/lib/submitServiceSubmission"

export const FORM_ID = "yeu-cau"

const inputClass =
  "min-h-14 w-full rounded-control border border-field-line bg-paper px-4 text-base text-ink outline-none transition-colors placeholder:text-subtle hover:border-forest focus:border-forest focus:ring-2 focus:ring-forest/30"
const softInputClass = inputClass
  .replace("bg-paper", "bg-air")
  .replace("rounded-control", "rounded-field")
const textareaClass = `${inputClass} min-h-[104px] resize-y py-3`

function Field({
  id,
  label,
  required,
  children,
  controlGap = "gap-1.5",
}: {
  id: string
  label: string
  required?: boolean
  children: ReactNode
  controlGap?: string
}) {
  return (
      <div className={`grid ${controlGap}`}>
      <label htmlFor={id} className="text-[15px] font-semibold leading-[22px] text-ink">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
    </div>
  )
}

function OptionGroup({
  legend,
  name,
  items,
}: {
  legend: string
  name: string
  items: Array<string | { value: string; label: string }>
}) {
  return (
    <fieldset className="m-0 mb-1 border-0 p-0">
      <legend className="mb-1.5 p-0 text-[15px] font-semibold leading-[22px] text-ink">
        {legend}
        <span aria-hidden="true"> *</span>
      </legend>
      <div className={`grid gap-4 ${items.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {items.map((item) => {
          const value = typeof item === "string" ? item : item.value
          const label = typeof item === "string" ? item : item.label
          return (
            <label
              key={value}
              className="flex min-h-14 cursor-pointer items-center justify-center rounded-option border border-field-line bg-paper px-4 text-base font-semibold text-ink transition-colors hover:border-forest has-[:checked]:border-forest has-[:checked]:bg-forest has-[:checked]:text-paper has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink"
            >
              <input required name={name} value={value} type="radio" className="sr-only" />
              {label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function ContactFields({ prefix }: { prefix: string }) {
  return (
    <div className="grid gap-x-4 gap-y-6 border-t border-line pt-6 md:grid-cols-2 md:gap-y-10 lg:mb-3">
      <Field id={`${prefix}-name`} label="Họ và tên" required>
        <input id={`${prefix}-name`} name="full_name" required autoComplete="name" className={inputClass} placeholder="Nguyễn Văn A" />
      </Field>
      <Field id={`${prefix}-phone`} label="Số điện thoại / Zalo" required>
        <input id={`${prefix}-phone`} name="phone" required type="tel" autoComplete="tel" className={inputClass} placeholder="09xx xxx xxx" />
      </Field>
      <Field id={`${prefix}-email`} label="Email" controlGap="gap-3.5">
        <input id={`${prefix}-email`} name="email" type="email" autoComplete="email" className={softInputClass} placeholder="email@cuaban.com" />
      </Field>
      <Field id={`${prefix}-contact-time`} label="Thời gian liên hệ" controlGap="gap-3.5">
        <input id={`${prefix}-contact-time`} name="contact_time" className={softInputClass} placeholder="Ví dụ: sau 18:00" />
      </Field>
    </div>
  )
}

function ConsentField() {
  return (
    <label className="flex items-start gap-3 text-[15px] leading-6 text-body">
      <input
        required
        name="privacy_consent"
        value="true"
        type="checkbox"
        className="h-6 w-6 shrink-0 accent-forest"
      />
      <span className="md:max-w-[720px]">
        Tôi đồng ý để Gia Lai Eco Tourist sử dụng thông tin này
        <br className="hidden md:block" />
        để tư vấn và liên hệ về yêu cầu của tôi.
      </span>
    </label>
  )
}

function SubmitRow({ children }: { children: ReactNode }) {
  return (
    <div className="mt-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <button
        type="submit"
        className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-button bg-forest px-8 text-base font-bold text-paper transition-colors hover:bg-forest-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 sm:w-auto sm:min-w-[300px]"
      >
        {children}
      </button>
      <p className="m-0 text-[14px] leading-[21px] text-subtle">Thông tin chỉ dùng để liên hệ lại về yêu cầu này.</p>
    </div>
  )
}

function CarForm() {
  return (
    <>
      <OptionGroup
        legend="Loại xe"
        name="vehicle"
        items={[
          { value: "Xe 4-7 chỗ", label: "Xe 4–7 chỗ" },
          { value: "Xe 16-29 chỗ", label: "Xe 16–29 chỗ" },
          { value: "Xe 35-45 chỗ", label: "Xe 35–45 chỗ" },
        ]}
      />
      <div className="grid gap-x-4 gap-y-7 md:grid-cols-2">
        <Field id="car-from" label="Điểm đón" required><input id="car-from" name="from" required className={inputClass} placeholder="Sân bay Pleiku" /></Field>
        <Field id="car-to" label="Điểm đến" required><input id="car-to" name="to" required className={inputClass} placeholder="Măng Đen" /></Field>
        <Field id="car-date" label="Ngày đi" required><input id="car-date" name="date" required type="date" className={inputClass} /></Field>
        <Field id="car-guests" label="Số khách" required><input id="car-guests" name="guests" required min="1" type="number" className={inputClass} placeholder="4" /></Field>
      </div>
      <Field id="car-note" label="Ghi chú hành trình"><textarea id="car-note" name="note" className={textareaClass} placeholder="Thêm số điểm dừng, hành lý hoặc yêu cầu riêng" /></Field>
      <ContactFields prefix="car" />
      <ConsentField />
      <SubmitRow>Gửi yêu cầu</SubmitRow>
    </>
  )
}

function VisaForm() {
  return (
    <>
      <div className="grid gap-x-4 gap-y-7 md:grid-cols-2">
        <Field id="visa-country" label="Quốc gia hoặc vùng lãnh thổ" required><input id="visa-country" name="country" required className={inputClass} placeholder="Nhật Bản" /></Field>
        <Field id="visa-date" label="Ngày dự kiến đi"><input id="visa-date" name="date" type="date" className={inputClass} /></Field>
        <Field id="visa-purpose" label="Mục đích chuyến đi" required><select id="visa-purpose" name="purpose" required className={inputClass} defaultValue=""><option value="" disabled>Chọn mục đích</option><option>Du lịch</option><option>Công tác</option><option>Thăm thân</option><option>Du học</option></select></Field>
        <Field id="visa-people" label="Số người làm hồ sơ" required><input id="visa-people" name="people" required min="1" type="number" className={inputClass} placeholder="2" /></Field>
      </div>
      <Field id="visa-note" label="Tình trạng hồ sơ hiện tại"><textarea id="visa-note" name="note" className={textareaClass} placeholder="Bạn đã có hộ chiếu, lịch bay hoặc thư mời chưa" /></Field>
      <ContactFields prefix="visa" />
      <div className="rounded-field bg-sky p-4 text-base leading-6 text-ink">
        Phí và thời gian xử lý phụ thuộc vào từng lãnh sự quán. Tư vấn viên sẽ kiểm tra trước khi báo giá.
      </div>
      <ConsentField />
      <SubmitRow>Gửi yêu cầu</SubmitRow>
    </>
  )
}

function FlightForm() {
  return (
    <>
      <OptionGroup legend="Loại hành trình" name="trip" items={["Một chiều", "Khứ hồi"]} />
      <div className="grid gap-x-4 gap-y-7 md:grid-cols-2">
        <Field id="flight-from" label="Đi từ" required><input id="flight-from" name="from" required className={inputClass} placeholder="TP. Hồ Chí Minh" /></Field>
        <Field id="flight-to" label="Đi đến" required><input id="flight-to" name="to" required className={inputClass} placeholder="Pleiku" /></Field>
        <Field id="flight-date" label="Ngày đi" required><input id="flight-date" name="date" required type="date" className={inputClass} /></Field>
        <Field id="flight-return" label="Ngày về"><input id="flight-return" name="return_date" type="date" className={inputClass} /></Field>
        <Field id="flight-passengers" label="Số hành khách" required><input id="flight-passengers" name="passengers" required min="1" type="number" className={inputClass} placeholder="3" /></Field>
        <Field id="flight-class" label="Hạng ghế" required><select id="flight-class" name="flight_class" required className={inputClass} defaultValue=""><option value="" disabled>Chọn hạng ghế</option><option>Phổ thông</option><option>Phổ thông đặc biệt</option><option>Thương gia</option></select></Field>
      </div>
      <ContactFields prefix="flight" />
      <ConsentField />
      <SubmitRow>Gửi yêu cầu</SubmitRow>
    </>
  )
}

/** General enquiry, reached from tour pages (`?service=general&tour=<slug>`). */
function GeneralForm({ tourSlug, tourTitle }: { tourSlug: string; tourTitle: string }) {
  const prefill = tourTitle ? `Tôi muốn được tư vấn về tour: ${tourTitle}.` : ""
  return (
    <>
      {tourSlug ? <input type="hidden" name="tour" value={tourSlug} /> : null}
      <Field id="general-note" label="Nội dung cần tư vấn" required>
        <textarea
          key={prefill}
          id="general-note"
          name="note"
          required
          defaultValue={prefill}
          className={textareaClass}
          placeholder="Ngày đi, số người và điều bạn muốn hỏi"
        />
      </Field>
      <ContactFields prefix="general" />
      <ConsentField />
      <SubmitRow>Gửi yêu cầu</SubmitRow>
    </>
  )
}

export type FormService = ServiceSubmissionKey

export default function ServiceForm({
  serviceKey,
  tourSlug = "",
  tourTitle = "",
}: {
  serviceKey: FormService
  tourSlug?: string
  tourTitle?: string
}) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    setSubmitted(false)
    setSubmitting(false)
    setSubmitError(null)
  }, [serviceKey])

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
        serviceKey,
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

  if (submitted) {
    return (
      <div role="status" className="flex min-h-[320px] flex-1 flex-col items-start justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest text-paper">
          <CheckCircle weight="fill" className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="m-0 mt-6 text-3xl font-semibold tracking-[-0.02em] text-forest">Đã ghi nhận yêu cầu</h3>
        <p className="m-0 mt-4 max-w-md text-[17px] leading-7 text-body">
          Cảm ơn bạn. Đội ngũ tư vấn sẽ liên hệ lại để xác nhận thông tin và gửi báo giá phù hợp.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-7 min-h-12 rounded-button bg-leaf px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          Gửi yêu cầu mới
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={submitting} className="flex min-h-[500px] flex-col gap-7 lg:h-full">
      <div aria-hidden="true" className="absolute left-[-10000px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {submitError ? (
        <p role="alert" className="m-0 rounded-field bg-blush px-4 py-3 text-base leading-6 text-clay">
          {submitError}
        </p>
      ) : null}
      {serviceKey === "visa" ? (
        <VisaForm />
      ) : serviceKey === "flight" ? (
        <FlightForm />
      ) : serviceKey === "general" ? (
        <GeneralForm tourSlug={tourSlug} tourTitle={tourTitle} />
      ) : (
        <CarForm />
      )}
    </form>
  )
}
