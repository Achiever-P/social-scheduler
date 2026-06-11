import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { MenuIcon, SunIcon, MoonIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/scheduler": "Post Scheduler",
  "/feedback": "Share Feedback",
  "/accounts": "Social Accounts",
  "/ai-composer": "AI Composer",
};

const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const title = pageTitles[location.pathname] || "SocialAI";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950 transition-colors duration-200">
        <div
          className="size-8 border-4 border-red-500 border-t-transparent
        rounded-full animate-spin"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        isopen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between px-4 md:px-8 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <MenuIcon className="size-6" />
            </button>

            <div>
              <h1 className="text-slate-900 dark:text-zinc-100 font-semibold">{title}</h1>
              <p className="text-sm text-slate-400 dark:text-zinc-500 hidden sm:block">
                Manage and automate your social presence
              </p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-700 dark:hover:text-zinc-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer shadow-xs"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <MoonIcon className="size-5 text-slate-600 animate-in spin-in-45 duration-300" />
            ) : (
              <SunIcon className="size-5 text-amber-500 animate-in spin-in-45 duration-300" />
            )}
          </button>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 xl:p-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;