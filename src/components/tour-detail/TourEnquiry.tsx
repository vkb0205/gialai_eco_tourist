import { FORM_ID } from "@/components/services/ServiceForm"
import { navigateTo } from "@/lib/useHashRoute"

export default function TourEnquiry({ slug }: { slug: string }) {
  const query = new URLSearchParams({ service: "general", tour: slug }).toString()

  return (
    <section
      id="tour-enquiry"
      aria-labelledby="tour-enquiry-title"
      className="scroll-mt-40 rounded-card bg-sky p-4 md:p-6"
    >
      <h2 id="tour-enquiry-title" className="m-0 text-[22px] font-bold text-ink">
        Gửi yêu cầu tư vấn
      </h2>
      <p className="m-0 mt-3 text-sm leading-6 text-body">
        Gửi câu hỏi về hành trình này. Tư vấn viên sẽ liên hệ lại trong ngày.
      </p>
      <a
        href={`#/services?${query}`}
        onClick={(event) => {
          event.preventDefault()
          navigateTo("/services", query, { scrollTo: FORM_ID })
        }}
        className="btn-primary mt-5 w-full"
      >
        Gửi yêu cầu tư vấn
      </a>
    </section>
  )
}
