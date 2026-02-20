"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { MessageCircle, Send, X, MessageSquare, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useChatUI } from "@/store/chat-ui-store"
import { useState } from "react"

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
    const { isOpen, close } = useChatUI()
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [onlineCount, setOnlineCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Presence & Realtime
    useEffect(() => {
        if (!user) return

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select(`*, profiles(full_name, avatar_url)`)
                .order('created_at', { ascending: true })
                .limit(50)

            if (!error && data) setMessages(data as any)
            setLoading(false)
        }
        fetchMessages()

        const messageSubscription = supabase
            .channel('public:messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages'
            }, async (payload: any) => {
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('full_name, avatar_url')
                    .eq('id', payload.new.user_id)
                    .single()

                setMessages(prev => [...prev, { ...payload.new, profiles: profileData } as Message])
            })
            .subscribe()

        const presenceChannel = supabase.channel('online-users', {
            config: { presence: { key: user.id } },
        })

        presenceChannel
            .on('presence', { event: 'sync' }, () => {
                setOnlineCount(Object.keys(presenceChannel.presenceState()).length)
            })
            .subscribe(async (status: any) => {
                if (status === 'SUBSCRIBED') {
                    await presenceChannel.track({ online_at: new Date().toISOString() })
                }
            })

        return () => {
            messageSubscription.unsubscribe()
            presenceChannel.unsubscribe()
        }
    }, [user, supabase])

    // Auto-scroll
    useEffect(() => {
        if (messagesEndRef.current && isOpen) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isOpen])

    const sendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!newMessage.trim() || !user) return
        const content = newMessage.trim()
        setNewMessage("")
        await supabase.from('messages').insert({ content, user_id: user.id })
    }

    const isAlone = onlineCount <= 1

    if (!user) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className={cn(
                        // Shared
                        "fixed z-[60]",
                        "bg-neutral-900/98 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col",
                        // Mobile: bottom sheet above the player + nav stack
                        "left-0 right-0 rounded-t-2xl rounded-b-none max-h-[65dvh]",
                        "bottom-[var(--floating-chat-offset)]",
                        // Desktop: fixed right popover above the player bar
                        "md:left-auto md:right-8 md:w-[360px] md:rounded-2xl md:rounded-b-2xl",
                        "md:max-h-[min(520px,calc(100dvh-var(--player-bar-height)-6rem))]",
                        "md:h-[min(520px,calc(100dvh-var(--player-bar-height)-6rem))]",
                        "md:bottom-[calc(var(--player-bar-height)+1.5rem)]",
                    )}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-white/5 bg-white/[0.03] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-ekko-500/10 text-ekko-400">
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Community Lounge</h3>
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
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={close}
                            className="rounded-full hover:bg-white/10 h-8 w-8"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full">
                            <div className="p-4 space-y-4">
                                {loading ? (
                                    <div className="flex items-center justify-center py-16">
                                        <Loader2 className="w-6 h-6 animate-spin text-neutral-500" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center py-16 space-y-2 opacity-40">
                                        <MessageCircle className="w-8 h-8 text-neutral-500 mx-auto" />
                                        <p className="text-xs text-neutral-500">Silence is golden.</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "flex flex-col gap-0.5",
                                                msg.user_id === user.id ? "items-end" : "items-start"
                                            )}
                                        >
                                            {msg.user_id !== user.id && (
                                                <span className="text-[10px] font-bold text-neutral-500 px-1">
                                                    {msg.profiles?.full_name || "Guest"}
                                                </span>
                                            )}
                                            <div className={cn(
                                                "px-3 py-2 text-[12px] max-w-[85%] break-words leading-relaxed",
                                                msg.user_id === user.id
                                                    ? "bg-ekko-500 text-white rounded-2xl rounded-tr-sm shadow-lg shadow-ekko-500/10"
                                                    : "bg-white/5 text-neutral-300 border border-white/5 rounded-2xl rounded-tl-sm"
                                            )}>
                                                {msg.content}
                                            </div>
                                            <span
                                                className="text-[9px] text-neutral-600 font-medium px-1"
                                                suppressHydrationWarning
                                            >
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Input — always visible so users can start conversations */}
                    <div className="p-3 bg-black/30 border-t border-white/5 shrink-0 space-y-2">
                        {isAlone && (
                            <p className="text-center text-[10px] text-neutral-500 font-medium italic">
                                Start the conversation — others will join soon.
                            </p>
                        )}
                        <form onSubmit={sendMessage} className="flex gap-2">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Message the lounge..."
                                className="bg-white/5 border-white/10 text-[12px] h-9 rounded-full focus:ring-1 focus:ring-ekko-500/30 px-4"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!newMessage.trim()}
                                className="h-9 w-9 rounded-full bg-ekko-500 hover:bg-ekko-400 transition-colors shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
