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
    
    // Create a robust mock that mimics Supabase's structure
    // This prevents crashes when the app tries to destructure results like { data, error }
    const mockResult = Promise.resolve({ data: null, error: null, count: 0 });
    const mockQuery: any = {
      select: () => mockQuery,
      insert: () => mockQuery,
      update: () => mockQuery,
      delete: () => mockQuery,
      upsert: () => mockQuery,
      eq: () => mockQuery,
      neq: () => mockQuery,
      gt: () => mockQuery,
      lt: () => mockQuery,
      order: () => mockQuery,
      limit: () => mockQuery,
      single: () => mockResult,
      maybeSingle: () => mockResult,
      then: (onfulfilled: any) => mockResult.then(onfulfilled),
    };

    const mockClient = {
      from: () => mockQuery,
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
      },
      storage: {
        from: () => ({
          upload: () => mockResult,
          download: () => mockResult,
          list: () => Promise.resolve({ data: [], error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    };

    return mockClient as any
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
