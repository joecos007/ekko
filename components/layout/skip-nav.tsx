'use client'

export function SkipNav() {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-none focus:bg-ekko-500 focus:text-white focus:font-bold focus:text-sm focus:shadow-xl focus:outline-none"
        >
            Skip to main content
        </a>
    )
}
