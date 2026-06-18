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
      className="sidebar-panel flex flex-col backdrop-blur-3xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] border-r border-sky-100/50 dark:border-sky-900/20 shadow-[20px_0_80px_-15px_rgba(14,165,233,0.1)] relative z-50"
      style={{
        width: isExpanded ? "280px" : "100px",
      }}
    >
      {/* DECORATIVE BACKGROUND ELEMENTS */}
      <div className="absolute top-20 right-0 w-32 h-32 bg-sky-400/10 dark:bg-sky-400/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-40 -left-10 w-24 h-24 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full blur-[60px] pointer-events-none" />

      {/* HEADER */}
      <div className="flex items-center justify-between p-6 border-b border-sky-50 dark:border-sky-900/20 relative z-10">
        {isExpanded ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 shadow-lg shadow-sky-500/20">
              <Zap size={20} className="text-white fill-white/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-500 leading-none mb-1">
                Concierge
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                Admin Suite
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center py-2">
            <Zap size={24} className="text-sky-500 fill-sky-500/10" />
          </div>
        )}

        {isExpanded && (
          <button
            onClick={togglePin}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-sky-500"
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
            <div className="h-px bg-slate-100 dark:bg-slate-800/50" />
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
      <div className="p-6 border-t border-sky-100/30 dark:border-sky-900/20 relative z-10">
        {isExpanded ? (
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-sky-100/50 dark:border-sky-800/20">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 shadow-lg shadow-emerald-500/20">
              <ShieldCheck size={16} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Security Status</span>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">ACTIVE SESSION</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center group cursor-pointer" onClick={() => setOpen(true)}>
            <PanelLeftClose size={20} className="text-slate-300 group-hover:text-sky-500 transition-colors duration-500" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;