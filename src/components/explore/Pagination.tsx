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
  onPageChange,
}: PaginationProps) {
  const items = buildPageItems(currentPage, pageCount)

  const pageButton = (active: boolean) =>
    `inline-flex h-12 min-w-12 items-center justify-center rounded-button border px-3 text-[15px] font-bold tabular-nums transition-colors ${
      active
        ? "border-forest bg-forest text-paper"
        : "border-ink/20 bg-paper text-ink hover:bg-leaf"
    }`

  const arrowButton =
    "inline-flex size-12 items-center justify-center rounded-button border border-ink/20 bg-paper text-ink transition-colors hover:bg-leaf disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-subtle"

  return (
    <div className="mt-10 flex justify-center">
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
              className="px-1 text-[15px] text-subtle"
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
