/**
 * Loading placeholder for {@link TourCard}.
 *
 * Structure mirrors the real card block for block — same aspect ratio, same
 * paddings, same number of text rows — so swapping a skeleton for a card
 * changes no layout box and contributes nothing to CLS (FR-011, SC-005).
 */
export default function TourCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-col overflow-hidden rounded-[2px] border border-[#e0dcd2] bg-white"
    >
      <div className="aspect-[1.5/1] w-full shrink-0 bg-[#e4e0d6] motion-safe:animate-pulse" />

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5 lg:px-6 lg:pb-6 lg:pt-6">
        {/* Region and theme line */}
        <div className="h-3 w-2/5 rounded-[2px] bg-[#e9e6dd] motion-safe:animate-pulse" />

        {/* Title, two lines at the card's display size */}
        <div className="mt-3.5 h-[26px] w-11/12 rounded-[2px] bg-[#e9e6dd] motion-safe:animate-pulse" />

        {/* Blurb, three clamped lines */}
        <div className="mt-3 space-y-2">
          <div className="h-3.5 w-full rounded-[2px] bg-[#eeebe3] motion-safe:animate-pulse" />
          <div className="h-3.5 w-full rounded-[2px] bg-[#eeebe3] motion-safe:animate-pulse" />
          <div className="h-3.5 w-3/4 rounded-[2px] bg-[#eeebe3] motion-safe:animate-pulse" />
        </div>

        {/* Attribute row */}
        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#e5e1d8] pt-4">
          <div className="h-4 rounded-[2px] bg-[#eeebe3] motion-safe:animate-pulse" />
          <div className="h-4 rounded-[2px] bg-[#eeebe3] motion-safe:animate-pulse" />
          <div className="h-4 rounded-[2px] bg-[#eeebe3] motion-safe:animate-pulse" />
        </div>

        {/* Price and booking action */}
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#e5e1d8] pt-4">
          <div className="space-y-1.5">
            <div className="h-2.5 w-20 rounded-[2px] bg-[#eeebe3] motion-safe:animate-pulse" />
            <div className="h-4 w-24 rounded-[2px] bg-[#e9e6dd] motion-safe:animate-pulse" />
          </div>
          <div className="h-[38px] w-[132px] rounded-full bg-[#e9e6dd] motion-safe:animate-pulse" />
        </div>
      </div>
    </div>
  )
}
