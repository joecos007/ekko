import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Music, Heart, Zap, Globe, User, Users, Briefcase, Mail } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-6 lg:px-12 font-geist-sans selection:bg-purple-500 selection:text-white">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-20 text-center">
                    <div className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-blue-400 text-[10px] uppercase tracking-widest mb-6 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Meet Our Team
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                        THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">PEOPLE</span> BEHIND <br /> THE SYSTEM.
                    </h1>
                    <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto">
                        The dedicated professionals behind Team Ekko who make remote staffing seamless.
                    </p>
                </div>

                {/* Creator Spotlight: Oliver.O */}
                <div className="mb-24 max-w-3xl mx-auto">
                    <div className="bg-gradient-to-br from-neutral-900/80 to-black p-8 md:p-12 rounded-3xl border border-yellow-500/20 shadow-[0_0_50px_rgba(234,179,8,0.1)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 transition-all duration-700 group-hover:scale-150" />

                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-800 p-[3px] shadow-lg shadow-yellow-500/20 shrink-0">
                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                    <span className="text-3xl md:text-5xl font-bold text-yellow-500">O</span>
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-3xl font-black tracking-tight text-white mb-2">Oliver.O</h3>
                                <div className="inline-flex items-center gap-3 mb-4 justify-center md:justify-start">
                                    <span className="text-yellow-500 text-sm font-bold uppercase tracking-widest">Project Architect</span>
                                    <span className="w-1.5 h-1.5 bg-neutral-600 rounded-full" />
                                    <span className="text-neutral-500 text-sm uppercase tracking-widest">Creator</span>
                                </div>
                                <p className="text-neutral-300 text-base leading-relaxed max-w-xl">
                                    Crafted the EKKO project. The visionary mind behind the architecture, design, and execution of the platform.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Core Team Grid */}
                <h2 className="text-3xl font-black tracking-tight mb-12 text-center">Our Core Team</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
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
                        <div key={i} className="group glass-card p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 relative overflow-hidden bg-neutral-900/40">
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-${member.color}-500/10 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} />

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-lg font-bold text-white border border-white/10 shadow-lg">
                                    {member.name[0]}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight">{member.name}</h3>
                                    <p className={`text-${member.color}-400 text-xs font-bold uppercase tracking-wider`}>{member.role}</p>
                                </div>
                            </div>

                            <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-medium">
                                {member.desc}
                            </p>

                            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                                {member.tags.map((tag, j) => (
                                    <span key={j} className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold bg-white/5 px-2 py-1 rounded-sm">
                                        #{tag.replace(/\s+/g, '')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="border-t border-white/10 pt-16 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight mb-2 text-white">Want to Join Our Team?</h2>
                        <p className="text-neutral-400 max-w-md">We're always looking for talented Virtual Assistants and Agents to join our network.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button disabled className="rounded-full h-14 px-10 bg-white/5 text-neutral-400 font-bold tracking-widest uppercase cursor-not-allowed border border-white/5">
                            Applications Opening Soon
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
