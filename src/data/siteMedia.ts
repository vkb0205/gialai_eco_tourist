import { supabase } from "@/lib/supabase"

const SITE_MEDIA_BUCKET = "site-media"

/** Resolve a site-media object path to its public Supabase Storage URL. */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  if (!supabase) return null

  return supabase.storage.from(SITE_MEDIA_BUCKET).getPublicUrl(path).data.publicUrl
}
