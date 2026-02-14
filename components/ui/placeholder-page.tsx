import { Construction } from "lucide-react"

interface PlaceholderPageProps {
    title?: string
    description?: string
}

export default function PlaceholderPage({
    title = "Coming Soon",
    description = "This feature is currently under development."
}: PlaceholderPageProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-500">
            <div className="p-6 bg-white/5 rounded-full mb-6">
                <Construction className="w-12 h-12 text-neutral-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-neutral-500">{description}</p>
        </div>
    )
}
