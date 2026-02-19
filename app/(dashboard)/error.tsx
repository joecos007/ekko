'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Dashboard error:', error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-neutral-400 text-sm max-w-md mb-8">
                An unexpected error occurred. This has been logged and we&apos;ll look into it.
            </p>
            <div className="flex items-center gap-3">
                <Button
                    onClick={reset}
                    className="bg-ekko-500 hover:bg-ekko-400 text-white rounded-full px-6"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                </Button>
                <Link href="/home">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-full px-6">
                        <Home className="w-4 h-4 mr-2" />
                        Go Home
                    </Button>
                </Link>
            </div>
        </div>
    )
}
