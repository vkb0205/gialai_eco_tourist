import { useEffect, useRef, useState } from "react"

type MediaImageProps = {
  src: string | null | undefined
  slug: string
  alt: string
  className?: string
  loading?: "eager" | "lazy"
  decoding?: "async" | "auto" | "sync"
  width?: number
  height?: number
  fetchPriority?: "high" | "low" | "auto"
}

/** Displays a visible error frame when a site-media object is absent or fails. */
export default function MediaImage({
  src,
  slug,
  alt,
  className = "",
  loading = "lazy",
  decoding = "async",
  width,
  height,
  fetchPriority,
}: MediaImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const lastReportedRef = useRef<string | null>(null)
  const missing = !src || failedSrc === src

  useEffect(() => {
    if (!src) {
      if (lastReportedRef.current !== slug) {
        console.error(`[media] Missing image for slug: ${slug}`)
        lastReportedRef.current = slug
      }
      return
    }
    setFailedSrc((current) => (current === src ? current : null))
  }, [src, slug])

  const reportFailure = () => {
    if (lastReportedRef.current !== slug) {
      console.error(`[media] Missing image for slug: ${slug}`)
      lastReportedRef.current = slug
    }
    if (src) setFailedSrc(src)
  }

  if (missing) {
    return (
      <div
        role="img"
        aria-label={`Image unavailable: ${slug}`}
        className={`media-error-frame ${className}`}
      >
        <span>Image unavailable</span>
        <code>{slug}</code>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      width={width}
      height={height}
      fetchPriority={fetchPriority}
      onError={reportFailure}
      className={className}
    />
  )
}
