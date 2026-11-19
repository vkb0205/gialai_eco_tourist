/**
 * Loading placeholder for the shared tour card.
 *
 * Structure mirrors the real card (same padding, image ratio and row count) so
 * swapping a skeleton for a card shifts no layout (FR-011, SC-005).
 */
export default function TourCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-col rounded-card bg-paper p-2 shadow-card xl:h-[480px]"
    >
      <div className="aspect-[384/216] w-full rounded-photo bg-leaf motion-safe:animate-pulse" />
      <div className="flex flex-1 flex-col p-4">
        <div className="h-8 w-[136px] rounded-button bg-leaf motion-safe:animate-pulse" />
        <div className="mt-4 h-4 w-2/5 rounded-field bg-leaf motion-safe:animate-pulse" />
        <div className="mt-2 h-[60px] w-11/12 rounded-field bg-leaf motion-safe:animate-pulse" />
        <div className="mt-3 h-4 w-3/4 rounded-field bg-leaf motion-safe:animate-pulse" />
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-[19px]">
          <div className="h-6 w-36 rounded-field bg-leaf motion-safe:animate-pulse" />
          <div className="h-5 w-16 rounded-field bg-leaf motion-safe:animate-pulse" />
        </div>
      </div>
    </div>
  )
}
