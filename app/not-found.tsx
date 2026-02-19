import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center bg-black">
            <div className="relative mb-8">
                <span className="text-[120px] md:text-[180px] font-black text-white/5 leading-none select-none">404</span>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl font-black text-white tracking-tight">Page Not Found</span>
                </div>
            </div>
            <p className="text-neutral-400 text-sm max-w-md mb-8">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <div className="flex items-center gap-3">
                <Link href="/">
                    <Button className="bg-ekko-500 hover:bg-ekko-400 text-white rounded-full px-6">
                        <Home className="w-4 h-4 mr-2" />
                        Go Home
                    </Button>
                </Link>
                <Link href="/home">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-full px-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Dashboard
                    </Button>
                </Link>
            </div>
        </div>
    )
}
