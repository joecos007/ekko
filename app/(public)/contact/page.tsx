'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, User, MessageSquare, Send, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            const data = {
                name: formData.get('id="name"') || (document.getElementById('name') as HTMLInputElement).value,
                email: formData.get('id="email"') || (document.getElementById('email') as HTMLInputElement).value,
                message: formData.get('id="message"') || (document.getElementById('message') as HTMLTextAreaElement).value,
            }

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!response.ok) throw new Error('Failed to send message')

            setSubmitted(true)
            toast.success('Message sent! We\'ll get back to you soon.')
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen text-white">
            {/* Hero */}
            <div className="relative py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ekko-500/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ekko-700/10 rounded-full blur-[150px]" />
                </div>

                <div className="max-w-2xl mx-auto px-6 text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Get in <span className="bg-gradient-to-r from-ekko-300 to-ekko-500 bg-clip-text text-transparent">Touch</span>
                    </h1>
                    <p className="text-neutral-400 text-lg max-w-lg mx-auto">
                        Questions, feedback, or partnership inquiries — we&apos;d love to hear from you.
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-lg mx-auto px-6 pb-20">
                {submitted ? (
                    <div className="text-center space-y-6 py-12 rounded-none border border-white/10 bg-white/5 backdrop-blur-xl">
                        <div className="mx-auto w-16 h-16 rounded-full bg-neon-teal/10 border border-neon-teal/20 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-neon-teal" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                            <p className="text-sm text-neutral-400">
                                Thanks for reaching out. We&apos;ll get back to you within 48 hours.
                            </p>
                        </div>
                        <Link href="/">
                            <Button variant="ghost" className="text-ekko-400 hover:text-ekko-300 gap-2 mt-4">
                                <ArrowLeft className="w-4 h-4" /> Back to Home
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 rounded-none border border-white/10 bg-white/5 backdrop-blur-xl p-8">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <label htmlFor="name" className="block text-xs font-medium text-neutral-400 ml-1">Name</label>
                            <div className="group relative flex items-center rounded-none border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 focus-within:border-ekko-500/50 focus-within:ring-2 focus-within:ring-ekko-500/20">
                                <User className="ml-3 h-4 w-4 text-neutral-500 transition-colors group-focus-within:text-ekko-400" />
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    placeholder="Your name"
                                    className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-xs font-medium text-neutral-400 ml-1">Email</label>
                            <div className="group relative flex items-center rounded-none border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 focus-within:border-ekko-500/50 focus-within:ring-2 focus-within:ring-ekko-500/20">
                                <Mail className="ml-3 h-4 w-4 text-neutral-500 transition-colors group-focus-within:text-ekko-400" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="you@domain.com"
                                    className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-1.5">
                            <label htmlFor="message" className="block text-xs font-medium text-neutral-400 ml-1">Message</label>
                            <div className="group rounded-none border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 focus-within:border-ekko-500/50 focus-within:ring-2 focus-within:ring-ekko-500/20">
                                <div className="flex items-start pt-2.5">
                                    <MessageSquare className="ml-3 mt-0.5 h-4 w-4 text-neutral-500 flex-shrink-0 transition-colors group-focus-within:text-ekko-400" />
                                    <textarea
                                        id="message"
                                        required
                                        rows={5}
                                        placeholder="Tell us what's on your mind..."
                                        className="w-full bg-transparent px-3 py-0 text-sm text-white placeholder:text-neutral-600 focus:outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 rounded-none bg-gradient-to-r from-ekko-500 to-ekko-300 hover:from-ekko-400 hover:to-ekko-200 text-black font-bold shadow-[0_0_20px_-5px_rgba(99,102,241,0.35)] hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.5)] transition-all duration-300 hover:scale-[1.02] gap-2"
                        >
                            <Send className="w-4 h-4" />
                            {loading ? 'Sending...' : 'Send Message'}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    )
}
