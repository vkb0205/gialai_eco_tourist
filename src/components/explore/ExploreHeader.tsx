import { useEffect, useRef, useState } from "react"
import { MagnifyingGlass, X } from "@phosphor-icons/react"
import { navigateTo } from "@/lib/useHashRoute"

/**
 * Explore page header: breadcrumb, title, intro and the keyword search.
 * The input keeps a local draft and reports it on a short debounce, so typing
 * does not write a history entry per keystroke while the URL still remains the
 * source of truth (FR-007).
 */

const COMMIT_DELAY_MS = 220

export default function ExploreHeader({
  keyword,
  onKeywordChange,
  catalogueSize,
}: {
  /** Committed keyword, as held in the URL. */
  keyword: string
  onKeywordChange: (value: string) => void
  catalogueSize: number
}) {
  const [draft, setDraft] = useState(keyword)
  // Last value this component pushed upward, used to tell our own echo apart
  // from an external change such as removing the keyword chip or going back.
  const emitted = useRef(keyword)

  useEffect(() => {
    if (keyword !== emitted.current) {
      emitted.current = keyword
      setDraft(keyword)
    }
  }, [keyword])

  useEffect(() => {
    if (draft === emitted.current) return
    const timer = window.setTimeout(() => {
      emitted.current = draft
      onKeywordChange(draft)
    }, COMMIT_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [draft, onKeywordChange])

  const commitNow = () => {
    emitted.current = draft
    onKeywordChange(draft)
  }

  const clear = () => {
    setDraft("")
    emitted.current = ""
    onKeywordChange("")
  }

  return (
    <header className="bg-air pb-8 pt-24 lg:pb-5 lg:pt-[116px]">
      <div className="page-container grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-12">
        <div>
          <nav aria-label="Đường dẫn" className="text-sm font-medium text-subtle">
            <a
              href="#/"
              onClick={(event) => {
                event.preventDefault()
                navigateTo("/")
              }}
              className="inline-flex min-h-11 items-center hover:text-forest"
            >
              Trang chủ
            </a>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span aria-current="page" className="text-ink">
              Khám phá tour
            </span>
          </nav>
          <h1 className="t-h1 explore-title m-0 mt-2 text-ink">
            Khám phá tour
          </h1>
          <p className="t-lead explore-intro m-0 mt-4 max-w-[40rem] text-body">
            {catalogueSize > 0 ? `${catalogueSize} hành trình` : "Các hành trình"}{" "}
            nhóm nhỏ khám phá nhiều vùng miền Việt Nam. Giá hiển thị là giá từ mỗi khách;
            lịch và giá chốt được tư vấn viên xác nhận qua Zalo hoặc điện thoại.
          </p>
        </div>

        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
            commitNow()
          }}
          className="w-full"
        >
          <label htmlFor="explore-search" className="sr-only">
            Tìm hành trình
          </label>
          <div className="flex items-center rounded-button bg-paper pl-5 pr-2 shadow-card focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink">
            <MagnifyingGlass
              size={20}
              className="pointer-events-none shrink-0 text-ink"
              aria-hidden="true"
            />
            <input
              id="explore-search"
              type="search"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Thác nước, chèo thuyền…"
              autoComplete="off"
              maxLength={120}
              className="min-h-14 w-full border-0 bg-transparent px-3 text-base text-ink outline-none placeholder:text-subtle"
            />
            {draft && (
              <button
                type="button"
                onClick={clear}
                aria-label="Xóa từ khóa"
                className="flex size-11 shrink-0 items-center justify-center rounded-full text-ink hover:bg-leaf"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>
        </form>
      </div>
    </header>
  )
}
