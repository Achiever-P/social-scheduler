import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  UsersIcon,
  Wand2Icon,
  LogOutIcon,
  MessageSquareIcon,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  isopen: boolean;
  setIsOpen: (val: boolean) => void;
}

const Sidebar = ({ isopen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboardIcon,
      path: "/dashboard",
    },
    {
      name: "Scheduler",
      icon: CalendarDaysIcon,
      path: "/scheduler",
    },
    {
      name: "Accounts",
      icon: UsersIcon,
      path: "/accounts",
    },
    {
      name: "AI Composer",
      icon: Wand2Icon,
      path: "/ai-composer",
    },
    {
      name: "Feedback",
      icon: MessageSquareIcon,
      path: "/feedback",
    },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col h-full transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 transition-colors duration-200 ${
        isopen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl tracking-tight text-slate-800 dark:text-zinc-100 font-semibold hover:opacity-80 transition-opacity"
        >
          <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
          <span>Scheduler</span>
        </Link>
      </div>

      {/* Menu Label */}
      <div className="px-6 py-2">
        <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          Menu
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm border transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-500 border-red-100 dark:border-red-950/40"
                  : "text-slate-500 dark:text-zinc-400 border-transparent hover:bg-slate-50 dark:hover:bg-zinc-800/40 hover:text-slate-700 dark:hover:text-zinc-200"
              }`}
            >
              <item.icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-red-500" : "text-slate-500 dark:text-zinc-400"
                }`}
              />

              <span>{item.name}</span>

              {isActive && (
                <span className="ml-auto w-[5px] h-5 rounded-full bg-red-500" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center text-white text-sm font-medium shrink-0 shadow-sm">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-zinc-200 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-400 dark:text-zinc-500 truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 dark:hover:text-red-400 transition-all duration-150 cursor-pointer"
        >
          <LogOutIcon className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;