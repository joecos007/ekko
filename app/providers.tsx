'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())

    useEffect(() => {
        /**
         * Supabase auth uses `navigator.locks.request()` to serialize token
         * refreshes across tabs. When a page navigates away or a component
         * unmounts mid-refresh, the browser aborts the lock with an AbortError.
         * This is expected behavior — NOT a bug — but React's dev overlay
         * surfaces it as an unhandled rejection. We suppress it here.
         */
        const handler = (event: PromiseRejectionEvent) => {
            const err = event.reason
            if (
                err instanceof Error &&
                err.name === 'AbortError' &&
                (err.stack?.includes('locks.ts') ||
                    err.stack?.includes('@supabase/auth-js') ||
                    err.stack?.includes('navigatorLock'))
            ) {
                event.preventDefault()
            }
        }
        window.addEventListener('unhandledrejection', handler)
        return () => window.removeEventListener('unhandledrejection', handler)
    }, [])

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
