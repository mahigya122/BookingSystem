import SidebarLink from "./SidebarLink";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <nav className="space-y-2">
        <SidebarLink to="/dashboard" icon="🏠" label="Home" end />
        <SidebarLink to="/dashboard/bookings" icon="📅" label="Bookings" />
        <SidebarLink to="/dashboard/book" icon="✏️" label="Book" />
        <SidebarLink to="/dashboard/cabins" icon="🏨" label="Cabins" />
        <SidebarLink to="/dashboard/guests" icon="👤" label="Guests" />
        <SidebarLink to="/dashboard/settings" icon="⚙️" label="Settings" />
      </nav>
    </aside>
  );
};

export default Sidebar;
