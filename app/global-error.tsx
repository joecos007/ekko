'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="en">
            <body className="bg-black text-white min-h-screen flex items-center justify-center">
                <div className="text-center space-y-6 p-8 max-w-md">
                    <div className="text-6xl">💿</div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Something went wrong
                    </h1>
                    <p className="text-neutral-400 text-sm">
                        {error.message || 'An unexpected error occurred. Please try again.'}
                    </p>
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    )
}
