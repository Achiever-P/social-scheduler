import {
  CalendarDaysIcon,
  LayoutDashboardIcon,
  UsersIcon,
  Wand2Icon,
  LogOutIcon,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

interface SidebarProps {
  isopen: boolean;
  setIsOpen: (val: boolean) => void;
}

const Sidebar = ({ isopen, setIsOpen }: SidebarProps) => {
  const location = useLocation();

  const logout = () => {
    window.location.href = "/";
  };

  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
  };

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
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col h-full transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
        isopen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2 text-xl tracking-tight text-slate-800">
          <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
          <span>Scheduler</span>
        </div>
      </div>

      {/* Menu Label */}
      <div className="px-6 py-2">
        <span className="text-xs uppercase tracking-wider text-slate-500">
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm border transition-all duration-150 ${
                isActive
                  ? "bg-red-50 text-red-600 border-red-100"
                  : "text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <item.icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-red-500" : "text-slate-500"
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
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center text-white text-sm font-medium shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user.email}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
        >
          <LogOutIcon className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;