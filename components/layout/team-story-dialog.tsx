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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TeamStoryDialogProps {
    children: React.ReactNode
}

export function TeamStoryDialog({ children }: TeamStoryDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-full max-w-4xl h-[90vh] md:h-[85vh] bg-surface-1 border-white/10 text-white p-0 overflow-hidden flex flex-col rounded-t-xl md:rounded-none">
                <DialogHeader className="px-6 py-4 border-b border-white/5 bg-black/50 backdrop-blur-md z-10 shrink-0 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="group relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-ekko-500/20 blur-md rounded-full group-hover:bg-ekko-500/40 transition-all" />
                            <Disc className="w-8 h-8 text-ekko-400 relative z-10 animate-spin-slow" />
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
                            <div className="inline-flex items-center gap-2 border border-ekko-500/30 bg-ekko-500/10 px-3 py-1 text-ekko-300 text-[10px] uppercase tracking-widest mb-6 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-ekko-500 animate-pulse" />
                                Meet Our Team
                            </div>
                            <h1 className="text-3xl md:text-6xl font-black tracking-tighter mb-4 md:mb-6 leading-tight">
                                THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-ekko-400 via-ekko-300 to-white">PEOPLE</span> BEHIND <br /> THE SYSTEM.
                            </h1>
                            <p className="text-base md:text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto">
                                The dedicated professionals behind Team Ekko who make remote staffing seamless.
                            </p>
                        </div>

                        {/* Creator Spotlight: Oliver.O */}
                        <div className="mb-16 max-w-2xl mx-auto">
                            <div className="bg-gradient-to-br from-neutral-900/80 to-black p-8 rounded-none border border-ekko-500/20 shadow-[0_0_50px_rgba(99,102,241,0.15)] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-ekko-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 transition-all duration-700 group-hover:scale-150" />

                                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                                    <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-4 ring-ekko-500/20 mb-4 shadow-2xl relative group">
                                        <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-ekko-500/30 transition-colors z-20 pointer-events-none" />
                                        <AvatarImage
                                            src="/images/team/oliver_featured_ghibli.png"
                                            alt="Oliver.O"
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-ekko-400 to-ekko-600 text-white text-2xl font-black">
                                            O
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-2xl font-black tracking-tight text-white mb-1">Oliver.O</h3>
                                        <div className="inline-flex items-center gap-2 mb-3 justify-center md:justify-start">
                                            <span className="text-ekko-400 text-xs font-bold uppercase tracking-widest">Project Architect</span>
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
                                    initial: "C",
                                    role: "Team Lead",
                                    desc: "Visionary leader who bridges the gap between global businesses and exceptional remote talent.",
                                    tags: ["Leadership", "Business Strategy", "Client Relations"],
                                    gradient: "from-ekko-400 to-ekko-600",
                                    roleColor: "text-ekko-300",
                                    avatar: "/images/team/chelle_team_lead_ghibli.png"
                                },
                                {
                                    name: "Miguel",
                                    initial: "M",
                                    role: "Head of Operations",
                                    desc: "Overall Team Lead overseeing systems, strategy, and cross-team coordination. Manages internal workflows, software tools, and documentation.",
                                    tags: ["Operations Management", "Technical Support", "Software & Tool Setup"],
                                    gradient: "from-ekko-300 to-ekko-500",
                                    roleColor: "text-ekko-300",
                                    avatar: "/images/team/miguel_head_of_ops_ghibli.png"
                                },
                                {
                                    name: "Jai",
                                    initial: "J",
                                    role: "Virtual Agent Operations Manager",
                                    desc: "Ensures smooth day-to-day operations across all client accounts and manages the full virtual assistant deployment pipeline.",
                                    tags: ["Virtual Agent Deployment", "Process Optimization", "Project Management"],
                                    gradient: "from-ekko-300 to-ekko-600",
                                    roleColor: "text-ekko-300",
                                    avatar: "/images/team/jai_va_ops_ghibli.png"
                                },
                                {
                                    name: "Celestin",
                                    initial: "C",
                                    role: "Lead Virtual Assistant",
                                    desc: "Provides high-level administrative and executive support, specializing in assisting C-suite executives.",
                                    tags: ["Executive Support", "Calendar & Schedule Management", "Travel Coordination"],
                                    gradient: "from-ekko-400 to-ekko-600",
                                    roleColor: "text-ekko-300",
                                    avatar: "/images/team/celestin_lead_va_ghibli.png"
                                },
                                {
                                    name: "Megan",
                                    initial: "M",
                                    role: "Client Success Manager",
                                    desc: "Dedicated to delivering exceptional client experiences. Manages onboarding, matches clients with the right virtual assistants.",
                                    tags: ["Client Onboarding", "Account Management", "Performance Monitoring"],
                                    gradient: "from-ekko-500 to-ekko-700",
                                    roleColor: "text-ekko-300",
                                    avatar: "/images/team/megan_client_success_ghibli.png"
                                },
                                {
                                    name: "Biane",
                                    initial: "B",
                                    role: "Sales Agent Lead",
                                    desc: "Leads the sales agent team, training and guiding virtual assistants to generate and qualify leads.",
                                    tags: ["Sales Leadership", "Cold Calling", "Lead Qualification"],
                                    gradient: "from-ekko-400 to-ekko-600",
                                    roleColor: "text-ekko-300",
                                    avatar: "/images/team/biane_sales_lead_ghibli.png"
                                },
                                {
                                    name: "Angelu",
                                    initial: "A",
                                    role: "Marketing Specialist",
                                    desc: "Helps clients build strong brand visibility across digital platforms through creative and strategic marketing initiatives.",
                                    tags: ["Digital Marketing", "Social Media Strategy", "Content Creation"],
                                    gradient: "from-ekko-300 to-ekko-600",
                                    roleColor: "text-ekko-300",
                                    avatar: "/images/team/angelu_marketing_ghibli.png"
                                },
                                {
                                    name: "Kim",
                                    initial: "K",
                                    role: "Social Media Manager",
                                    desc: "Manages and grows client social media accounts by creating engaging content, maintaining posting schedules.",
                                    tags: ["Instagram & Facebook", "Content Scheduling", "Community Engagement"],
                                    gradient: "from-ekko-300 to-ekko-500",
                                    roleColor: "text-ekko-300",
                                    avatar: "/images/team/kim_social_media_ghibli.png"
                                },
                                {
                                    name: "Audrea",
                                    initial: "A",
                                    role: "Customer Support Lead",
                                    desc: "Leads the customer support team, ensuring excellent service delivery through effective communication.",
                                    tags: ["Customer Support Leadership", "Live Chat", "Ticket Resolution"],
                                    gradient: "from-ekko-300 to-ekko-600",
                                    roleColor: "text-ekko-300",
                                    avatar: "/images/team/audrea_support_lead_ghibli.png"
                                },
                                {
                                    name: "Mendy",
                                    initial: "M",
                                    role: "Data Entry Specialist",
                                    desc: "Ensures accurate and reliable data management across all projects, maintaining clean records and up-to-date systems.",
                                    tags: ["Data Entry", "Spreadsheet Management", "CRM Updates"],
                                    gradient: "from-ekko-500 to-ekko-800",
                                    roleColor: "text-ekko-300",
                                    avatar: "/images/team/mendy_data_entry_ghibli.png"
                                },
                                {
                                    name: "Anthony",
                                    initial: "A",
                                    role: "Research Analyst",
                                    desc: "Provides detailed research and analytical support to help clients make informed business decisions.",
                                    tags: ["Market Research", "Competitor Analysis", "Data Interpretation"],
                                    gradient: "from-ekko-300 to-ekko-600",
                                    roleColor: "text-ekko-300",
                                    avatar: "/images/team/anthony_research_ghibli.png"
                                }
                            ].map((member, i) => (
                                <div key={i} className="group glass-card p-6 rounded-none border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 relative overflow-hidden bg-neutral-900/40">
                                    <div className="flex items-center gap-4 mb-4">
                                        <Avatar className="h-12 w-12 ring-2 ring-white/10 group-hover:ring-white/30 transition-all shrink-0 relative">
                                            <AvatarImage
                                                src={member.avatar}
                                                alt={member.name}
                                                className="object-cover"
                                            />
                                            <AvatarFallback className={`bg-gradient-to-br ${member.gradient} text-white text-lg font-black`}>
                                                {member.initial}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="text-lg font-bold tracking-tight text-white">{member.name}</h3>
                                            <p className={`${member.roleColor} text-[10px] font-bold uppercase tracking-wider`}>{member.role}</p>
                                        </div>
                                    </div>

                                    <p className="text-neutral-400 text-xs leading-relaxed mb-4 font-medium">
                                        {member.desc}
                                    </p>

                                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                                        {member.tags.map((tag, j) => (
                                            <span key={j} className="text-[8px] uppercase tracking-wider text-neutral-500 font-bold bg-white/5 px-2 py-1 rounded-none">
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
