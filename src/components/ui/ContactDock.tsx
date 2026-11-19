import { ChatCircleDots, EnvelopeSimple, Phone } from "@phosphor-icons/react"
import { FORM_ID } from "@/components/services/ServiceForm"
import { navigateTo } from "@/lib/useHashRoute"

export default function ContactDock({
  variant = "default",
  tourSlug,
}: {
  variant?: "default" | "tour"
  tourSlug?: string
}) {
  const enquiryQuery = tourSlug
    ? `service=general&tour=${encodeURIComponent(tourSlug)}`
    : "service=general"

  return (
    <aside
      aria-label="Liên hệ nhanh"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-search md:hidden"
    >
      <div className="mx-auto flex max-w-sm items-center gap-2">
        <a
          href="https://zalo.me/02693760898"
          target="_blank"
          rel="noreferrer noopener"
          className={`flex flex-1 items-center justify-center gap-1.5 font-bold transition-colors ${variant === "tour" ? "h-12 rounded-button text-[14px]" : "h-14 rounded-card text-[15px]"} ${variant === "tour" ? "bg-forest text-paper hover:bg-forest-hover" : "bg-leaf text-forest hover:bg-forest/10"}`}
        >
          <ChatCircleDots size={20} aria-hidden="true" />
          Zalo
        </a>
        <a
          href="tel:02693760898"
          className={`flex flex-1 items-center justify-center gap-1.5 font-bold text-ink transition-colors hover:bg-sunflower/90 ${variant === "tour" ? "h-12 rounded-button text-[14px]" : "h-14 rounded-card text-[15px]"}`}
        >
          <Phone size={20} aria-hidden="true" />
          {variant === "tour" ? "Gọi" : "Gọi ngay"}
        </a>
        <a
          href={`#/services?${enquiryQuery}`}
          onClick={(event) => {
            event.preventDefault()
            navigateTo("/services", enquiryQuery, { scrollTo: FORM_ID })
          }}
          className={`flex flex-[1.05] items-center justify-center gap-1.5 font-bold transition-colors ${variant === "tour" ? "h-12 rounded-button text-[14px]" : "h-14 rounded-card text-[15px]"} ${variant === "tour" ? "bg-sky text-ink hover:bg-sky/80" : "bg-forest text-white hover:bg-forest-hover"}`}
        >
          <EnvelopeSimple size={20} aria-hidden="true" />
          Gửi yêu cầu
        </a>
      </div>
      {variant === "tour" && (
        <p className="m-0 mt-1 text-center text-[11px] font-medium leading-[17px] text-subtle">
          0269 376 0898
        </p>
      )}
    </aside>
  )
}
