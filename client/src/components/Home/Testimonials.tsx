import { useEffect, useState } from "react";
import { StarIcon } from "lucide-react";
import api from "../../api/axios";

interface Testimonial {
    name: string;
    role: string;
    avatar?: string;
    avatarBg: string;
    text: string;
    rating?: number;
}

const STATIC_TESTIMONIALS: Testimonial[] = [
    {
        name: "Sarah K.",
        role: "Marketing Manager",
        avatar: "S",
        avatarBg: "from-red-400 to-pink-400",
        text: "Scheduler has saved our team 10+ hours a week. The AI composer is genuinely impressive — it writes content that sounds like us.",
    },
    {
        name: "Marcus L.",
        role: "Indie Creator",
        avatar: "M",
        avatarBg: "from-violet-400 to-purple-500",
        text: "I used to dread posting. Now I queue up a whole week of content in 20 minutes. The smart scheduling feature alone is worth it.",
    },
    {
        name: "Priya D.",
        role: "Startup Founder",
        avatar: "P",
        avatarBg: "from-sky-400 to-blue-500",
        text: "Finally a scheduler that's beautiful AND powerful. The clean dashboard makes it easy to see exactly what's going out and when.",
    },
];

const getSafeAvatarBg = (bg: string) => {
    if (!bg) return "from-red-400 to-pink-400 bg-gradient-to-br";
    const key = bg.toLowerCase();
    if (key.includes("red") || key.includes("pink-400")) return "from-red-400 to-pink-400 bg-gradient-to-br";
    if (key.includes("pink")) return "from-red-400 to-pink-500 bg-gradient-to-br";
    if (key.includes("violet") || key.includes("purple")) return "from-violet-400 to-purple-500 bg-gradient-to-br";
    if (key.includes("sky") || key.includes("blue")) return "from-sky-400 to-blue-500 bg-gradient-to-br";
    if (key.includes("amber") || key.includes("orange")) return "from-amber-400 to-orange-500 bg-gradient-to-br";
    if (key.includes("emerald") || key.includes("teal")) return "from-emerald-400 to-teal-500 bg-gradient-to-br";
    if (key.includes("fuchsia")) return "from-fuchsia-400 to-pink-500 bg-gradient-to-br";
    return "from-red-400 to-pink-500 bg-gradient-to-br";
};

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(STATIC_TESTIMONIALS);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const { data } = await api.get("/api/feedback");
                if (Array.isArray(data) && data.length > 0) {
                    setTestimonials([...data, ...STATIC_TESTIMONIALS]);
                }
            } catch (error) {
                console.error("Error fetching feedback:", error);
            }
        };
        fetchFeedback();
    }, []);

    return (
        <section className="py-24 bg-slate-50 dark:bg-zinc-900/30 transition-colors duration-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-14">
                    <div className="mb-6 inline-flex items-center gap-1.5 bg-red-500/10 dark:bg-red-500/20 border border-red-500/15 dark:border-red-500/30 text-red-500 dark:text-red-400 text-[11px] font-semibold tracking-[0.06em] uppercase px-3.5 py-1.5 rounded-full">
                        <StarIcon className="size-3 " />
                        Testimonials
                    </div>
                    <h2 className="font-serif font-semibold text-4xl sm:text-5xl leading-tight text-slate-900 dark:text-zinc-100">
                        Loved by <span className="text-red-400 ">creators &amp; teams</span>
                    </h2>
                    <p className="mt-5 text-slate-500 dark:text-zinc-400 max-w-md mx-auto">Join thousands of people who automate their social media with Scheduler.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 hover:border-slate-200 dark:hover:border-zinc-700 hover:shadow-lg dark:hover:shadow-none p-6 transition-all flex flex-col gap-4">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, idx) => (
                                    <StarIcon
                                        key={idx}
                                        className={`size-3.5 ${
                                            idx < (t.rating ?? 5)
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-slate-200 dark:text-zinc-800"
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="text-slate-600 dark:text-zinc-300 text-sm leading-relaxed flex-1">"{t.text}"</p>
                            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
                                <div className={`size-9 rounded-full ${getSafeAvatarBg(t.avatarBg)} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-xs`}>
                                    {t.avatar || t.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{t.name}</div>
                                    <div className="text-xs text-slate-400 dark:text-zinc-500">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
