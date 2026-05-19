import { NavLink } from "react-router-dom";

interface SidebarLinkProps {
  to: string;
  icon: string;
  label: string;
  end?: boolean;
}

const SidebarLink = ({ to, icon, label, end = false }: SidebarLinkProps) => {
  const linkClass = "block py-3 px-4 rounded-xl transition-colors hover:bg-gray-100";

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${linkClass} ${
          isActive
            ? "bg-indigo-100 text-indigo-700"
            : "hover:bg-gray-100"
        }`
      }
    >
      {icon} {label}
    </NavLink>
  );
};

export default SidebarLink;
