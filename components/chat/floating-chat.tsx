"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Send, X, Users, MessageSquare, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
    id: string
    created_at: string
    content: string
    user_id: string
    profiles?: {
        full_name: string | null
        avatar_url: string | null
    }
}

export function FloatingChat() {
    const supabase = createClient()
    const { user } = useUser()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [onlineCount, setOnlineCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Presence & Realtime
    useEffect(() => {
        if (!user) return

        // 1. Fetch initial messages
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select(`
                    *,
                    profiles (
                        full_name,
                        avatar_url
                    )
                `)
                .order('created_at', { ascending: true })
                .limit(50)

            if (!error && data) {
                setMessages(data as any)
            }
            setLoading(false)
        }
        fetchMessages()

        // 2. Subscribe to new messages
        const messageSubscription = supabase
            .channel('public:messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages'
            }, async (payload: any) => {
                // Fetch profile for the new message
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('full_name, avatar_url')
                    .eq('id', payload.new.user_id)
                    .single()

                const newMessageObj = {
                    ...payload.new,
                    profiles: profileData
                } as Message

                setMessages(prev => [...prev, newMessageObj])
            })
            .subscribe()

        // 3. Presence
        const presenceChannel = supabase.channel('online-users', {
            config: {
                presence: {
                    key: user.id,
                },
            },
        })

        presenceChannel
            .on('presence', { event: 'sync' }, () => {
                const state = presenceChannel.presenceState()
                setOnlineCount(Object.keys(state).length)
            })
            .on('presence', { event: 'join' }, () => {
                // no-op
            })
            .on('presence', { event: 'leave' }, () => {
                // no-op
            })
            .subscribe(async (status: any) => {
                if (status === 'SUBSCRIBED') {
                    await presenceChannel.track({
                        online_at: new Date().toISOString(),
                    })
                }
            })

        return () => {
            messageSubscription.unsubscribe()
            presenceChannel.unsubscribe()
        }
    }, [user, supabase])

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [messages, isOpen])

    const sendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!newMessage.trim() || !user) return

        const content = newMessage.trim()
        setNewMessage("")

        const { error } = await supabase
            .from('messages')
            .insert({
                content,
                user_id: user.id
            })

        if (error) {
            console.error("Error sending message:", error)
        }
    }

    const isAlone = onlineCount <= 1

    if (!user) return null

    return (
        <div className="fixed bottom-[160px] right-4 md:bottom-28 md:right-8 z-[100] font-geist-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={cn(
                            "bg-neutral-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col z-[110]",
                            // Mobile: Full Screen Fixed
                            "fixed inset-0 z-[200] rounded-none sm:rounded-none sm:inset-auto",
                            // Desktop: Anchored Popover
                            "sm:fixed sm:bottom-[calc(80px+2rem)] sm:right-8 sm:w-[380px] sm:h-[600px] md:bottom-28"
                        )}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-none bg-ekko-500/10 text-ekko-400">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">Community</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            isAlone ? "bg-neutral-600" : "bg-ekko-500 animate-pulse"
                                        )} />
                                        <span className="text-[10px] text-neutral-400 font-medium">
                                            {isAlone ? "Only you are here" : `${onlineCount} members online`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-white/10">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-hidden relative">
                            <ScrollArea className="h-full p-4" ref={scrollRef}>
                                <div className="space-y-4">
                                    {loading ? (
                                        <div className="flex items-center justify-center py-20">
                                            <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="text-center py-20 space-y-2 opacity-40">
                                            <MessageCircle className="w-8 h-8 text-neutral-500 mx-auto" />
                                            <p className="text-xs text-neutral-500">Silence is golden.</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={cn(
                                                    "flex flex-col gap-1",
                                                    msg.user_id === user.id ? "items-end" : "items-start"
                                                )}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {msg.user_id !== user.id && (
                                                        <span className="text-[10px] font-bold text-neutral-500 px-1">
                                                            {msg.profiles?.full_name || "Guest"}
                                                        </span>
                                                    )}
                                                </div>
                                                <div
                                                    className={cn(
                                                        "px-3 py-2 rounded-none text-[11px] max-w-[85%] break-words leading-relaxed",
                                                        msg.user_id === user.id
                                                            ? "bg-ekko-500 text-white rounded-tr-none shadow-lg shadow-ekko-500/10"
                                                            : "bg-white/5 text-neutral-300 border border-white/5 rounded-tl-none"
                                                    )}
                                                >
                                                    {msg.content}
                                                </div>
                                                <span
                                                    className="text-[8px] text-neutral-600 font-medium px-1"
                                                    suppressHydrationWarning
                                                >
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Input or Offline Alert */}
                        <div className="p-4 bg-black/40 border-t border-white/5">
                            {isAlone ? (
                                <div className="text-center py-2 space-y-1">
                                    <p className="text-[10px] text-neutral-500 font-medium italic">
                                        Type messages once others join the lounge.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={sendMessage} className="flex gap-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Share something with the lounge..."
                                        className="bg-white/5 border-white/10 text-[11px] h-10 rounded-none focus:ring-1 focus:ring-ekko-500/30"
                                    />
                                    <Button type="submit" size="icon" disabled={!newMessage.trim()} className="h-10 w-10 rounded-none bg-ekko-500 hover:bg-ekko-400 transition-colors shrink-0">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-500",
                    isOpen
                        ? "bg-white text-black"
                        : "bg-neutral-900/80 text-white border border-white/10 backdrop-blur-xl hover:bg-neutral-800"
                )}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <>
                        <div className="relative group">
                            <MessageCircle className="w-6 h-6 text-ekko-400 group-hover:text-ekko-300 transition-colors" />
                            {!isAlone && (
                                <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ekko-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-ekko-500 border-2 border-neutral-900"></span>
                                </span>
                            )}
                        </div>
                        {/* Soft Glow */}
                        <div className="absolute inset-0 rounded-full bg-ekko-500/10 blur-xl group-hover:bg-ekko-500/20 transition-all" />
                    </>
                )}
            </motion.button>
        </div>
    )
}
