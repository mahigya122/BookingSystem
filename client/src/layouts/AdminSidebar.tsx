import SidebarLink from "./SidebarLink";
import { useState } from "react";
import { Pin, PinOff, PanelLeftClose, PanelLeftOpen } from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);

  const isExpanded = pinned || open;

  const togglePin = () => {
    setPinned((prev) => {
      const next = !prev;

      // if pinning → force open
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
      className="sidebar-panel flex flex-col backdrop-blur-xl overflow-hidden transition-all duration-300"
      style={{
        width: isExpanded ? "240px" : "64px",
        borderRight: "1px solid var(--app-border)",
      }}
    >
      {/* HEADER (CLICKABLE AREA FOR PIN TOGGLE) */}
      <div
        onClick={togglePin}
        className="flex items-center justify-between px-3 py-3 cursor-pointer select-none hover:bg-black/5 dark:hover:bg-white/5 transition"
      >
        {isExpanded ? (
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Menu
          </div>
        ) : (
          <div className="w-full flex justify-center">
            {/* small visual hint when collapsed */}
            <PanelLeftOpen size={16} className="text-slate-400" />
          </div>
        )}

        {isExpanded && (
          <div className="text-slate-500 hover:text-emerald-600 transition">
            {pinned ? <PinOff size={18} /> : <Pin size={18} />}
          </div>
        )}
      </div>

      {/* NAV */}
      <div className="flex-1 overflow-y-auto py-4 px-2">
        <nav className="space-y-1">
          <SidebarLink to="/dashboard" icon="🏠" label="Overview" open={isExpanded} end />
          <SidebarLink to="/bookings" icon="📅" label="Bookings" open={isExpanded} />
          <SidebarLink to="/book" icon="✏️" label="New Booking" open={isExpanded} />
          <SidebarLink to="/payments" icon="💳" label="Payments" open={isExpanded} />
          <SidebarLink to="/cabins" icon="🏨" label="Cabins" open={isExpanded} />
          <SidebarLink to="/guests" icon="👤" label="Guests" open={isExpanded} />
          <SidebarLink to="/settings" icon="⚙️" label="Settings" open={isExpanded} />
        </nav>
      </div>

      {/* FOOTER */}
      <div className="p-3 border-t border-[var(--app-border)]">
        {isExpanded ? (
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            System Live
          </div>
        ) : (
          <div className="flex justify-center">
            <PanelLeftClose size={16} className="text-slate-400" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;