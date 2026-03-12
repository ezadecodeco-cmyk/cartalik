import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase Browser Client: Missing environment variables")
    const createMock = () => {
      const mock: any = () => Promise.resolve({ data: null, error: null });
      return new Proxy(mock, {
        get: (target, prop) => {
          if (prop === 'then') return undefined;
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

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
