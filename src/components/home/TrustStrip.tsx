const items = [
  { value: "12+ năm", label: "đưa khách lên cao nguyên", tone: "text-forest" },
  {
    value: "Tối đa 12 khách",
    label: "mỗi đoàn, để không làm ồn bản làng",
    tone: "text-lake",
  },
  {
    value: "100% HDV bản địa",
    label: "người Gia Lai, Kon Tum, Đắk Lắk",
    tone: "text-clay",
  },
  {
    value: "Trả lời trong 15'",
    label: "qua Zalo hoặc điện thoại, giờ hành chính",
    tone: "text-forest",
  },
]

export default function TrustStrip() {
  return (
    <section
      aria-label="Vì sao khách tin chúng tôi"
      className="page-container pt-12 lg:pt-28"
    >
      <ul className="m-0 grid list-none grid-cols-1 gap-6 border-b border-line p-0 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.value}>
            <strong
              className={`block text-[20px] font-bold leading-[30px] ${item.tone}`}
            >
              {item.value}
            </strong>
            <span className="mt-1 block text-sm leading-[21px] text-subtle">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
