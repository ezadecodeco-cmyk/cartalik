import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return a silent mock client if configuration is missing
  // This prevents DNS/Fetch failures during builds or when keys are not yet set
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase Server Client: Missing environment variables")
    
    // Create a Proxy that returns resolving promises for any method call
    // This allows the app to "run" without crashing, even if data is missing
    return new Proxy({}, {
      get: (target, prop) => {
        // Handle common chainable methods
        if (['from', 'select', 'insert', 'update', 'delete', 'eq', 'order', 'single', 'storage'].includes(prop as string)) {
          return () => new Proxy({}, { get: () => () => Promise.resolve({ data: null, error: null }) });
        }
        // Handle auth and basic methods
        return () => Promise.resolve({ data: { user: null }, error: null });
      }
    }) as any
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
