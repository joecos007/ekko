import { AuroraBackground } from "@/components/auth/aurora-background"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const teamMembers = [
    {
        name: "Oliver.O",
        initial: "O",
        role: "Project Architect",
        subtitle: "Creator",
        description: "Crafted the EKKO project. The visionary mind behind the architecture, design, and execution of the platform.",
        gradient: "from-ekko-500 to-ekko-700",
        tags: ["#Architecture", "#Design", "#Vision"],
        featured: true,
        avatar: "/images/team/oliver_featured_ghibli.png"
    },
    {
        name: "Chelle",
        initial: "C",
        role: "Team Lead",
        description: "Visionary leader who bridges the gap between global businesses and exceptional remote talent.",
        gradient: "from-ekko-400 to-ekko-600",
        tags: ["#Leadership", "#BusinessStrategy", "#ClientRelations"],
        avatar: "/images/team/chelle_team_lead_ghibli.png"
    },
    {
        name: "Miguel",
        initial: "M",
        role: "Head of Operations",
        description: "Overall Team Lead overseeing systems, strategy, and cross-team coordination. Manages internal workflows, software tools, and documentation.",
        gradient: "from-ekko-300 to-ekko-500",
        tags: ["#OperationsManagement", "#TechnicalSupport", "#Software&ToolSetup"],
        avatar: "/images/team/miguel_head_of_ops_ghibli.png"
    },
    {
        name: "Jai",
        initial: "J",
        role: "Virtual Agent Operations Manager",
        description: "Ensures smooth day-to-day operations across all client accounts and manages the full virtual assistant deployment pipeline.",
        gradient: "from-ekko-300 to-ekko-600",
        tags: ["#VirtualAgentDeployment", "#ProcessOptimization", "#ProjectManagement"],
        avatar: "/images/team/jai_va_ops_ghibli.png"
    },
    {
        name: "Celestin",
        initial: "C",
        role: "Lead Virtual Assistant",
        description: "Provides high-level administrative and executive support, specializing in assisting C-suite executives.",
        gradient: "from-ekko-400 to-ekko-600",
        tags: ["#ExecutiveSupport", "#Calendar&ScheduleManagement", "#TravelCoordination"],
        avatar: "/images/team/celestin_lead_va_ghibli.png"
    },
    {
        name: "Megan",
        initial: "M",
        role: "Client Success Manager",
        description: "Dedicated to delivering exceptional client experiences. Manages onboarding, matches clients with the right virtual assistants.",
        gradient: "from-ekko-500 to-ekko-700",
        tags: ["#ClientOnboarding", "#AccountManagement", "#PerformanceMonitoring"],
        avatar: "/images/team/megan_client_success_ghibli.png"
    },
    {
        name: "Biane",
        initial: "B",
        role: "Sales Agent Lead",
        description: "Leads the sales agent team, training and guiding virtual assistants to generate and qualify leads.",
        gradient: "from-ekko-400 to-ekko-600",
        tags: ["#SalesLeadership", "#ColdCalling", "#LeadQualification"],
        avatar: "/images/team/biane_sales_lead_ghibli.png"
    },
    {
        name: "Angelu",
        initial: "A",
        role: "Marketing Specialist",
        description: "Helps clients build strong brand visibility across digital platforms through creative and strategic marketing initiatives.",
        gradient: "from-ekko-300 to-ekko-600",
        tags: ["#DigitalMarketing", "#SocialMediaStrategy", "#ContentCreation"],
        avatar: "/images/team/angelu_marketing_ghibli.png"
    },
    {
        name: "Kim",
        initial: "K",
        role: "Social Media Manager",
        description: "Manages and grows client social media accounts by creating engaging content, maintaining posting schedules.",
        gradient: "from-ekko-300 to-ekko-500",
        tags: ["#Instagram&Facebook", "#ContentScheduling", "#CommunityEngagement"],
        avatar: "/images/team/kim_social_media_ghibli.png"
    },
    {
        name: "Audrea",
        initial: "A",
        role: "Customer Support Lead",
        description: "Leads the customer support team, ensuring excellent service delivery through effective communication.",
        gradient: "from-ekko-300 to-ekko-600",
        tags: ["#CustomerSupportLeadership", "#LiveChat", "#TicketResolution"],
        avatar: "/images/team/audrea_support_lead_ghibli.png"
    },
    {
        name: "Mendy",
        initial: "M",
        role: "Data Entry Specialist",
        description: "Ensures accurate and reliable data management across all projects, maintaining clean records and up-to-date systems.",
        gradient: "from-ekko-500 to-ekko-800",
        tags: ["#DataEntry", "#SpreadsheetManagement", "#CRMUpdates"],
        avatar: "/images/team/mendy_data_entry_ghibli.png"
    },
    {
        name: "Anthony",
        initial: "A",
        role: "Research Analyst",
        description: "Provides detailed research and analytical support to help clients make informed business decisions.",
        gradient: "from-ekko-300 to-ekko-600",
        tags: ["#MarketResearch", "#CompetitorAnalysis", "#DataInterpretation"],
        avatar: "/images/team/anthony_research_ghibli.png"
    }
]

