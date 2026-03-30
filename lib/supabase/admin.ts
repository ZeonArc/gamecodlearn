import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client for server-side operations that don't need user cookies.
 * Uses the service role key for full DB access (e.g., cron jobs, background tasks).
 * Falls back to anon key if service role key isn't set.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
