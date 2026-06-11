import { Link } from "react-router-dom";
import { ArrowRightIcon, SunIcon, MoonIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-slate-100 dark:border-zinc-900 transition-colors duration-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Link to="/" onClick={() => scrollTo(0, 0)} className="flex items-center gap-2 ">
                    <img src="/logo.svg" alt="logo" className="size-7" />
                    <span className="text-xl lg:text-2xl font-semibold font-sans text-slate-800 dark:text-zinc-100">Scheduler</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-650 dark:text-zinc-350">
                    <a href="#features" className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
                        Features
                    </a>
                    <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
                        How it works
                    </a>
                    <a href="#pricing" className="hover:text-slate-900 dark:hover:text-zinc-100 transition-colors">
                        Pricing
                    </a>
                </div>

                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-850 transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer shadow-xs"
                        title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                    >
                        {theme === "light" ? (
                            <MoonIcon className="size-4.5 text-slate-600 animate-in spin-in-45 duration-300" />
                        ) : (
                            <SunIcon className="size-4.5 text-amber-500 animate-in spin-in-45 duration-300" />
                        )}
                    </button>

                    {user ? (
                        <Link to="/dashboard" className="flex items-center gap-1.5 text-sm sm:text-[15px] font-semibold bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-red-200 hover:shadow-md cursor-pointer transition-all active:scale-98">
                            Go to Dashboard <ArrowRightIcon className="size-4" />
                        </Link>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm sm:text-[15px] font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hidden sm:block transition-colors">
                                Sign In
                            </Link>
                            <Link to="/login" className="flex items-center gap-1.5 text-sm sm:text-[15px] font-semibold bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full shadow-sm hover:shadow-red-200 hover:shadow-md cursor-pointer transition-all active:scale-98">
                                Get Started <ArrowRightIcon className="size-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
