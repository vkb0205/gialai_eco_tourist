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
}: {
  /** Best single filter to drop, or null when nothing would help. */
  suggestion: RelaxSuggestion | null
  onRelax: (suggestion: RelaxSuggestion) => void
  onClearAll: () => void
}) {
  return (
    <div className="flex flex-col items-start rounded-panel bg-sky px-6 py-12 text-left lg:items-center lg:px-12 lg:text-center">
      <span
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-full bg-paper text-ink"
      >
        <Binoculars size={28} />
      </span>

      <h2 className="m-0 mt-6 text-[28px] font-bold leading-[1.25] text-ink">
        Chưa có hành trình nào khớp
      </h2>

      <p className="m-0 mt-3 max-w-[34rem] text-base leading-7 text-body">
        {suggestion
          ? "Bộ lọc hiện tại hơi hẹp. Bỏ bớt một điều kiện là danh sách mở lại ngay."
          : "Bộ lọc hiện tại không còn hành trình nào. Hãy đặt lại và bắt đầu từ một vùng miền."}
      </p>

      <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        {suggestion && (
          <button
            type="button"
            onClick={() => onRelax(suggestion)}
            className="btn-primary !min-h-12 !px-6 !text-[15px]"
          >
            Bỏ “{suggestion.label}”
            <span className="font-medium tabular-nums">
              ({suggestion.resultingCount} hành trình)
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={onClearAll}
          className="btn-outline !min-h-12 !gap-2 !bg-paper !px-6 !text-[15px] hover:!bg-leaf"
        >
          <ArrowCounterClockwise size={16} aria-hidden="true" />
          Xóa tất cả bộ lọc
        </button>
      </div>
    </div>
  )
}
