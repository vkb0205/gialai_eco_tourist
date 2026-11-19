import { useEffect, useState } from "react"

export type SectionTab = { id: string; label: string }

/** Sticky in-page tabs; the tab of the section in view is highlighted. */
export default function SectionTabs({
  tabs,
  mobileTabs,
}: {
  tabs: SectionTab[]
  mobileTabs: SectionTab[]
}) {
  const [current, setCurrent] = useState(tabs[0]?.id ?? "")

  useEffect(() => {
    const onScroll = () => {
      const desktop = window.innerWidth >= 1280
      const activeTabs = desktop ? tabs : mobileTabs
      const threshold = desktop ? 176 : 152
      let found = activeTabs[0]?.id ?? ""
      for (const tab of activeTabs) {
        const element = document.getElementById(tab.id)
        if (element && element.getBoundingClientRect().top <= threshold) found = tab.id
      }
      setCurrent(found)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [tabs, mobileTabs])

  const renderTabs = (items: SectionTab[], mobile = false) => (
    <ul className={`scrollbar-hide m-0 flex w-max list-none items-center gap-1 overflow-x-auto rounded-button bg-paper p-2 shadow-card xl:p-1.5 ${mobile ? "max-w-full" : ""}`}>
      {items.map((tab) => (
        <li key={tab.id} className="shrink-0">
          <a
            href={`#${tab.id}`}
            onClick={(event) => {
              event.preventDefault()
              document.getElementById(tab.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
              setCurrent(tab.id)
            }}
            aria-current={current === tab.id ? "true" : undefined}
            className={`flex min-h-12 items-center justify-center rounded-button px-4 text-[13px] font-semibold leading-5 xl:min-h-11 md:px-5 md:text-[15px] ${
              current === tab.id ? "bg-forest text-paper" : "text-body hover:bg-leaf"
            } ${mobile ? "min-w-[108px]" : ""}`}
          >
            {tab.label}
          </a>
        </li>
      ))}
    </ul>
  )

  return (
    <nav
      aria-label="Các phần của tour"
      className="sticky top-[72px] z-30 -mx-4 w-[calc(100%+32px)] bg-paper px-4 py-0 backdrop-blur-sm xl:top-[88px] xl:mx-0 xl:w-auto xl:bg-transparent xl:px-0"
    >
      <div className="xl:hidden">{renderTabs(mobileTabs, true)}</div>
      <div className="hidden xl:block">{renderTabs(tabs)}</div>
    </nav>
  )
}
