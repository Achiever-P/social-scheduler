import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 bg-white dark:bg-zinc-950 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="relative rounded-3xl overflow-hidden p-14 sm:p-20 text-center bg-linear-to-br from-red-50/60 to-red-100/30 dark:from-red-950/20 dark:to-red-950/5 border border-red-500/10 dark:border-red-900/30 transition-colors duration-200 shadow-xs">
          {/* Glow blobs */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(239,68,68,0.04) 0%, transparent 70%)",
            }}
          />

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-1.5 bg-red-500/10 dark:bg-red-500/20 border border-red-500/15 dark:border-red-500/30 text-red-500 dark:text-red-400 text-[11px] font-semibold tracking-[0.06em] uppercase px-3.5 py-1.5 rounded-full">
              Ready to grow?
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight font-semibold text-slate-900 dark:text-zinc-100">
              Automate your social
              <br />
              <span className="text-red-400 italic">media today</span>
            </h2>
            <p className="mt-6 text-slate-500 dark:text-zinc-400 max-w-lg mx-auto text-lg leading-relaxed">
              Join thousands of creators and marketers who trust Scheduler to
              grow their audience on autopilot.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/login"
                className="bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold hover:shadow-[0_8px_24px_rgba(239,68,68,0.35)] inline-flex items-center gap-2 text-[15px] px-10 py-4 w-full sm:w-auto justify-center cursor-pointer shadow-sm active:scale-98"
              >
                Get Started Free <ArrowRightIcon className="size-4" />
              </Link>
              <a
                href="#pricing"
                className="bg-transparent text-slate-700 dark:text-zinc-300 border-[1.5px] border-slate-200 dark:border-zinc-800 rounded-full font-medium hover:bg-slate-50 dark:hover:bg-zinc-900 hover:border-slate-350 dark:hover:border-zinc-700 inline-flex items-center gap-2 text-[15px] px-10 py-4 w-full sm:w-auto justify-center cursor-pointer transition-colors"
              >
                View Pricing
              </a>
            </div>

            <p className="mt-6 text-xs text-slate-400 dark:text-zinc-550">
              No credit card required · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
