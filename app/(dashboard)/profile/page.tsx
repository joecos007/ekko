"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { useEffect, useRef, useState } from "react"
import { Camera, Loader2, LogOut, User, Mail, Lock, Music } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)

    // Form States
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [highQuality, setHighQuality] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        getProfile()
        // Load settings from local storage
        const hq = localStorage.getItem('ekko_hq_audio') === 'true'
        setHighQuality(hq)
    }, [])

    const getProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)
            setEmail(user.email || "")

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error && error.code !== 'PGRST116') {
                throw error
            }

            if (data) {
                setProfile(data)
                setFullName(data.full_name || "")
            }
        } catch (error: any) {
            toast.error("Error loading profile")
        } finally {
            setLoading(false)
        }
    }

    const updateProfile = async () => {
        try {
            setLoading(true)
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: fullName,
                    updated_at: new Date().toISOString(),
                })

            if (error) throw error
            toast.success("Profile updated!")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.")
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `${user.id}-${Math.random()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)

            // Update profile
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    avatar_url: publicUrl,
                    updated_at: new Date().toISOString(),
                })

            if (updateError) throw updateError

            setProfile({ ...profile, avatar_url: publicUrl })
            toast.success("Avatar updated!")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setUploading(false)
        }
    }

    const updatePassword = async () => {
        if (!password) return
        try {
            setLoading(true)
            const { error } = await supabase.auth.updateUser({ password })
            if (error) throw error
            toast.success("Password updated!")
            setPassword("")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const toggleHighQuality = (checked: boolean) => {
        setHighQuality(checked)
        localStorage.setItem('ekko_hq_audio', checked.toString())
        toast.info(`High Quality Audio ${checked ? 'Enabled' : 'Disabled'}`)
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        toast.success("Signed out successfully")
    }

    if (loading && !user) {
        return <div className="flex items-center justify-center min-h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
    }

    return (
        <div className="p-4 md:p-8 min-h-full font-geist-sans pb-24 md:pb-8">
            <h1 className="text-4xl font-black tracking-tighter mb-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent w-fit drop-shadow-sm">Profile</h1>

            <div className="max-w-2xl mx-auto space-y-8">
                {/* Avatar Section */}
                <div className="relative overflow-hidden rounded-3xl bg-neutral-900/40 border border-white/5 p-8 backdrop-blur-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                            <Avatar className="w-32 h-32 border-4 border-black relative shadow-2xl">
                                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                <AvatarFallback className="text-4xl bg-neutral-800 text-neutral-400 font-bold">
                                    {fullName?.[0]?.toUpperCase() || email?.[0]?.toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="absolute bottom-0 right-0 p-2.5 rounded-full bg-white text-black shadow-lg hover:scale-110 transition-transform disabled:opacity-50 hover:bg-neutral-100"
                            >
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={uploadAvatar}
                                disabled={uploading}
                            />
                        </div>

                        <div className="text-center md:text-left space-y-2">
                            <div className="space-y-1">
                                <Label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Display Name</Label>
                                <h2 className="text-3xl font-bold text-white tracking-tight">{fullName || "User"}</h2>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Email</Label>
                                <p className="text-neutral-400 font-medium">{email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings Grid */}
                <div className="grid gap-6">
                    {/* Profile Fields */}
                    <div className="space-y-6 bg-neutral-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-400" /> Personal Details
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-neutral-300">Display Name</Label>
                                <Input
                                    id="name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="bg-black/50 border-neutral-800 focus:border-indigo-500/50 transition-colors h-11"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <Button
                                onClick={updateProfile}
                                className="w-full bg-white text-black hover:bg-neutral-200 font-bold h-11 rounded-full"
                                disabled={loading}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>

                    {/* App Settings */}
                    <div className="space-y-6 bg-neutral-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Music className="w-5 h-5 text-pink-400" /> Preferences
                        </h3>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5">
                            <div className="space-y-1">
                                <Label className="text-base font-medium">High Quality Audio</Label>
                                <p className="text-xs text-neutral-400">Stream in 320kbps (uses more data)</p>
                            </div>
                            <Switch checked={highQuality} onCheckedChange={toggleHighQuality} />
                        </div>
                    </div>

                    {/* Security */}
                    <div className="space-y-6 bg-neutral-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Lock className="w-5 h-5 text-purple-400" /> Security
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-neutral-300">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-black/50 border-neutral-800 focus:border-purple-500/50 transition-colors h-11"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <Button
                                onClick={updatePassword}
                                disabled={!password || loading}
                                variant="outline"
                                className="w-full border-neutral-800 hover:bg-neutral-800 h-11 rounded-full text-neutral-300 hover:text-white"
                            >
                                Update Password
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-neutral-900">
                    <Button
                        variant="ghost"
                        className="w-full gap-2 text-red-400 hover:text-red-300 hover:bg-red-950/20 h-12 rounded-xl"
                        onClick={handleSignOut}
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                    <p className="text-center text-xs text-neutral-700 mt-6 font-mono">
                        EKKO Music v1.0.0 • {user?.id}
                    </p>
                </div>
            </div>
        </div>
    )
}
