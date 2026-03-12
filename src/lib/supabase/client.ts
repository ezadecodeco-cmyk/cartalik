import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase Browser Client: Missing environment variables")
    const mockResult = Promise.resolve({ data: null, error: null });
    const mockQuery: any = {
      select: () => mockQuery,
      insert: () => mockQuery,
      update: () => mockQuery,
      delete: () => mockQuery,
      eq: () => mockQuery,
      order: () => mockQuery,
      single: () => mockResult,
      then: (onfulfilled: any) => mockResult.then(onfulfilled),
    };

    return {
      from: () => mockQuery,
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
      },
    } as any
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
