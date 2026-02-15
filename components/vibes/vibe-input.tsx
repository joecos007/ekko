"use client"

import { usePlayer } from "@/store/player-store"
import { useVibeStore } from "@/store/vibe-store"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Sparkles } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createClient } from "@/utils/supabase/client"

// VibeInput component for social interactions

const REACTIONS = [
    { emoji: "🔥", label: "Fire" },
    { emoji: "💜", label: "Love" },
    { emoji: "😭", label: "Crying" },
    { emoji: "🤯", label: "Mindblown" },
    { emoji: "💃", label: "Dance" },
]

export function VibeInput() {
    const { currentTime, currentIndex, queue, isRadio } = usePlayer()
    const { addVibe } = useVibeStore()
    const [text, setText] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
    const [isSending, setIsSending] = useState(false)
    const currentSong = queue[currentIndex]

    // If Radio, we don't return null anymore, we allow "Simulation" mode or simplified experience
    // if (isRadio) return null

    const handleSend = async () => {
        if (isSending) return
        setIsSending(true)
        console.log("VibeInput: Sending vibe...", { text, selectedEmoji, isRadio, hasSong: !!currentSong })

        // 1. Determine Song ID
        // If Radio or No Song, use "demo-radio" to trigger local demo mode
        const targetSongId = (isRadio || !currentSong) ? "demo-radio" : currentSong.id

        // 2. Determine User ID
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        // If not logged in, use "demo-user"
        const targetUserId = user ? user.id : "demo-user"

        // 3. Prepare Payload
        // If no text and no emoji, send default text. If emoji exists, text is optional.
        const finalText = text || (selectedEmoji ? undefined : "Just vibing! 🎵")

        try {
            await addVibe({
                song_id: targetSongId,
                user_id: targetUserId,
                timestamp: currentTime,
                text: finalText,
                emoji: selectedEmoji || undefined,
                color: "#8b5cf6"
            })
            console.log("VibeInput: Vibe sent successfully")

            // Brief artificial delay to ensure user sees the "sent" state if it was too fast
            await new Promise(r => setTimeout(r, 500))

        } catch (err) {
            console.error("VibeInput: Error sending vibe", err)
        } finally {
            // 4. Reset UI
            setText("")
            setSelectedEmoji(null)
            setIsOpen(false)
            setIsSending(false)
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-400 hover:text-white relative group"
                >
                    <Sparkles className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                    <span className="sr-only">Add Vibe</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent side="top" className="w-80 bg-neutral-900 border-neutral-800 p-4 mb-2">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                            {isRadio ? "Broadcast Vibe (Demo)" : "Share the Vibe"}
                        </span>
                        <span className="text-xs font-mono text-purple-400">@{Math.floor(currentTime)}s</span>
                    </div>

                    {/* Quick Reactions - Now Selectable */}
                    <div className="flex justify-between gap-1">
                        {REACTIONS.map((r) => (
                            <button
                                key={r.label}
                                onClick={() => setSelectedEmoji(prev => prev === r.emoji ? null : r.emoji)}
                                className={`text-2xl transition-all p-2 rounded-full active:scale-95 ${selectedEmoji === r.emoji
                                    ? "bg-purple-500/20 scale-110 shadow-glow-neon-purple border border-purple-500/50"
                                    : "hover:scale-125 hover:bg-white/5 grayscale opacity-70 hover:grayscale-0 hover:opacity-100"
                                    }`}
                                title={r.label}
                            >
                                {r.emoji}
                            </button>
                        ))}
                    </div>

                    {/* Text Input */}
                    <div className="flex gap-2">
                        <Input
                            placeholder={isRadio ? "Radio vibes..." : "Type a thought..."}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (text || selectedEmoji) && !isSending && handleSend()}
                            className="bg-neutral-950 border-neutral-800 text-sm h-9"
                            disabled={isSending}
                        />
                        <Button
                            size="icon"
                            className="h-9 w-9 bg-purple-600 hover:bg-purple-700 text-white shrink-0"
                            onClick={() => handleSend()}
                            disabled={(!text.trim() && !selectedEmoji) || isSending}
                        >
                            {isSending ? (
                                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </div>

                    {isRadio && <p className="text-[10px] text-neutral-500 text-center">Radio mode runs in Demo. Vibes won&apos;t save.</p>}
                </div>
            </PopoverContent>
        </Popover>
    )
}
