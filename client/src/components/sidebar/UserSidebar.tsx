import { NavLink, useLocation } from "react-router-dom";
import ExploreFilters from "./ExploreFilters";
import BookingFilters from "./BookingFilters";

const UserSidebar = () => {
    const location = useLocation();

    const isExplore = location.pathname.includes("user/explore");
    const isBookings = location.pathname.includes("user/bookings");

    return (
        <div className="flex flex-col h-full">
            {/* Tabs */}
            <div className="p-4">
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                    <NavLink 
                        to="/user/explore" 
                        className={({ isActive }) => 
                            `flex-1 text-center py-2 rounded-lg text-sm font-semibold transition ${
                                isActive ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-400"
                            }`
                        }
                    >
                        Explore
                    </NavLink>

                    <NavLink 
                        to="/user/bookings" 
                        className={({ isActive }) => 
                            `flex-1 text-center py-2 rounded-lg text-sm font-semibold transition ${
                                isActive ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-400"
                            }`
                        }
                    >
                        My Bookings
                    </NavLink>
                </div>

                <div className="mt-6">
                    {isExplore && <ExploreFilters />}
                    {isBookings && <BookingFilters />}
                </div>
            </div>
        </div>
    );
};

export default UserSidebar;
