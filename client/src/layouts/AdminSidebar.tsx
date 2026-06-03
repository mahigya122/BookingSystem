import SidebarLink from "./SidebarLink";

const Sidebar = () => {
  return (
    <aside className="sidebar-panel w-64 flex flex-col backdrop-blur-xl relative overflow-hidden" style={{ borderRight: "1px solid var(--app-border)" }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-60" style={{ background: "linear-gradient(180deg, color-mix(in srgb, var(--app-primary) 18%, transparent), transparent)" }} />
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--app-text-muted)" }}>Management</div>
          <SidebarLink to="/admin/dashboard" icon="🏠" label="Overview" end />
          <SidebarLink to="/admin/bookings" icon="📅" label="Bookings" />
          <SidebarLink to="/admin/book" icon="✏️" label="New Booking" />
          <SidebarLink to="/admin/cabins" icon="🏨" label="Cabins" />
          <SidebarLink to="/admin/guests" icon="👤" label="Guests" />
          
          <div className="pt-6 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--app-text-muted)" }}>Settings</div>
          <SidebarLink to="/admin/settings" icon="⚙️" label="System Settings" />
        </nav>
      </div>
      
      <div className="p-4" style={{ borderTop: "1px solid var(--app-border)" }}>
        <div className="rounded-xl p-3" style={{ background: "color-mix(in srgb, var(--app-surface-elevated) 88%, white 12%)", border: "1px solid var(--app-border)" }}>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--app-text-muted)" }}>Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(11,143,76,0.55)]" style={{ background: "var(--app-primary)" }} />
            <span className="text-xs font-bold" style={{ color: "var(--app-text-main)" }}>System Live</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
