import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const rawNext = searchParams.get('next') ?? '/home'
    // Validate redirect path to prevent open redirect attacks
    const next = (rawNext.startsWith('/') && !rawNext.startsWith('//') && !rawNext.includes('://')) ? rawNext : '/home'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Check if this is a recovery (reset password) flow
            const type = searchParams.get('type')
            const finalRedirect = type === 'recovery' ? '/reset-password' : next

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${finalRedirect}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${finalRedirect}`)
            } else {
                return NextResponse.redirect(`${origin}${finalRedirect}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?message=Could not login with provider`)
}
