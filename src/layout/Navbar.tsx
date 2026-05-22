import { useNavigate } from "react-router-dom";
import { useUser } from "../authentication/useUser";
import { useLogout } from "../authentication/useLogout";

const Navbar = () => {
    const { user } = useUser();
    const { logout } = useLogout();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
    };

return(
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
    
    <div>
        <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">
            Hotel Flow
        </h1>
    </div>

    <div className="flex items-center gap-4">
        <span className="text-gray-700">Welcome, {user?.email || "User"}</span>


    <button onClick={() => navigate("/dashboard/profile")}
    className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg hover:bg-indigo-200 transition" >
        👤
    </button>

        <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md shadow-sm"
                >
                    Logout
                </button>

        </div>
    </header>
);
};
export default Navbar;