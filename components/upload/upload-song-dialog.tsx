"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useUser } from "@/hooks/use-user"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import * as tus from "tus-js-client"
import NextImage from "next/image"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CloudUpload, Music, Image as ImageIcon, X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

import { createBrowserClient } from '@supabase/ssr'

// Local client creation to ensure fresh session
function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

interface UploadFormValues {
    author: string
    title: string
    song: File | null
    image: File | null
    duration: number
}

interface UploadSongDialogProps {
    children: React.ReactNode
}

export function UploadSongDialog({ children }: UploadSongDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadStatus, setUploadStatus] = useState("") // Granular status text
    const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null)
    const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false)

    const { user } = useUser()
    const router = useRouter()
    const supabase = createClient()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch
    } = useForm<UploadFormValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null,
            duration: 0
        }
    })

    const songFile = watch('song')
    const imageFile = watch('image')
    const title = watch('title')

    // Memoize and Revoke image preview URL to avoid memory leaks
    const imagePreviewUrl = useMemo(() => {
        if (!imageFile) return null;
        return URL.createObjectURL(imageFile);
    }, [imageFile]);

    useEffect(() => {
        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [imagePreviewUrl]);

    // Real-time Duplicate Check
    useEffect(() => {
        if (!title || title.length < 2 || !user) {
            setDuplicateWarning(null)
            setIsCheckingDuplicate(false)
            return
        }

        const timer = setTimeout(async () => {
            setIsCheckingDuplicate(true)
            try {
                const { data } = await supabase
                    .from('songs')
                    .select('id')
                    .eq('user_id', user.id)
                    .ilike('title', title.trim())
                    .maybeSingle()

                if (data) {
                    setDuplicateWarning("You already have a song with this exact title.")
                } else {
                    setDuplicateWarning(null)
                }
            } catch (error) {
                console.error("Duplicate check error:", error)
            } finally {
                setIsCheckingDuplicate(false)
            }
        }, 500) // 500ms debounce

        return () => clearTimeout(timer)
    }, [title, user, supabase])


    // Handle file drop for song
    const onDropSong = useCallback((acceptedFiles: File[]) => {
        const fileToUpload = acceptedFiles[0]
        if (fileToUpload) {
            setValue('song', fileToUpload)

            // Auto-fill title if empty
            if (!title) {
                const fileName = fileToUpload.name.replace(/\.[^/.]+$/, "")
                setValue('title', fileName)
            }

            // Calculate duration
            const blobUrl = URL.createObjectURL(fileToUpload)
            const audio = new Audio(blobUrl)
            audio.onloadedmetadata = () => {
                setValue('duration', Math.round(audio.duration))
                URL.revokeObjectURL(blobUrl)
                // Cleanup audio
                audio.src = ''
                audio.load()
                audio.remove()
            }
            audio.onerror = () => {
                URL.revokeObjectURL(blobUrl)
            }
        }
    }, [setValue, title])

    const { getRootProps: getSongRootProps, getInputProps: getSongInputProps, isDragActive: isSongDragActive } = useDropzone({
        onDrop: onDropSong,
        accept: { 'audio/mpeg': ['.mp3'] },
        maxFiles: 1
    })

    // Handle file drop for image
    const onDropImage = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (file) {
            setValue('image', file)
        }
    }, [setValue])

    const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDragActive } = useDropzone({
        onDrop: onDropImage,
        accept: { 'image/*': ['.png', '.jpeg', '.jpg', '.webp'] },
        maxFiles: 1
    })

    const onSubmit = async (values: UploadFormValues) => {
        try {
            if (duplicateWarning) {
                return toast.error("Please fix the duplicate title error.")
            }

            setIsLoading(true)
            setUploadProgress(0)
            setUploadStatus("Initializing upload...")

            const imageFile = values.image
            const songFile = values.song

            if (!imageFile || !songFile || !user) {
                setIsLoading(false)
                toast.error('Missing fields or not logged in')
                return
            }

            if (!values.duration) {
                setUploadStatus("Processing audio...")
                await new Promise(resolve => setTimeout(resolve, 1000));
                if (!values.duration) {
                    setIsLoading(false)
                    toast.error('Audio duration not processed yet. Please try again.')
                    return
                }
            }

            // Generate IDs
            const uniqueID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            const sanitizedTitle = values.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()

            // 1. Upload Image (Standard)
            setUploadStatus("Uploading cover art...")
            const imagePath = `image-${sanitizedTitle}-${uniqueID}`

            const { error: imageError } = await supabase.storage
                .from('covers')
                .upload(imagePath, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (imageError) {
                console.error("Image Upload Error:", imageError)
                setIsLoading(false)
                return toast.error(`Failed image upload: ${imageError.message}`)
            }

            // 2. Upload Song (TUS Resumable)
            setUploadStatus("Starting song upload...")
            const songPath = `song-${sanitizedTitle}-${uniqueID}.mp3`

            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                setIsLoading(false)
                return toast.error("Session expired. Please log in again.")
            }

            return new Promise<void>((resolve, reject) => {
                const upload = new tus.Upload(songFile, {
                    endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
                    retryDelays: [0, 3000, 5000, 10000, 20000],
                    headers: {
                        authorization: `Bearer ${session.access_token}`,
                        'x-upsert': 'true',
                    },
                    uploadDataDuringCreation: true,
                    removeFingerprintOnSuccess: true,
                    metadata: {
                        bucketName: 'songs',
                        objectName: songPath,
                        contentType: songFile.type || 'audio/mpeg',
                        cacheControl: '3600',
                    },
                    chunkSize: 6 * 1024 * 1024,
                    onError: function (error) {
                        console.error("TUS Upload Failed:", error)
                        setIsLoading(false)
                        setUploadStatus("Upload failed")
                        toast.error(`Song upload failed: ${error.message}`)
                        reject(error)
                    },
                    onProgress: function (bytesUploaded, bytesTotal) {
                        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(0)
                        setUploadProgress(Number(percentage))
                        setUploadStatus(`Uploading song... ${percentage}%`)
                    },
                    onSuccess: async function () {
                        setUploadStatus("Finalizing...")

                        // 3. Get Full Public URLs
                        const { data: songUrlData } = supabase.storage.from('songs').getPublicUrl(songPath)
                        const { data: imageUrlData } = supabase.storage.from('covers').getPublicUrl(imagePath)

                        // 4. Insert Record
                        const { error: supabaseError } = await supabase
                            .from('songs')
                            .insert({
                                user_id: user.id,
                                title: values.title,
                                artist: values.author,
                                image_path: imageUrlData.publicUrl,
                                audio_path: songUrlData.publicUrl,
                                duration: values.duration
                            })

                        if (supabaseError) {
                            console.error("DB Insert Error:", supabaseError)
                            setIsLoading(false)
                            toast.error(supabaseError.message)
                            reject(supabaseError)
                            return
                        }

                        setUploadProgress(100)
                        setUploadStatus("Success!")
                        router.refresh()
                        toast.success('Song added to library!')

                        // Small delay to show 100% state
                        setTimeout(() => {
                            reset()
                            setIsOpen(false)
                            setIsLoading(false)
                            setUploadProgress(0)
                            setUploadStatus("")
                            resolve()
                        }, 1000)
                    },
                })

                upload.findPreviousUploads().then(function (previousUploads) {
                    if (previousUploads.length) {
                        upload.resumeFromPreviousUpload(previousUploads[0])
                    }
                    upload.start()
                })
            })

        } catch (error) {
            console.error("Unexpected error:", error)
            toast.error("Something went wrong during upload")
            setIsLoading(false)
            setUploadProgress(0)
        }
    }

    const onChange = (open: boolean) => {
        if (!open) {
            reset()
            setIsOpen(false)
            setIsLoading(false)
            setDuplicateWarning(null)
        } else {
            setIsOpen(true)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-neutral-900 border-neutral-800 text-white max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                <DialogHeader>
                    <DialogTitle>Upload Song</DialogTitle>
                    <DialogDescription>
                        Add a new track to your library. MP3s only.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-4">

                    {/* Song Upload Area */}
                    <div className={`
                relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer group
                ${isSongDragActive ? 'border-green-500 bg-green-500/10' : 'border-neutral-700 hover:border-neutral-500 bg-neutral-800/50'}
                ${songFile ? 'border-green-500/50 bg-green-500/5' : ''}
            `} {...getSongRootProps()}>
                        <input {...getSongInputProps()} />
                        {songFile ? (
                            <div className="flex flex-col items-center">
                                <Music className="w-10 h-10 text-green-500 mb-2" />
                                <p className="text-sm font-medium text-white text-center break-all px-4">{songFile.name}</p>
                                <p className="text-xs text-neutral-400 mt-1">{(songFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-neutral-400 group-hover:text-white transition-colors">
                                <CloudUpload className="w-10 h-10 mb-2" />
                                <p className="text-sm font-medium">Drag & drop song file here</p>
                                <p className="text-xs text-neutral-500 mt-1">or click to select (MP3 only)</p>
                            </div>
                        )}
                        {songFile && (
                            <button type="button" onClick={(e) => { e.stopPropagation(); setValue('song', null); }} className="absolute top-2 right-2 p-1 rounded-full hover:bg-neutral-700 text-neutral-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Inputs */}
                    <div className="flex flex-col gap-y-2">
                        <div className="relative">
                            <Input
                                id="title"
                                disabled={isLoading}
                                {...register('title', { required: true })}
                                placeholder="Song Title"
                                className={`bg-neutral-800/50 border-neutral-700 focus:border-green-500 focus:ring-green-500/20 text-white placeholder:text-neutral-500 pr-10 ${duplicateWarning ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {isCheckingDuplicate ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                                ) : duplicateWarning ? (
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                ) : title && title.length > 2 ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : null}
                            </div>
                        </div>
                        {duplicateWarning && (
                            <p className="text-xs text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1">
                                {duplicateWarning}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <Input
                            id="author"
                            disabled={isLoading}
                            {...register('author', { required: true })}
                            placeholder="Artist Name"
                            className="bg-neutral-800/50 border-neutral-700 focus:border-green-500 focus:ring-green-500/20 text-white placeholder:text-neutral-500"
                        />
                    </div>

                    {/* Image Upload Area */}
                    <div className="flex gap-4">
                        <div className={`
                    relative w-32 h-32 flex-shrink-0 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer group overflow-hidden
                    ${isImageDragActive ? 'border-green-500 bg-green-500/10' : 'border-neutral-700 hover:border-neutral-500 bg-neutral-800/50'}
                `} {...getImageRootProps()}>
                            <input {...getImageInputProps()} />
                            {imageFile ? (
                                <div className="relative w-full h-full">
                                    <NextImage src={imagePreviewUrl || ''} fill className="object-cover" alt="Preview" unoptimized />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-xs font-bold">Change</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-neutral-400 group-hover:text-white p-2 text-center">
                                    <ImageIcon className="w-6 h-6 mb-1" />
                                    <p className="text-[10px] leading-tight">Cover Art</p>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col justify-center text-sm text-neutral-400">
                            <p>Upload cover art for your track.</p>
                            <p className="text-xs text-neutral-500 mt-1">Square aspect ratio recommended.<br />Supported formats: JPEG, PNG, WEBP.</p>
                        </div>
                    </div>

                    {/* Enhanced Upload Button / Progress Bar */}
                    <div className="space-y-2">
                        {isLoading && (
                            <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-green-500 h-full transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        )}

                        <Button
                            disabled={isLoading || !songFile || !imageFile || !!duplicateWarning || isCheckingDuplicate}
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold h-11 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{uploadStatus}</span>
                                </div>
                            ) : (
                                "Upload Song"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
