const reasons = [
  {
    number: "01",
    title: "Hướng dẫn viên là người bản địa",
    mobileTitle: "Hướng dẫn viên bản địa",
    body: "Nói được tiếng Ba Na, Jrai; giới thiệu bạn với già làng, không phải với quầy lưu niệm.",
    mobileBody: "Nói tiếng Ba Na, Jrai; đưa bạn gặp già làng.",
  },
  {
    number: "02",
    title: "Đoàn nhỏ, tối đa 12 khách",
    mobileTitle: "Đoàn nhỏ, tối đa 12 khách",
    body: "Đủ ít để vào được nhà rông, đủ thân để bữa tối thành buổi trò chuyện.",
    mobileBody: "Đủ ít để được mời vào nhà rông.",
  },
  {
    number: "03",
    title: "Du lịch có trách nhiệm",
    mobileTitle: "Du lịch có trách nhiệm",
    body: "Một phần chi phí trả thẳng cho hộ đón khách; không nhựa dùng một lần trên đường rừng.",
    mobileBody: "Chi phí trả thẳng cho hộ đón khách.",
  },
]

export default function WhyUs() {
  return (
    <section
      id="about"
      aria-labelledby="why-title"
      className="bg-sky py-16 lg:py-24"
    >
      <div className="page-container grid gap-10 lg:grid-cols-[1fr_1px_1.4fr] lg:gap-12">
        <div>
          <p className="t-eyebrow !text-lake">VÌ SAO ĐI CÙNG CHÚNG TÔI</p>
          <h2
            id="why-title"
            className="text-[28px] font-bold leading-[36px] text-ink lg:text-[32px] lg:leading-[42px]"
          >
            Người địa phương dẫn, nên đường đi khác
          </h2>
          <p className="mt-5 text-base leading-[26px] text-body">
            Từ Pleiku, chúng tôi kết nối bạn với những người địa phương am hiểu
            điểm đến và cùng bạn chọn hành trình phù hợp trên khắp Việt Nam.
          </p>
        </div>

        <div aria-hidden="true" className="hidden bg-lake/20 lg:block" />

        <ol className="m-0 list-none p-0">
          {reasons.map((reason) => (
            <li
              key={reason.number}
              className="flex gap-5 border-lake/20 py-6 first:pt-0 not-first:border-t lg:gap-8 lg:py-7"
            >
              <span
                aria-hidden="true"
                className="w-12 shrink-0 text-[28px] font-bold leading-tight text-lake lg:w-14 lg:text-[32px] lg:leading-[42px]"
              >
                {reason.number}
              </span>
              <div>
                <h3 className="text-lg font-bold leading-[27px] text-ink lg:text-[20px] lg:leading-[30px]">
                  <span className="hidden lg:inline">{reason.title}</span>
                  <span className="lg:hidden">{reason.mobileTitle}</span>
                </h3>
                <p className="mt-2 text-sm leading-[22px] text-body lg:text-base lg:leading-[26px]">
                  <span className="hidden lg:inline">{reason.body}</span>
                  <span className="lg:hidden">{reason.mobileBody}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
