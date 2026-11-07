import { useEffect, useRef, useState } from "react"
import PageBackdrop from "@/components/layout/PageBackdrop"
import { MagnifyingGlass, X } from "@phosphor-icons/react"

/**
 * Explore page masthead: a photographic band with the title and a plain
 * sentence on the left and the keyword search on the right, on one flat scrim.
 * The input keeps a local draft and reports it on a short debounce, so typing
 * does not write a history entry per keystroke while the URL still remains the
 * source of truth (FR-007).
 */

const COMMIT_DELAY_MS = 220

export default function ExploreHeader({
  keyword,
  onKeywordChange,
  catalogueSize,
  /** Committed keyword, as held in the URL. */
}: {
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
    <header className="relative isolate overflow-hidden bg-[#e1f2f8]">
      {/* Photograph with one flat scrim, kept light enough to stay a picture. */}
      <PageBackdrop />
      <div className="mx-auto grid max-w-[1440px] items-end gap-10 px-6 pb-10 pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-16 lg:px-12 lg:pb-12 lg:pt-36">
        <div className="motion-safe:animate-[rise-in_700ms_cubic-bezier(0.32,0.72,0,1)_both]">
          <h1 className="m-0 font-display text-[clamp(2.2rem,5vw,4rem)] font-medium leading-[1] tracking-[-0.04em] text-[#15602b]">
            Khám phá hành trình
          </h1>
          <p className="m-0 mt-6 max-w-[34rem] text-lg leading-7 text-[#183024]">
            {catalogueSize > 0 ? `${catalogueSize} chuyến đi` : "Các chuyến đi"}{" "}
            qua Gia Lai và Tây Nguyên. Lọc theo vùng, số ngày hoặc mức giá để
            tìm chuyến hợp với bạn.
          </p>
        </div>

        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
            commitNow()
          }}
          className="w-full motion-safe:animate-[rise-in_700ms_cubic-bezier(0.32,0.72,0,1)_220ms_both]"
        >
          <label htmlFor="explore-search" className="sr-only">
            Tìm hành trình
          </label>
          <div className="flex items-center rounded-full bg-[#f0f7f1] pl-5 pr-2 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white">
            <MagnifyingGlass
              className="pointer-events-none h-5 w-5 shrink-0 text-[#183024]"
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
              className="min-h-14 w-full border-0 bg-transparent px-3 text-[17px] text-[#183024] outline-none placeholder:text-[#4f5b53]"
            />
            {draft && (
              <button
                type="button"
                onClick={clear}
                aria-label="Xóa từ khóa"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#183024] transition-colors hover:bg-[#eaf4ec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183024]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </form>
      </div>
    </header>
  )
}
