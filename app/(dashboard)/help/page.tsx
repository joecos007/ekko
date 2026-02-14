import { LifeBuoy } from "lucide-react"

export default function HelpPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-500">
            <div className="p-6 bg-white/5 rounded-full mb-6">
                <LifeBuoy className="w-12 h-12 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Help Center</h1>
            <p className="text-neutral-500 max-w-md">
                Need assistance? Contact our support team at <a href="mailto:support@ekko.ai" className="text-blue-400 hover:underline">support@ekko.ai</a>.
            </p>
        </div>
    )
}