export default function TeamPage() {
    const featured = teamMembers.filter(m => m.featured)
    const coreTeam = teamMembers.filter(m => !m.featured)

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-12 font-geist-sans selection:bg-ekko-500 selection:text-white">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <AuroraBackground className="opacity-20" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4">
                        THE PEOPLE BEHIND <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-ekko-400 to-ekko-600">THE SYSTEM.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
                        The dedicated professionals behind Team Ekko who make remote staffing seamless.
                    </p>
                </div>

                {/* Featured Member - Project Architect */}
                {featured.map((member) => (
                    <div key={member.name} className="mb-20">
                        <div className="bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-none p-8 md:p-12 hover:border-ekko-500/30 transition-all duration-300 group">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-4 ring-white/10 group-hover:ring-ekko-500/30 transition-all">
                                    {member.avatar && (
                                        <AvatarImage
                                            src={member.avatar}
                                            alt={member.name}
                                            className="object-cover"
                                        />
                                    )}
                                    <AvatarFallback className={`bg-gradient-to-br ${member.gradient} text-white text-5xl md:text-6xl font-black`}>
                                        {member.initial}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-3xl md:text-4xl font-black mb-2 text-white">{member.name}</h2>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                                        <Badge className="bg-ekko-500/20 text-ekko-300 border-ekko-500/30 text-sm">
                                            {member.role}
                                        </Badge>
                                        <Badge className="bg-white/10 text-white border-white/20 text-sm">
                                            {member.subtitle}
                                        </Badge>
                                    </div>
                                    <p className="text-neutral-300 text-lg leading-relaxed mb-4">
                                        {member.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        {member.tags?.map((tag) => (
                                            <span key={tag} className="text-xs text-neutral-500 font-mono">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Core Team Section */}
                <div className="mb-12">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-8 text-center">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-ekko-300 to-ekko-600">Core Team</span>
                    </h2>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {coreTeam.map((member) => (
                        <div
                            key={member.name}
                            className="bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-none p-6 hover:border-ekko-500/30 transition-all duration-300 group hover:scale-[1.02]"
                        >
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="h-20 w-20 mb-4 ring-2 ring-white/10 group-hover:ring-ekko-500/30 transition-all">
                                    {member.avatar && (
                                        <AvatarImage
                                            src={member.avatar}
                                            alt={member.name}
                                            className="object-cover"
                                        />
                                    )}
                                    <AvatarFallback className={`bg-gradient-to-br ${member.gradient} text-white text-2xl font-black`}>
                                        {member.initial}
                                    </AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-bold mb-1 text-white">{member.name}</h3>
                                <Badge className="bg-ekko-500/20 text-ekko-300 border-ekko-500/30 text-xs mb-3">
                                    {member.role}
                                </Badge>
                                <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                                    {member.description}
                                </p>
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                    {member.tags?.map((tag) => (
                                        <span key={tag} className="text-[10px] text-neutral-600 font-mono">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-br from-ekko-900/30 to-ekko-700/20 border border-ekko-500/20 rounded-none p-8 md:p-12 text-center">
                    <h3 className="text-2xl md:text-4xl font-black mb-4 text-white">
                        Want to Join Our Team?
                    </h3>
                    <p className="text-neutral-300 text-lg mb-6 max-w-2xl mx-auto">
                        We&apos;re always looking for talented Virtual Assistants and Agents to join our network.
                    </p>
                    <Link href="/signup">
                        <Button className="bg-white text-black hover:bg-neutral-200 rounded-full px-8 h-12 text-base font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:scale-105">
                            Apply Now
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
