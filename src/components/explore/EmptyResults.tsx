import { ArrowCounterClockwise, Binoculars } from "@phosphor-icons/react"
import type { RelaxSuggestion } from "@/lib/filterTours"

/**
 * Zero-result state (FR-011, SC-007).
 *
 * Never a bare "no results". The engine identifies which single filter is
 * costing the most matches, so the traveller is offered one concrete step back
 * plus the blanket reset, and always learns how many packages each would
 * return.
 */
export default function EmptyResults({
  suggestion,
  onRelax,
  onClearAll,
  /** Best single filter to drop, or null when nothing would help. */
}: {
  suggestion: RelaxSuggestion | null
  onRelax: (suggestion: RelaxSuggestion) => void
  onClearAll: () => void
}) {
  return (
    <div className="flex flex-col items-start rounded-[2px] border border-dashed border-[#c8c8be] bg-white px-6 py-14 text-left lg:items-center lg:px-12 lg:text-center">
      <span
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e9e6dd] text-[#42524a]"
      >
        <Binoculars className="h-7 w-7" />
      </span>

      <h2 className="mt-7 font-display text-[30px] leading-[1.1] tracking-[-0.03em] text-[#183024]">
        Chưa có hành trình nào khớp
      </h2>

      <p className="mt-3 max-w-[34rem] text-sm leading-6 text-[#42524a]">
        {suggestion
          ? "Bộ lọc hiện tại hơi hẹp. Bỏ bớt một điều kiện là danh sách mở lại ngay."
          : "Bộ lọc hiện tại không còn hành trình nào. Hãy đặt lại và bắt đầu từ một vùng miền."}
      </p>

      <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        {suggestion && (
          <button
            type="button"
            onClick={() => onRelax(suggestion)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#183024] px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.13em] text-white transition-all duration-200 hover:bg-[#b4502f] hover:shadow-[0_10px_24px_rgba(180,80,47,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
          >
            Bỏ “{suggestion.label}”
            <span className="font-semibold tabular-nums normal-case tracking-normal">
              ({suggestion.resultingCount} hành trình)
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#c8c4b8] px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#183024] transition-all duration-200 hover:border-[#183024] hover:bg-[#f6f3ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d56742]"
        >
          <ArrowCounterClockwise className="h-4 w-4" aria-hidden="true" />
          Xóa tất cả bộ lọc
        </button>
      </div>
    </div>
  )
}
