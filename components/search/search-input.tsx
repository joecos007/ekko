'use client'

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
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
        <div className="relative w-full max-w-xl">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
                <Search className="w-5 h-5" />
            </div>
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="What do you want to play?"
                className="pl-10 h-12 rounded-full bg-neutral-800 border-transparent focus:border-white text-base"
            />
        </div>
    )
}
