import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabasePublishableKey = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

/** True when the build has the two public Supabase connection values. */
export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
)

/**
 * Browser-safe Supabase client. The publishable key is intentionally the only
 * key used here; the service-role/secret key must never ship to the browser.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabasePublishableKey!)
  : null
