/**
 * Loading placeholder for {@link TourCard}.
 *
 * Structure mirrors the real card block for block (same aspect ratio, same
 * paddings, same number of rows) so swapping a skeleton for a card changes no
 * layout box and contributes nothing to CLS (FR-011, SC-005).
 */
export default function TourCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-col overflow-hidden rounded-[2px] bg-[#f0f7f1]"
    >
      <div className="aspect-[4/3] w-full shrink-0 bg-[#e1f0e4] motion-safe:animate-pulse" />

      <div className="flex flex-1 flex-col gap-4 p-5 lg:p-6">
        <div className="h-4 w-2/5 rounded-[2px] bg-[#eaf4ec] motion-safe:animate-pulse" />
        <div className="h-[56px] w-11/12 rounded-[2px] bg-[#eaf4ec] motion-safe:animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded-[2px] bg-white motion-safe:animate-pulse" />
          <div className="h-4 w-3/4 rounded-[2px] bg-white motion-safe:animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-24 rounded-full bg-white motion-safe:animate-pulse" />
          <div className="h-8 w-20 rounded-full bg-white motion-safe:animate-pulse" />
          <div className="h-8 w-24 rounded-full bg-white motion-safe:animate-pulse" />
        </div>
        <div className="mt-auto flex items-end justify-between gap-4 pt-2">
          <div className="space-y-1.5">
            <div className="h-3.5 w-24 rounded-[2px] bg-white motion-safe:animate-pulse" />
            <div className="h-6 w-32 rounded-[2px] bg-[#eaf4ec] motion-safe:animate-pulse" />
          </div>
          <div className="h-11 w-11 rounded-full bg-[#eaf4ec] motion-safe:animate-pulse" />
        </div>
      </div>
    </div>
  )
}
