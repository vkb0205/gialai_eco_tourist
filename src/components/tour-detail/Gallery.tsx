import { useEffect, useRef, useState } from "react"
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react"

export type GalleryImage = {
  src: string
  alt: string
  credit?: { label: string; href: string }
}

/** Responsive photo mosaic; each image appears once and opens the lightbox. */
export default function Gallery({
  images,
  destinations,
}: {
  images: GalleryImage[]
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

  if (count === 0) return null

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

  const openButton = (
    image: GalleryImage,
    index: number,
    className: string,
    caption = image.alt,
  ) => (
    <button
      key={image.src}
      type="button"
      onClick={(event) => launch(index, event.currentTarget)}
      aria-label={`Mở ảnh ${index + 1}: ${image.alt}`}
      className={`group relative block min-w-0 overflow-hidden bg-leaf focus-visible:z-10 ${className}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading={index === 0 ? "eager" : "lazy"}
        fetchPriority={index === 0 ? "high" : undefined}
        decoding="async"
        className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
      />
      <span className="absolute inset-x-3 bottom-3 hidden max-w-[calc(100%-24px)] truncate rounded-button bg-paper/95 px-3 py-2 text-left text-[12px] font-medium leading-[18px] text-ink shadow-card md:block">
        {caption}
      </span>
    </button>
  )

  const otherImages = images
    .map((image, index) => ({ image, index }))
    .filter(({ index }) => index !== active)

  return (
    <div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-4 md:h-[480px] md:grid-cols-[minmax(0,1.556fr)_minmax(0,0.5fr)_minmax(0,0.5fr)] md:grid-rows-2 md:gap-4">
        <div className="relative col-span-3 aspect-[358/224] min-h-0 overflow-hidden rounded-card md:col-span-1 md:row-span-2 md:aspect-auto md:rounded-panel">
          {openButton(current, active, "size-full")}
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Ảnh trước"
                className="absolute left-3 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-button bg-paper text-ink shadow-card md:left-4"
              >
                <CaretLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Ảnh sau"
                className="absolute right-3 top-1/2 z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-button bg-paper text-ink shadow-card md:right-4"
              >
                <CaretRight size={20} aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {otherImages.map(({ image, index }, tileIndex) => {
          const placement = tileIndex === 0
            ? "md:col-start-2 md:col-span-2 md:row-start-1"
            : tileIndex === 1
              ? "md:col-start-2 md:row-start-2"
              : tileIndex === 2
                ? "md:col-start-3 md:row-start-2"
                : ""
          return openButton(
            image,
            index,
            `aspect-[112/80] rounded-photo md:aspect-auto md:rounded-panel ${placement}`,
            tileIndex === otherImages.length - 1 && count > 1
              ? `${image.alt.replace(/ Pleiku$/i, "")} · Xem ${count} ảnh ↗`
              : image.alt,
          )
        })}
      </div>

      {destinations.length > 0 && (
        <p className="m-0 mt-3 text-[11px] font-medium leading-[17px] text-subtle md:hidden">
          {destinations.join(" · ")}
        </p>
      )}
      <dialog
        ref={dialogRef}
        aria-label="Thư viện ảnh"
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
          if (event.key === "ArrowLeft") {
            event.preventDefault()
            step(-1)
          }
          if (event.key === "ArrowRight") {
            event.preventDefault()
            step(1)
          }
        }}
        className="m-auto h-dvh max-h-none w-screen max-w-none border-0 bg-night/95 p-0 text-paper backdrop:bg-night/95"
      >
        <div className="relative flex h-full flex-col items-center justify-center gap-4 p-4 md:p-10">
          <button type="button" onClick={finishClose} aria-label="Đóng thư viện ảnh" className="absolute right-4 top-4 flex size-12 items-center justify-center rounded-button bg-paper text-ink">
            <X size={22} aria-hidden="true" />
          </button>
          <img src={current.src} alt={current.alt} className="max-h-[76dvh] max-w-full rounded-photo object-contain" />
          <p className="m-0 max-w-3xl text-center text-sm leading-6" aria-live="polite">
            {active + 1} / {count} · {current.alt}
            {current.credit && (
              <>
                <br />
                <a href={current.credit.href} target="_blank" rel="noreferrer noopener" className="underline underline-offset-2">{current.credit.label}</a>
              </>
            )}
          </p>
          {count > 1 && (
            <div className="flex gap-3">
              <button type="button" onClick={() => step(-1)} aria-label="Ảnh trước" className="flex size-12 items-center justify-center rounded-button bg-paper text-ink">
                <CaretLeft size={20} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Ảnh sau" className="flex size-12 items-center justify-center rounded-button bg-paper text-ink">
                <CaretRight size={20} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  )
}
