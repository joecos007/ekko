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
import { PlusSquare } from "lucide-react"

export function CreatePlaylistDialog() {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const { createPlaylist } = usePlaylists()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        try {
            await createPlaylist.mutateAsync(title)
            setOpen(false)
            setTitle("")
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
            <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-white">
                <DialogHeader>
                    <DialogTitle>Create Playlist</DialogTitle>
                    <DialogDescription className="text-neutral-400">
                        Give your playlist a name.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="col-span-3 bg-neutral-800 border-neutral-700 text-white"
                                autoFocus
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
