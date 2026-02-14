'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
    DrawerTrigger
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Mic, Wand2, Music, Shuffle, X } from "lucide-react"

interface StudioSheetProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children?: React.ReactNode
}

export function StudioSheet({ open, onOpenChange, children }: StudioSheetProps) {
    const [isCustom, setIsCustom] = useState(false)
    const [prompt, setPrompt] = useState("")

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
            <DrawerContent className="bg-neutral-950 border-white/10 text-white h-[85vh] outline-none">
                <div className="mx-auto w-full max-w-md flex flex-col h-full relative">
                    {/* Close Button */}
                    <DrawerClose asChild className="absolute top-4 right-4 z-50">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-neutral-800/50 hover:bg-neutral-800 text-neutral-400">
                            <X className="w-5 h-5" />
                        </Button>
                    </DrawerClose>

                    <DrawerHeader className="pb-2">
                        <DrawerTitle className="text-center text-xl font-bold tracking-tight">Create Song</DrawerTitle>
                        <DrawerDescription className="sr-only">Create a new AI generated song</DrawerDescription>

                        {/* Toggle */}
                        <div className="flex justify-center mt-6 bg-neutral-900 p-1 rounded-full w-fit mx-auto border border-white/5">
                            <button
                                onClick={() => setIsCustom(false)}
                                className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${!isCustom ? 'bg-neutral-800 text-white shadow-lg shadow-black/20' : 'text-neutral-500 hover:text-white'}`}
                            >
                                Simple
                            </button>
                            <button
                                onClick={() => setIsCustom(true)}
                                className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${isCustom ? 'bg-neutral-800 text-white shadow-lg shadow-black/20' : 'text-neutral-500 hover:text-white'}`}
                            >
                                Custom
                            </button>
                        </div>
                    </DrawerHeader>

                    <div className="p-6 flex-1 overflow-y-auto space-y-6">
                        {!isCustom ? (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-base font-bold text-neutral-300">Song Description</Label>
                                    <Textarea
                                        placeholder="Describe the song you want to create (e.g. A synth-pop song about a robot learning to love...)"
                                        className="bg-neutral-900/50 border-neutral-800 min-h-[140px] resize-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 text-base placeholder:text-neutral-600 rounded-xl p-4"
                                        value={prompt}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-xl border border-neutral-800/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                            <Music className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white">Instrumental</span>
                                            <span className="text-xs text-neutral-500">No lyrics/vocals</span>
                                        </div>
                                    </div>
                                    <Switch />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-base font-bold text-neutral-300">Lyrics</Label>
                                        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs font-bold text-orange-400 hover:text-orange-300">
                                            <Wand2 className="w-3 h-3 mr-1" />
                                            Generate
                                        </Button>
                                    </div>
                                    <Textarea
                                        placeholder="[Verse 1]&#10;Enter your own lyrics..."
                                        className="bg-neutral-900/50 border-neutral-800 min-h-[180px] font-mono text-sm resize-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 rounded-xl p-4 placeholder:text-neutral-600"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-bold text-neutral-300">Style of Music</Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Enter style (e.g. Pop, Rock, 80s)"
                                            className="bg-neutral-900/50 border-neutral-800 pr-10 focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 h-12 rounded-xl text-base placeholder:text-neutral-600"
                                        />
                                        <Button size="icon" variant="ghost" className="absolute right-2 top-2 h-8 w-8 text-neutral-500 hover:text-white rounded-lg hover:bg-white/5">
                                            <Shuffle className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-bold text-neutral-300">Title</Label>
                                    <Input
                                        placeholder="Enter a title"
                                        className="bg-neutral-900/50 border-neutral-800 focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 h-12 rounded-xl text-base placeholder:text-neutral-600"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-white/5 bg-neutral-950 pb-8 safe-area-bottom">
                        <Button className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white font-black h-14 text-lg shadow-[0_0_30px_rgba(249,115,22,0.2)] border-0 rounded-full active:scale-95 transition-transform flex items-center justify-center gap-2">
                            <span className="tracking-wide">CREATE</span>
                            <div className="bg-white/20 p-1 rounded-full">
                                <Music className="w-4 h-4 fill-current" />
                            </div>
                        </Button>
                        <div className="flex justify-center mt-4 gap-2 text-[10px] items-center text-neutral-500 font-medium uppercase tracking-widest">
                            <span>0 credits</span>
                            <span className="w-1 h-1 rounded-full bg-neutral-700" />
                            <span className="text-orange-400">Upgrade</span>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
