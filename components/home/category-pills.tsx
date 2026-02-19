'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface CategoryPillsProps {
    categories: string[]
    selected: string
    onSelect: (category: string) => void
}

export function CategoryPills({ categories, selected, onSelect }: CategoryPillsProps) {
    return (
        <ScrollArea className="w-full whitespace-nowrap rounded-none mb-8">
            <div className="flex w-max space-x-2 p-1">
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant="ghost"
                        onClick={() => onSelect(category)}
                        className={cn(
                            "rounded-full px-6 py-2 h-9 text-sm font-medium transition-all duration-300",
                            selected === category
                                ? "bg-white text-black hover:bg-neutral-200"
                                : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
                        )}
                    >
                        {category}
                    </Button>
                ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
    )
}
