import { NavLink } from "react-router-dom";

interface SidebarLinkProps {
  to: string;
  icon: string;
  label: string;
  end?: boolean;
}

const SidebarLink = ({ to, icon, label, end = false }: SidebarLinkProps) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `sidebar-item ${isActive ? "sidebar-item-active" : ""}`
      }
    >
      <span className="text-base">{icon}</span> 
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarLink;
