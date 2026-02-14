'use client'

import { Input } from "@/components/ui/input"
import { Sparkles } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"

export function SearchInput() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get("q") || ""
    const [value, setValue] = useState(initialQuery)
    const debouncedValue = useDebounce(value, 500)

    useEffect(() => {
        if (!debouncedValue) {
            router.push('/search')
        } else {
            router.push(`/search?q=${encodeURIComponent(debouncedValue)}`)
        }
    }, [debouncedValue, router])

    return (
        <div className="relative w-full max-w-2xl group mx-auto">
            {/* AI Icon */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none z-10">
                <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>

            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask the system..."
                className="pl-14 h-14 rounded-full bg-black/40 border-purple-500/20 focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 text-base shadow-[0_0_20px_rgba(168,85,247,0.1)] focus:shadow-[0_0_30px_rgba(168,85,247,0.3)] backdrop-blur-xl transition-all duration-300 text-white placeholder:text-neutral-600 font-medium"
            />

            {/* Endcap decoration */}
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="text-[10px] uppercase tracking-widest text-neutral-600 font-mono group-hover:text-purple-500/50 transition-colors">CMD // SEARCH</span>
            </div>
        </div>
    )
}
