import { CaretLeft, CaretRight } from "@phosphor-icons/react"

interface PageItemPage {
  type: "page"
  page: number
}
interface PageItemEllipsis {
  type: "ellipsis"
}
type PageItem = PageItemPage | PageItemEllipsis

/**
 * Collapse a large page range into a stable window: first, last, and the
 * current page plus its neighbours, with ellipses filling the gaps.
 */
function buildPageItems(current: number, count: number): PageItem[] {
  if (count <= 7) {
    return Array.from({ length: count }, (_, index) => ({
      type: "page" as const,
      page: index + 1,
    }))
  }

  const pages = new Set([1, count, current - 1, current, current + 1])
  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= count)
    .sort((a, b) => a - b)

  const items: PageItem[] = []
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      items.push({ type: "ellipsis" })
    }
    items.push({ type: "page", page })
  })
  return items
}

type PaginationProps = {
  currentPage: number
  pageCount: number
  firstVisible: number
  lastVisible: number
  total: number
  onPageChange: (page: number) => void
}

/**
 * Numbered pagination for long result sets (FR-018). Rendered only when more
 * than one page exists; the page index lives in ExplorePage so filter changes
 * can reset it.
 */
export default function Pagination({
  currentPage,
  pageCount,
  firstVisible,
  lastVisible,
  total,
  onPageChange,
}: PaginationProps) {
  const items = buildPageItems(currentPage, pageCount)

  const pageButton = (active: boolean) =>
    `inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-[15px] font-semibold tabular-nums transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024] ${
      active
        ? "bg-[#1f7a3a] text-white"
        : "bg-[#f0f7f1] text-[#183024] hover:bg-[#e1f0e4]"
    }`

  const arrowButton =
    "inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f0f7f1] text-[#183024] transition-colors hover:bg-[#e1f0e4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024] disabled:cursor-not-allowed disabled:bg-[#e1f0e4] disabled:text-[#4f5b53] disabled:hover:bg-[#e1f0e4]"

  return (
    <div className="mt-14 flex flex-col items-center gap-4">
      <p className="m-0 text-[15px] text-[#2f3d35]">
        Đang xem {firstVisible}–{lastVisible} trên {total} hành trình
      </p>

      <nav aria-label="Phân trang" className="flex items-center gap-2">
        <button
          type="button"
          className={arrowButton}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Trang trước"
        >
          <CaretLeft className="h-4 w-4" aria-hidden="true" />
        </button>

        {items.map((item, index) =>
          item.type === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="px-1 text-[15px] text-[#4f5b53]"
            >
              …
            </span>
          ) : (
            <button
              key={item.page}
              type="button"
              className={pageButton(item.page === currentPage)}
              onClick={() => onPageChange(item.page)}
              aria-current={item.page === currentPage ? "page" : undefined}
              aria-label={`Trang ${item.page}`}
            >
              {item.page}
            </button>
          ),
        )}

        <button
          type="button"
          className={arrowButton}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === pageCount}
          aria-label="Trang sau"
        >
          <CaretRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </nav>
    </div>
  )
}
