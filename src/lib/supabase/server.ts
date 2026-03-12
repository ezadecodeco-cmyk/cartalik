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
    
    // Create a robust Proxy that handles nested calls like .auth.getUser()
    // and chainable calls like .from().select().eq()
    const createMock = () => {
      const mock: any = () => Promise.resolve({ data: null, error: null });
      return new Proxy(mock, {
        get: (target, prop) => {
          if (prop === 'then') return undefined; // Avoid blocking promises
          if (prop === 'auth') return {
            signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
            getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            signOut: () => Promise.resolve({ error: null }),
          };
          return createMock();
        }
      });
    };

    return createMock() as any
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
