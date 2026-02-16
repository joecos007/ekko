import { AuroraBackground } from "@/components/auth/aurora-background";
import { ArrowUpRight } from "lucide-react";

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-12 font-geist-sans selection:bg-purple-500 selection:text-white">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <AuroraBackground className="opacity-20" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-12">
                    JOIN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">BAND</span>
                </h1>

                <p className="text-xl text-neutral-400 max-w-2xl mb-24">
                    We are building the future of generative audio. If you love music, code, and challenging the status quo, we want to hear from you.
                </p>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-6">Open Positions</h3>

                    {[
                        { title: "Senior AI Research Engineer", dept: "Engineering", loc: "Remote / Manila" },
                        { title: "Full Stack Developer (Next.js)", dept: "Engineering", loc: "Remote" },
                        { title: "Product Designer", dept: "Design", loc: "Manila" },
                        { title: "Community Manager", dept: "Operations", loc: "Remote" }
                    ].map((job, i) => (
                        <div key={i} className="group p-6 md:p-8 rounded-2xl border border-white/10 bg-neutral-900/30 hover:bg-neutral-900/60 transition-all flex items-center justify-between cursor-pointer">
                            <div>
                                <h4 className="text-xl font-bold group-hover:text-purple-400 transition-colors">{job.title}</h4>
                                <div className="flex gap-4 text-sm text-neutral-500 mt-2">
                                    <span>{job.dept}</span>
                                    <span>•</span>
                                    <span>{job.loc}</span>
                                </div>
                            </div>
                            <ArrowUpRight className="w-6 h-6 text-neutral-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </div>
                    ))}

                    <div className="p-8 text-center text-neutral-500 text-sm mt-12 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                        Don&apos;t see your role? Email us at <a href="mailto:careers@ekko.ai" className="text-white hover:underline">careers@ekko.ai</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
