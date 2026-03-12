import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase Browser Client: Missing environment variables")
    return new Proxy({}, {
      get: () => () => ({ data: null, error: null })
    }) as any
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
