import { Minus, Plus } from "@phosphor-icons/react"

export type PolicyItem = { title: string; body: string }

/** Policy accordions built on native details/summary (keyboard accessible). */
export default function PolicyAccordion({ items }: { items: PolicyItem[] }) {
  return (
    <div className="rounded-card bg-paper px-5 shadow-card md:px-6">
      {items.map((item, index) => (
        <details
          key={item.title}
          open={index === 0}
          className="group border-t border-line first:border-t-0"
        >
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 text-base font-bold text-ink">
            {item.title}
            <Plus size={18} aria-hidden="true" className="shrink-0 group-open:hidden" />
            <Minus size={18} aria-hidden="true" className="hidden shrink-0 group-open:block" />
          </summary>
          <p className="m-0 whitespace-pre-line pb-4 text-[15px] leading-[22px] text-body">
            {item.body}
          </p>
        </details>
      ))}
    </div>
  )
}
