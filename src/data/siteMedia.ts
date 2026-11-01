import { supabase } from "@/lib/supabase"

/** The project's existing public bucket for homepage and tour images. */
const SITE_MEDIA_BUCKET = "public-media"

export type HeroBanner = {
  /** Object path inside the bucket. */
  path: string
  alt: string
  /** Intrinsic size of the uploaded file, used to reserve layout space. */
  width: number
  height: number
}

/** The festival banner uploaded by scripts/upload-site-media.sh. */
export const festivalBanner: HeroBanner = {
  path: "homepage/festival-cong-chieng-2026.webp",
  alt: "Festival Cồng Chiêng, Tuần lễ Hoa Dã Quỳ núi lửa Chư Đăng Ya năm 2026, từ 30 tháng 10 đến 8 tháng 11 năm 2026 tại Quảng trường Đại Đoàn Kết, Gia Lai",
  width: 2835,
  height: 1418,
}

/** Public URL of a site-media object, or null when Supabase is not configured. */
export function siteMediaUrl(path: string): string | null {
  if (!supabase) return null
  return supabase.storage.from(SITE_MEDIA_BUCKET).getPublicUrl(path).data
    .publicUrl
}
