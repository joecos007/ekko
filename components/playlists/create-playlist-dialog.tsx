'use client'

import { useState } from "react"
import { usePlaylists } from "@/hooks/use-playlists"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { PlusSquare } from "lucide-react"

export function CreatePlaylistDialog() {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const { createPlaylist } = usePlaylists()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        try {
            await createPlaylist.mutateAsync({ title, description })
            setOpen(false)
            setTitle("")
            setDescription("")
        } catch (error) {
            console.error("Failed to create playlist", error)
            // Improve error handling: toast?
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-4 text-base font-normal hover:text-white group px-2">
                    <PlusSquare className="w-6 h-6 p-0.5 bg-neutral-400 text-black group-hover:bg-white rounded-[2px]" />
                    Create Playlist
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] bg-neutral-900 border-neutral-800 text-white">
                <DialogHeader>
                    <DialogTitle>Create Playlist</DialogTitle>
                    <DialogDescription className="text-neutral-400">
                        Give your playlist a name.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-sm font-medium text-neutral-400">
                                Name
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-neutral-800 border-neutral-700 text-white focus:ring-primary/20"
                                placeholder="My Awesome Playlist"
                                autoFocus
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description" className="text-sm font-medium text-neutral-400">
                                Description
                            </Label>
                            <RichTextEditor
                                content={description}
                                onChange={setDescription}
                                placeholder="Describe the vibe..."
                                className="min-h-[150px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={createPlaylist.isPending}>
                            {createPlaylist.isPending ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
