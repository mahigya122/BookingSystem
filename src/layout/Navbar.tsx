import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/authContext";

const Navbar = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

const handleLogout = () => {
    logout();
    navigate("/login");
};

return(
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
    
    <div>
        <h1 className="text-2xl font-bold text-indigo-600">
            Hotal Flow
        </h1>
    </div>

    <div className="flex items-center gap-4">
        <span className="text-gray-700">Welcome, {user?.username}</span>


    <button onClick={() => navigate("/dashboard/user")}
    className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg hover:bg-indigo-200 transition" >
        👤
    </button>

    <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>

        </div>
    </header>
);
};
export default Navbar;