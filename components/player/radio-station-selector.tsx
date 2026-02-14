"use client"

import { usePlayer, RadioStation } from "@/store/player-store"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Radio, Signal } from "lucide-react"

export function RadioStationSelector() {
    const { stations, currentStation, setStation, isRadio } = usePlayer()

    if (!isRadio) return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 gap-2 px-2 text-xs text-green-400 hover:text-green-300 hover:bg-green-500/10 border border-green-500/20 rounded-full animate-pulse-slow">
                    <Signal className="w-3 h-3" />
                    <span>Live Signal</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56 bg-neutral-900 border-neutral-800 text-white">
                <DropdownMenuLabel className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Select Frequency</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {stations.map((station) => (
                    <DropdownMenuItem
                        key={station.id}
                        onClick={() => setStation(station)}
                        className={`
                            flex items-center gap-3 cursor-pointer p-3 focus:bg-white/10 focus:text-white
                            ${currentStation.id === station.id ? 'bg-green-500/10 text-green-400' : 'text-neutral-300'}
                        `}
                    >
                        <div className={`w-2 h-2 rounded-full ${currentStation.id === station.id ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-neutral-700'}`} />
                        <div className="flex flex-col">
                            <span className="font-bold text-sm leading-none">{station.name}</span>
                            <span className="text-[10px] text-neutral-500 mt-1 leading-none">{station.style}</span>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
