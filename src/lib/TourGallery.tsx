import { useEffect, useRef, useState } from "react"
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react"
import MediaImage from "@/lib/MediaImage"
import type { TourGalleryImage } from "@/data/toursRepository"

export default function TourGallery({
  images,
  destinations,
}: {
  images: TourGalleryImage[]
  destinations: string[]
}) {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const count = images.length
  const current = images[active] ?? images[0]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const step = (delta: number) => setActive((index) => (index + delta + count) % count)
  const launch = (index: number, opener: HTMLElement) => {
    openerRef.current = opener
    setActive(index)
    setOpen(true)
  }
  const finishClose = () => {
    setOpen(false)
    requestAnimationFrame(() => openerRef.current?.focus())
  }

  const openButton = (image: TourGalleryImage, index: number, className: string) => (
    <button
      key={image.path ?? `${image.slug}-${index}`}
      type="button"
      onClick={(event) => launch(index, event.currentTarget)}
      aria-label={`Open image ${index + 1}: ${image.alt}`}
      className={`group relative block min-w-0 overflow-hidden bg-leaf focus-visible:z-10 ${className}`}
    >
      <MediaImage
        src={image.src}
        slug={image.slug}
        alt={image.alt}
        loading={index === 0 ? "eager" : "lazy"}
        fetchPriority={index === 0 ? "high" : undefined}
        className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
      />
      <span className="absolute inset-x-3 bottom-3 hidden max-w-[calc(100%-24px)] truncate rounded-button bg-paper/95 px-3 py-2 text-left text-[12px] font-medium leading-[18px] text-ink shadow-card md:block">
        {image.alt}
      </span>
    </button>
  )

  if (!current) return null
  const otherImages = images.map((image, index) => ({ image, index })).filter(({ index }) => index !== active)

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 md:h-[480px] md:grid-cols-[minmax(0,1.556fr)_minmax(0,0.5fr)_minmax(0,0.5fr)] md:grid-rows-2 md:gap-4">
        <div className="relative col-span-3 aspect-[358/224] min-h-0 overflow-hidden rounded-card md:col-span-1 md:row-span-2 md:aspect-auto md:rounded-panel">
          {openButton(current, active, "size-full")}
          {count > 1 && (
            <>
              <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="absolute left-3 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-button bg-paper text-ink shadow-card">
                <CaretLeft size={20} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next image" className="absolute right-3 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-button bg-paper text-ink shadow-card">
                <CaretRight size={20} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
        {otherImages.slice(0, 3).map(({ image, index }, tileIndex) => {
          const placement = tileIndex === 0
            ? "md:col-start-2 md:col-span-2 md:row-start-1"
            : tileIndex === 1
              ? "md:col-start-2 md:row-start-2"
              : "md:col-start-3 md:row-start-2"
          return openButton(image, index, `aspect-[112/80] rounded-photo md:aspect-auto md:rounded-panel ${placement}`)
        })}
      </div>
      {destinations.length > 0 && (
        <p className="m-0 mt-3 text-[11px] font-medium leading-[17px] text-subtle md:hidden">
          {destinations.join(" · ")}
        </p>
      )}
      <dialog
        ref={dialogRef}
        aria-label="Tour photo gallery"
        onClose={() => {
          setOpen(false)
          requestAnimationFrame(() => openerRef.current?.focus())
        }}
        onCancel={(event) => {
          event.preventDefault()
          setOpen(false)
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) finishClose()
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") step(-1)
          if (event.key === "ArrowRight") step(1)
        }}
        className="m-auto h-dvh max-h-none w-screen max-w-none border-0 bg-night/95 p-0 text-paper backdrop:bg-night/95"
      >
        <div className="relative flex h-full flex-col items-center justify-center gap-4 p-4 md:p-10">
          <button type="button" onClick={finishClose} aria-label="Close gallery" className="absolute right-4 top-4 flex size-12 items-center justify-center rounded-button bg-paper text-ink">
            <X size={22} aria-hidden="true" />
          </button>
          <MediaImage src={current.src} slug={current.slug} alt={current.alt} className="max-h-[76dvh] max-w-full rounded-photo object-contain" />
          <p className="m-0 max-w-3xl text-center text-sm leading-6" aria-live="polite">
            {active + 1} / {count} · {current.alt}
          </p>
          {count > 1 && (
            <div className="flex gap-3">
              <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="flex size-12 items-center justify-center rounded-button bg-paper text-ink"><CaretLeft size={20} aria-hidden="true" /></button>
              <button type="button" onClick={() => step(1)} aria-label="Next image" className="flex size-12 items-center justify-center rounded-button bg-paper text-ink"><CaretRight size={20} aria-hidden="true" /></button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  )
}
