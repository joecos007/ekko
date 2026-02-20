import { createBrowserClient } from '@supabase/ssr'
import type { LockFunc } from '@supabase/auth-js'

let client: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
    if (client) return client

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        throw new Error(
            'Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.'
        )
    }

    client = createBrowserClient(
        supabaseUrl,
        supabaseKey,
        {
            auth: {
                /**
                 * Bypass navigator.locks.request() which throws an AbortError
                 * when the browser aborts an in-flight token refresh during
                 * page navigation. Token refreshes still work correctly via
                 * Supabase's internal debouncing; we just skip the cross-tab
                 * browser lock that causes unhandleable promise rejections.
                 */
                lock: ((_name, _acquireTimeout, fn) => fn()) as LockFunc,
            },
        }
    )

    return client
}
