import SidebarLink from "./SidebarLink";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAdminSidebar } from "../domains/admin/contexts/AdminSidebarContext";
import {
  Pin,
  PinOff,
  PanelLeftClose,
  ShieldCheck,
  Home,
  Calendar,
  Edit3,
  CreditCard,
  Hotel,
  Users,
  Settings as SettingsIcon,
  Zap,
  MapPin,
  Tag,
  Sparkles,
  MessageSquare,
  X
} from "lucide-react";
import { useAdminUnreadSupportCount } from "@shared/hooks/useAdminUnreadSupportCount";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const { open: mobileOpen, setOpen: setMobileOpen } = useAdminSidebar();
  const { pathname } = useLocation();
  const unreadSupportCount = useAdminUnreadSupportCount();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  const isExpanded = pinned || open || mobileOpen;

  const togglePin = () => {
    setPinned((prev) => {
      const next = !prev;
      if (next) setOpen(true);
      return next;
    });
  };

  return (
    <>
      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
        />
      )}
      <aside
        onMouseEnter={() => {
          if (!pinned) setOpen(true);
        }}
        onMouseLeave={() => {
          if (!pinned) setOpen(false);
        }}
        className={`sidebar-panel flex flex-col bg-white dark:bg-slate-900 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] border-r border-slate-100 dark:border-slate-800 z-50 shadow-lg lg:shadow-sm fixed inset-y-0 left-0 lg:static lg:h-auto ${
          mobileOpen ? "translate-x-0 flex" : "-translate-x-full lg:translate-x-0 hidden lg:flex"
        } w-[220px] ${isExpanded ? "lg:w-[220px]" : "lg:w-[80px]"}`}
      >
        {/* HEADER */}
        <div className={`flex items-center ${isExpanded ? "justify-between" : "justify-center"} px-4 py-4 border-b border-slate-50 dark:border-slate-800 relative z-10 shrink-0`}>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shrink-0">
              <Zap size={14} className="text-sky-600 dark:text-sky-400" />
            </div>
            {isExpanded && (
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
                  Concierge
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">
                  Admin Suite
                </span>
              </div>
            )}
          </div>

          {isExpanded && (
            <>
              {/* Desktop Pin Button */}
              <button
                onClick={togglePin}
                className="hidden lg:block p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {pinned ? <PinOff size={14} /> : <Pin size={14} />}
              </button>

              {/* Mobile Close Button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </>
          )}
        </div>

        {/* NAV */}
        <div className="flex-1 flex flex-col justify-between py-4 px-2 relative z-10 overflow-y-auto custom-scrollbar-hide">
          {/* Top section: groups */}
          <div className="space-y-4">
            {/* Group 1: Operations */}
            <div className="space-y-1">
              {isExpanded ? (
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 block mb-1.5">
                  Operations
                </span>
              ) : (
                <div className="h-2" />
              )}
              <SidebarLink to="/messages" icon={<MessageSquare size={14} />} label="Support" open={isExpanded} badge={unreadSupportCount} />
              <SidebarLink to="/dashboard" icon={<Home size={14} />} label="Dashboard" open={isExpanded} end />
              <SidebarLink to="/bookings" icon={<Calendar size={14} />} label="Bookings" open={isExpanded} />
              <SidebarLink to="/book" icon={<Edit3 size={14} />} label="New Entry" open={isExpanded} />
              <SidebarLink to="/payments" icon={<CreditCard size={14} />} label="Payments" open={isExpanded} />
            </div>

            {/* Group 2: Management */}
            <div className="space-y-1">
              {isExpanded && (
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 block mb-1.5">
                  Management
                </span>
              )}
              <SidebarLink to="/cabins" icon={<Hotel size={14} />} label="Inventory" open={isExpanded} />
              <SidebarLink to="/locations" icon={<MapPin size={14} />} label="Locations" open={isExpanded} />
              <SidebarLink to="/offers" icon={<Tag size={14} />} label="Offers" open={isExpanded} />
              <SidebarLink to="/activities" icon={<Sparkles size={14} />} label="Activities" open={isExpanded} />
              <SidebarLink to="/reviews" icon={<MessageSquare size={14} />} label="Reviews" open={isExpanded} />
              <SidebarLink to="/guests" icon={<Users size={14} />} label="Directory" open={isExpanded} />
            </div>
          </div>

          {/* Bottom section: Settings */}
          <div className="mt-8 space-y-1">
            <SidebarLink to="/settings" icon={<SettingsIcon size={14} />} label="Settings" open={isExpanded} />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-4 py-4 border-t border-slate-50 dark:border-slate-800 relative z-10 shrink-0">
          {isExpanded ? (
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 shrink-0">
                <ShieldCheck size={14} className="text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Security</span>
                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400">ACTIVE</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center group cursor-pointer py-1" onClick={() => setOpen(true)}>
              <PanelLeftClose size={18} className="text-slate-300 group-hover:text-sky-500 transition-colors duration-300" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;