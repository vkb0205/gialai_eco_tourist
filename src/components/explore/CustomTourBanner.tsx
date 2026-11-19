export default function CustomTourBanner() {
  return (
    <aside
      aria-labelledby="custom-tour-title"
      className="custom-tour-banner col-span-full my-6 flex min-h-[160px] flex-col items-start justify-between gap-6 rounded-panel bg-sky p-7 md:flex-row md:items-center md:p-10"
    >
      <div className="custom-tour-content max-w-[760px]">
        <h2
          id="custom-tour-title"
          className="t-h2 custom-tour-title m-0 text-2xl font-bold leading-tight text-ink md:text-[28px]"
        >
          Không thấy lịch trình vừa ý? Thiết kế tour riêng.
        </h2>
        <p className="custom-tour-description m-0 mt-2 text-base text-body md:text-[18px] md:leading-relaxed">
          Gia đình, công ty, nhóm bạn: báo số người và ngày đi, chúng tôi gửi đề
          xuất trong 24 giờ.
        </p>
      </div>

      <a
        href="https://zalo.me/02693760898"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-14 w-[240px] shrink-0 items-center justify-center rounded-[28px] bg-sunflower px-0 text-[15px] font-bold text-ink shadow-xs transition-colors hover:bg-forest hover:text-paper"
      >
        Nhắn Zalo tư vấn
      </a>
    </aside>
  )
}
