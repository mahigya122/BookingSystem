import { NavLink } from "react-router-dom";

interface SidebarLinkProps {
  to: string;
  icon: string;
  label: string;
  end?: boolean;
  open: boolean;
}

const SidebarLink = ({ to, icon, label, end = false, open }: SidebarLinkProps) => {
  return (
    <NavLink
      to={to}
      end={end}

      className={({ isActive }) =>
        `sidebar-item flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive ? "sidebar-item-active" : ""
        }`
      }
    >
      <span className="text-base">{icon}</span>
      {/* LABEL ONLY WHEN OPEN */}
      {open && <span>{label}</span>}

    </NavLink>
  );
};

export default SidebarLink;
