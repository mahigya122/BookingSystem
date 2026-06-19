import SidebarLink from "./SidebarLink";
import { useState } from "react";
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
  MessageSquare
} from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);

  const isExpanded = pinned || open;

  const togglePin = () => {
    setPinned((prev) => {
      const next = !prev;
      if (next) setOpen(true);
      return next;
    });
  };

  return (
    <aside
      onMouseEnter={() => {
        if (!pinned) setOpen(true);
      }}
      onMouseLeave={() => {
        if (!pinned) setOpen(false);
      }}
      className="sidebar-panel flex flex-col bg-white dark:bg-slate-900 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] border-r border-slate-100 dark:border-slate-800 relative z-50 shadow-sm"
      style={{
        width: isExpanded ? "280px" : "100px",
      }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-6 border-b border-slate-50 dark:border-slate-800 relative z-10">
        {isExpanded ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <Zap size={16} className="text-sky-600 dark:text-sky-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
                Concierge
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                Admin Suite
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center py-2">
            <Zap size={20} className="text-slate-400 dark:text-slate-500" />
          </div>
        )}

        {isExpanded && (
          <button
            onClick={togglePin}
            className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            {pinned ? <PinOff size={16} /> : <Pin size={16} />}
          </button>
        )}
      </div>

      {/* NAV */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar-hide relative z-10">
        <nav className="space-y-1">
          <SidebarLink to="/dashboard" icon={<Home size={18} />} label="Dashboard" open={isExpanded} end />
          <SidebarLink to="/bookings" icon={<Calendar size={18} />} label="Bookings" open={isExpanded} />
          <SidebarLink to="/book" icon={<Edit3 size={18} />} label="New Entry" open={isExpanded} />
          <SidebarLink to="/payments" icon={<CreditCard size={18} />} label="Payments" open={isExpanded} />

          <div className="py-4 px-4">
            <div className="h-px bg-slate-100 dark:bg-slate-800" />
          </div>

          <SidebarLink to="/cabins" icon={<Hotel size={18} />} label="Inventory" open={isExpanded} />
          <SidebarLink to="/locations" icon={<MapPin size={18} />} label="Locations" open={isExpanded} />
          <SidebarLink to="/offers" icon={<Tag size={18} />} label="Offers" open={isExpanded} />
          <SidebarLink to="/activities" icon={<Sparkles size={18} />} label="Activities" open={isExpanded} />
          <SidebarLink to="/reviews" icon={<MessageSquare size={18} />} label="Reviews" open={isExpanded} />
          <SidebarLink to="/guests" icon={<Users size={18} />} label="Directory" open={isExpanded} />
          <SidebarLink to="/settings" icon={<SettingsIcon size={18} />} label="Settings" open={isExpanded} />
        </nav>
      </div>

      {/* FOOTER */}
      <div className="p-6 border-t border-slate-50 dark:border-slate-800 relative z-10">
        {isExpanded ? (
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800">
              <ShieldCheck size={16} className="text-emerald-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Security Status</span>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">ACTIVE SESSION</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center group cursor-pointer" onClick={() => setOpen(true)}>
            <PanelLeftClose size={20} className="text-slate-300 group-hover:text-sky-500 transition-colors duration-300" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;