'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link2, Check, X, Twitter, Facebook, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ShareDialogProps {
    open: boolean
    onClose: () => void
    title: string
    type: 'song' | 'playlist' | 'artist'
    id: string
}

export function ShareDialog({ open, onClose, title, type, id }: ShareDialogProps) {
    const [copied, setCopied] = useState(false)

    if (!open) return null

    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${type === 'song' ? 'track' : type}/${id}`
    const shareText = `Check out "${title}" on EKKO`

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            toast.success('Link copied to clipboard!')
            setTimeout(() => setCopied(false), 2000)
        } catch {
            toast.error('Failed to copy link')
        }
    }

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: shareText, url: shareUrl })
            } catch {
                // user cancelled
            }
        }
    }

    const socialLinks = [
        { name: 'Twitter', icon: Twitter, url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
        { name: 'Facebook', icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
        { name: 'Email', icon: Mail, url: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}` },
    ]

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative z-10 w-full max-w-sm bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-none shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-white/8">
                    <div className="flex items-center gap-3">
                        <Link2 className="w-5 h-5 text-ekko-400" />
                        <h2 className="text-lg font-bold text-white">Share</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-neutral-400 hover:text-white rounded-full">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="p-5 space-y-5">
                    <div>
                        <p className="text-sm text-neutral-400 mb-1">{type === 'song' ? 'Track' : type === 'playlist' ? 'Playlist' : 'Artist'}</p>
                        <p className="text-white font-bold truncate">{title}</p>
                    </div>

                    {/* Copy Link */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-none px-3 py-2.5 text-sm text-neutral-400 truncate font-mono">
                            {shareUrl}
                        </div>
                        <Button
                            onClick={handleCopy}
                            className={cn(
                                "shrink-0 rounded-none h-10 px-4 font-bold transition-all",
                                copied ? "bg-ekko-500/20 text-ekko-300" : "bg-ekko-500 hover:bg-ekko-400 text-white"
                            )}
                        >
                            {copied ? <Check className="w-4 h-4" /> : 'Copy'}
                        </Button>
                    </div>

                    {/* Social Share */}
                    <div className="flex items-center gap-3">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-none bg-white/5 hover:bg-white/10 border border-white/5 text-neutral-400 hover:text-white transition-all text-sm font-medium"
                            >
                                <social.icon className="w-4 h-4" />
                                {social.name}
                            </a>
                        ))}
                    </div>

                    {/* Native Share (mobile) */}
                    {typeof navigator !== 'undefined' && 'share' in navigator && (
                        <Button
                            variant="outline"
                            onClick={handleNativeShare}
                            className="w-full rounded-none border-white/10 text-white hover:bg-white/5"
                        >
                            More sharing options...
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
