import { NavLink } from "react-router-dom";
import React from "react";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
  open?: boolean;
}

const SidebarLink = ({ to, icon, label, end = false, open }: SidebarLinkProps) => {
  return (
    <NavLink
      to={to}
      end={end}
      className="block no-underline"
    >
      {({ isActive }) => (
        <div
          className={`
            flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative
            ${isActive
              ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
            }
          `}
        >
          {/* Active Indicator (Vertical line) */}
          <div
            className={`
              absolute left-0 w-1 h-6 bg-sky-500 rounded-r-full transition-all duration-300
              ${isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}
            `}
          />

          <div className={`flex-shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
            {icon}
          </div>
          
          {open && (
            <span className="text-sm tracking-tight whitespace-nowrap overflow-hidden">
              {label}
            </span>
          )}
        </div>
      )}
    </NavLink>
  );
};

export default SidebarLink;
