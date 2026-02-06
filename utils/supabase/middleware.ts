import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes
    const protectedPaths = ['/home', '/library', '/liked', '/playlist', '/search']
    const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))

    // Auth routes (redirect if logged in)
    const authPaths = ['/login', '/signup']
    const isAuthPage = authPaths.some(path => request.nextUrl.pathname.startsWith(path))

    // 1. Unauthenticated user trying to access protected route -> Redirect to Login
    if (!user && isProtected) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 2. Authenticated user trying to access Auth pages or Landing page (root) -> Redirect to Home
    if (user && (isAuthPage || request.nextUrl.pathname === '/')) {
        const url = request.nextUrl.clone()
        url.pathname = '/home'
        return NextResponse.redirect(url)
    }

    return response
}
