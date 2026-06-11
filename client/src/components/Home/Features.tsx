import { CalendarDaysIcon, Wand2Icon, Share2Icon, ZapIcon, BarChart3Icon, HashIcon } from "lucide-react";

const features = [
    {
        icon: CalendarDaysIcon,
        title: "Smart Scheduling",
        description: "Queue posts across all platforms with a single click. Set it once and let us handle the rest.",
        color: "bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 border border-red-100/40 dark:border-red-900/40",
    },
    {
        icon: Wand2Icon,
        title: "AI Content Generator",
        description: "Generate on-brand captions and stunning images with our built-in AI. Never stare at a blank page again.",
        color: "bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 border border-red-100/40 dark:border-red-900/40",
    },
    {
        icon: BarChart3Icon,
        title: "Activity Dashboard",
        description: "Get a bird's eye view of all published posts, scheduled content, and engagement activity in one place.",
        color: "bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 border border-red-100/40 dark:border-red-900/40",
    },
    {
        icon: Share2Icon,
        title: "Multi-Platform",
        description: "Connect Twitter, LinkedIn, Facebook, and Instagram. Post everywhere from one unified workspace.",
        color: "bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 border border-red-100/40 dark:border-red-900/40",
    },
    {
        icon: ZapIcon,
        title: "Instant Publishing",
        description: "Need to go live now? Publish immediately or schedule for peak engagement times with full timezone support.",
        color: "bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 border border-red-100/40 dark:border-red-900/40",
    },
    {
        icon: HashIcon,
        title: "Hashtag Suggestions",
        description: "Get AI-powered hashtag suggestions to reach a wider audience.",
        color: "bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 border border-red-100/40 dark:border-red-900/40",
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-slate-50 dark:bg-zinc-900/30 transition-colors duration-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <div className="mb-6 inline-flex items-center gap-1.5 bg-red-500/10 dark:bg-red-500/20 border border-red-500/15 dark:border-red-500/30 text-red-500 dark:text-red-400 text-[11px] font-semibold tracking-[0.06em] uppercase px-3.5 py-1.5 rounded-full">
                        <ZapIcon className="size-3" />
                        Everything you need
                    </div>
                    <h2 className="font-serif text-4xl sm:text-5xl font-semibold leading-tight text-slate-900 dark:text-zinc-100">
                        Automate your entire
                        <br />
                        <span className="text-red-400 italic">social media workflow</span>
                    </h2>
                    <p className="mt-5 text-slate-550 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">From content creation to scheduling — Scheduler handles it all so you can focus on what matters most.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f) => (
                        <div key={f.title} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-6 hover:border-slate-200 dark:hover:border-zinc-700 hover:shadow-md dark:hover:shadow-none transition-all group">
                            <div className={`size-10 rounded-xl border flex items-center justify-center mb-4 ${f.color}`}>
                                <f.icon className="size-5" />
                            </div>
                            <h3 className="text-slate-900 dark:text-zinc-100 font-semibold mb-2">{f.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
