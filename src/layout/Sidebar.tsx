import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const linkClass = "block py-3 px-4 rounded-xl transition-colors hover:bg-gray-100";

return(
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <nav className="space-y-2">
            <NavLink to= "/dashbord"
            end
            className={({isActive}) =>
            `${linkClass} ${
              isActive
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-gray-100"
            }`}> 🏠 Home
            </NavLink>
            <NavLink
          to="/dashboard/bookings"
          className={({ isActive }) =>
            `${linkClass} ${
              isActive
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-gray-100"
            }`
          }
        >
          📅 Bookings
        </NavLink>

        <NavLink
          to="/dashboard/cabins"
          className={({ isActive }) =>
            `${linkClass} ${
              isActive
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-gray-100"
            }`
          }
        >
          🏨 Cabins
        </NavLink>

        <NavLink
          to="/dashboard/user"
          className={({ isActive }) =>
            `${linkClass} ${
              isActive
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-gray-100"
            }`
          }
        >
          👤 User
        </NavLink>

        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            `${linkClass} ${
              isActive
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-gray-100"
            }`
          }
        >
          ⚙️ Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
