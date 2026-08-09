import { useEffect, useRef, useState } from "react"
import { MagnifyingGlass, X } from "@phosphor-icons/react"
import { regions } from "@/data/regions"

/**
 * Explore page masthead: a compact photographic band centred on the keyword
 * search bar, with a short eyebrow and headline above it.
 *
 * The band is an overflow-hidden photograph with the landing hero's layered
 * forest-green scrim and film-grain overlay. It stays deliberately short so
 * the search — the page's main tool — sits high and instantly visible.
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
    <header className="relative isolate overflow-hidden">
      {/* Photographic band with the landing hero's layered forest scrim. */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={regions[5].image}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        {/* Left-to-right depth, same linear scrim as the landing hero. */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,31,23,0.94)_0%,rgba(15,42,30,0.68)_46%,rgba(15,42,30,0.13)_100%)]" />
        {/* Vertical grounding, same 0deg scrim as the landing hero. */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,26,19,0.78)_0%,transparent_45%,rgba(8,26,19,0.25)_100%)]" />
      </div>

      {/* Film-grain overlay for a physical, expensive paper feel. */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-noise opacity-[0.035] mix-blend-overlay" />

      {/* Compact masthead built around the search bar. */}
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-6 pb-12 pt-28 text-center lg:px-12 lg:pb-14 lg:pt-32">
        <div className="motion-safe:animate-[rise-in_700ms_cubic-bezier(0.32,0.72,0,1)_both]">
          {/* <p className="m-0 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-[#f2b08e]">
            Tuyển tập hành trình · {catalogueSize} chuyến đi
          </p> */}
          {/* <h1 className="mt-3 m-0 font-display text-[clamp(1.9rem,5vw,3.5rem)] leading-[1] tracking-[-0.045em] text-white motion-safe:animate-[rise-in_700ms_cubic-bezier(0.32,0.72,0,1)_120ms_both]">
            Khám phá hành trình
          </h1> */}
        </div>

        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
            commitNow()
          }}
          className="w-full max-w-[34rem] motion-safe:animate-[rise-in_700ms_cubic-bezier(0.32,0.72,0,1)_220ms_both]"
        >
          <label htmlFor="explore-search" className="sr-only">
            Tìm hành trình
          </label>
          {/* Double-bezel search: hairline glass shell holding a white core. */}
          <div className="rounded-[1.4rem] bg-white/10 p-1.5 shadow-[0_18px_40px_rgba(10,25,17,0.35)] ring-1 ring-white/20 backdrop-blur-md">
            <div className="flex items-center rounded-[1.05rem] bg-white/95 py-1 pl-4 pr-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] focus-within:ring-1 focus-within:ring-[#f2b08e]/70">
              <MagnifyingGlass
                className="pointer-events-none h-[20px] w-[20px] shrink-0 text-[#69746b]"
                aria-hidden="true"
              />
              <input
                id="explore-search"
                type="search"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Thác nước, chèo thuyền, Hà Giang…"
                autoComplete="off"
                maxLength={120}
                className="w-full border-0 bg-transparent px-3 py-3 text-[16px] text-[#183024] outline-none placeholder:text-[#a5aba5]"
              />
              {draft && (
                <button
                  type="button"
                  onClick={clear}
                  aria-label="Xóa từ khóa"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#69746b] transition-colors hover:bg-[#e9e6dd] hover:text-[#183024] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d56742]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </header>
  )
}
