import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  try {
    // Create an initial response
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If environment variables are missing, don't crash the middleware
    // This prevents 500: MIDDLEWARE_INVOCATION_FAILED errors during deployments
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Middleware: Missing Supabase environment variables")
      return supabaseResponse
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup');
    const isProtectedRoot = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/admin');

    // Redirect unauthenticated from protected routes
    if (isProtectedRoot && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect authenticated away from auth pages
    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    return supabaseResponse
  } catch (e) {
    // If anything fails, return the default response instead of a 500 error
    console.error("Middleware Error:", e)
    return NextResponse.next({
      request,
    })
  }
}
