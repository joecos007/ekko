import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Disc } from "lucide-react"

interface TeamStoryDialogProps {
    children: React.ReactNode
}

export function TeamStoryDialog({ children }: TeamStoryDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-full max-w-4xl h-[90vh] md:h-[85vh] bg-[#050505] border-white/10 text-white p-0 overflow-hidden flex flex-col rounded-t-xl md:rounded-xl">
                <DialogHeader className="px-6 py-4 border-b border-white/5 bg-black/50 backdrop-blur-md z-10 shrink-0 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="group relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full group-hover:bg-blue-500/40 transition-all" />
                            <Disc className="w-8 h-8 text-blue-500 relative z-10 animate-spin-slow" />
                        </Link>
                        <div className="flex flex-col text-left">
                            <DialogTitle className="text-xl font-bold tracking-tight">Team Story</DialogTitle>
                            <DialogDescription className="text-neutral-400 text-xs text-left">Meet the people behind the system.</DialogDescription>
                        </div>
                    </div>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full">
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </DialogClose>
                </DialogHeader>

                <ScrollArea className="flex-1">
                    <div className="px-6 lg:px-12 py-12">
                        {/* Header Content */}
                        <div className="mb-12 md:mb-16 text-center">
                            <div className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-blue-400 text-[10px] uppercase tracking-widest mb-6 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                Meet Our Team
                            </div>
                            <h1 className="text-3xl md:text-6xl font-black tracking-tighter mb-4 md:mb-6 leading-tight">
                                THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">PEOPLE</span> BEHIND <br /> THE SYSTEM.
                            </h1>
                            <p className="text-base md:text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto">
                                The dedicated professionals behind Team Ekko who make remote staffing seamless.
                            </p>
                        </div>

                        {/* Creator Spotlight: Oliver.O */}
                        <div className="mb-16 max-w-2xl mx-auto">
                            <div className="bg-gradient-to-br from-neutral-900/80 to-black p-8 rounded-2xl border border-yellow-500/20 shadow-[0_0_50px_rgba(234,179,8,0.1)] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 transition-all duration-700 group-hover:scale-150" />

                                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-800 p-[2px] shadow-lg shadow-yellow-500/20 shrink-0">
                                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                            <span className="text-2xl md:text-3xl font-bold text-yellow-500">O</span>
                                        </div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl font-black tracking-tight text-white mb-1">Oliver.O</h3>
                                        <div className="inline-flex items-center gap-2 mb-3 justify-center md:justify-start">
                                            <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest">Project Architect</span>
                                            <span className="w-1 h-1 bg-neutral-600 rounded-full" />
                                            <span className="text-neutral-500 text-xs uppercase tracking-widest">Creator</span>
                                        </div>
                                        <p className="text-neutral-300 text-sm leading-relaxed">
                                            Crafted the EKKO project. The visionary mind behind the architecture, design, and execution of the platform.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Core Team Grid */}
                        <h2 className="text-2xl font-black tracking-tight mb-8 text-center text-white">Our Core Team</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                            {[
                                {
                                    name: "Chelle",
                                    role: "Team Lead",
                                    desc: "Visionary leader who bridges the gap between global businesses and exceptional remote talent.",
                                    tags: ["Leadership", "Business Strategy", "Client Relations"],
                                    color: "purple"
                                },
                                {
                                    name: "Miguel",
                                    role: "Head of Operations",
                                    desc: "Overall Team Lead overseeing systems, strategy, and cross-team coordination. Manages internal workflows, software tools, and documentation.",
                                    tags: ["Operations Management", "Technical Support", "Software & Tool Setup"],
                                    color: "blue"
                                },
                                {
                                    name: "Jai",
                                    role: "Virtual Agent Operations Manager",
                                    desc: "Ensures smooth day-to-day operations across all client accounts and manages the full virtual assistant deployment pipeline.",
                                    tags: ["Virtual Agent Deployment", "Process Optimization", "Project Management"],
                                    color: "indigo"
                                },
                                {
                                    name: "Celestin",
                                    role: "Lead Virtual Assistant",
                                    desc: "Provides high-level administrative and executive support, specializing in assisting C-suite executives.",
                                    tags: ["Executive Support", "Calendar & Schedule Management", "Travel Coordination"],
                                    color: "purple"
                                },
                                {
                                    name: "Megan",
                                    role: "Client Success Manager",
                                    desc: "Dedicated to delivering exceptional client experiences. Manages onboarding, matches clients with the right virtual assistants.",
                                    tags: ["Client Onboarding", "Account Management", "Performance Monitoring"],
                                    color: "pink"
                                },
                                {
                                    name: "Biane",
                                    role: "Sales Agent Lead",
                                    desc: "Leads the sales agent team, training and guiding virtual assistants to generate and qualify leads.",
                                    tags: ["Sales Leadership", "Cold Calling", "Lead Qualification"],
                                    color: "rose"
                                },
                                {
                                    name: "Angelu",
                                    role: "Marketing Specialist",
                                    desc: "Helps clients build strong brand visibility across digital platforms through creative and strategic marketing initiatives.",
                                    tags: ["Digital Marketing", "Social Media Strategy", "Content Creation"],
                                    color: "orange"
                                },
                                {
                                    name: "Kim",
                                    role: "Social Media Manager",
                                    desc: "Manages and grows client social media accounts by creating engaging content, maintaining posting schedules.",
                                    tags: ["Instagram & Facebook", "Content Scheduling", "Community Engagement"],
                                    color: "cyan"
                                },
                                {
                                    name: "Audrea",
                                    role: "Customer Support Lead",
                                    desc: "Leads the customer support team, ensuring excellent service delivery through effective communication.",
                                    tags: ["Customer Support Leadership", "Live Chat", "Ticket Resolution"],
                                    color: "teal"
                                },
                                {
                                    name: "Mendy",
                                    role: "Data Entry Specialist",
                                    desc: "Ensures accurate and reliable data management across all projects, maintaining clean records and up-to-date systems.",
                                    tags: ["Data Entry", "Spreadsheet Management", "CRM Updates"],
                                    color: "emerald"
                                },
                                {
                                    name: "Anthony",
                                    role: "Research Analyst",
                                    desc: "Provides detailed research and analytical support to help clients make informed business decisions.",
                                    tags: ["Market Research", "Competitor Analysis", "Data Interpretation"],
                                    color: "sky"
                                }
                            ].map((member, i) => (
                                <div key={i} className="group glass-card p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 relative overflow-hidden bg-neutral-900/40">
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-${member.color}-500/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} />

                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-sm font-bold text-white border border-white/10 shadow-lg">
                                            {member.name[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold tracking-tight text-white">{member.name}</h3>
                                            <p className={`text-${member.color}-400 text-[10px] font-bold uppercase tracking-wider`}>{member.role}</p>
                                        </div>
                                    </div>

                                    <p className="text-neutral-400 text-xs leading-relaxed mb-4 font-medium">
                                        {member.desc}
                                    </p>

                                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                                        {member.tags.map((tag, j) => (
                                            <span key={j} className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold bg-white/5 px-2 py-1 rounded-sm">
                                                #{tag.replace(/\s+/g, '')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="border-t border-white/10 pt-12 flex flex-col items-center justify-center gap-6 text-center">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight mb-2 text-white">Want to Join Our Team?</h2>
                                <p className="text-neutral-400 max-w-sm mx-auto text-sm">We&apos;re always looking for talented Virtual Assistants and Agents to join our network.</p>
                            </div>
                            <div className="flex gap-4">
                                <Button disabled className="rounded-full h-12 px-8 bg-white/5 text-neutral-400 font-bold tracking-widest uppercase text-xs cursor-not-allowed border border-white/5">
                                    Applications Opening Soon
                                </Button>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
