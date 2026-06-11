import { CheckIcon, CircleCheckBigIcon } from "lucide-react";
import { Link } from "react-router-dom";

const pricingPlans = [
    {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for creators just getting started with social media automation.",
        features: ["2 social accounts", "10 scheduled posts/month", "AI content (5 credits/mo)", "Basic dashboard"],
        cta: "Get Started Free",
        highlight: false,
    },
    {
        name: "Pro",
        price: "$29",
        period: "/month",
        description: "Everything you need to grow and automate your social presence.",
        features: ["Unlimited accounts", "Unlimited scheduling", "AI content (200 credits/mo)", "Priority support"],
        cta: "Start 14-day Free Trial",
        highlight: true,
    },
    {
        name: "Agency",
        price: "$79",
        period: "/month",
        description: "For teams and agencies managing multiple brands at scale.",
        features: ["Everything in Pro", "5 team members", "Unlimited AI credits", "Custom AI personas", "Dedicated support"],
        cta: "Contact Sales",
        highlight: false,
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-white dark:bg-zinc-950 transition-colors duration-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <div className="mb-6 inline-flex items-center gap-1.5 bg-red-500/10 dark:bg-red-500/20 border border-red-500/15 dark:border-red-500/30 text-red-500 dark:text-red-400 text-[11px] font-semibold tracking-[0.06em] uppercase px-3.5 py-1.5 rounded-full">
                        <CircleCheckBigIcon className="size-3" />
                        Simple pricing
                    </div>
                    <h2 className="font-serif font-semibold text-4xl sm:text-5xl leading-tight text-slate-900 dark:text-zinc-100">
                        Plans for every stage
                        <br />
                        <span className="text-red-400 italic">of growth</span>
                    </h2>
                    <p className="mt-5 text-slate-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">Start free, upgrade when you're ready. Cancel anytime — no hidden fees.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                    {pricingPlans.map((plan) => (
                        <div key={plan.name} className={`rounded-2xl border p-7 flex flex-col gap-6 relative shadow-xs transition-all ${plan.highlight ? "bg-red-500 text-white border-red-400 shadow-2xl shadow-red-100/10 dark:shadow-none" : "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 border-slate-200 dark:border-zinc-800"}`}>
                            {plan.highlight && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-zinc-950 text-white dark:text-zinc-200 text-xs font-bold px-3.5 py-1.5 rounded-full border border-transparent dark:border-zinc-850 shadow-sm">Most Popular</div>}
                            <div>
                                <div className={`text-sm font-semibold mb-1 ${plan.highlight ? "text-red-100" : "text-red-500 dark:text-red-400"}`}>{plan.name}</div>
                                <div className="flex items-end gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className={`text-sm mb-1.5 ${plan.highlight ? "text-red-200" : "text-slate-400 dark:text-zinc-500"}`}>{plan.period}</span>
                                </div>
                                <p className={`text-sm mt-2 leading-relaxed ${plan.highlight ? "text-red-150" : "text-slate-550 dark:text-zinc-400"}`}>{plan.description}</p>
                            </div>

                            <ul className="space-y-2.5">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2.5 text-sm">
                                        <div className={`size-4 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? "bg-red-400" : "bg-red-50 dark:bg-red-950/20 border border-red-100/30 dark:border-red-900/40"}`}>
                                            <CheckIcon className={`w-2.5 h-2.5 ${plan.highlight ? "text-white" : "text-red-500 dark:text-red-400"}`} />
                                        </div>
                                        <span className={plan.highlight ? "text-red-50" : "text-slate-600 dark:text-zinc-300"}>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link to="/login" className={`mt-auto text-center font-semibold text-sm px-6 py-3 rounded-full cursor-pointer transition-colors ${plan.highlight ? "bg-white text-red-500 hover:bg-red-50 active:bg-slate-100" : "bg-red-500 text-white hover:bg-red-600 active:bg-red-700"}`}>
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
