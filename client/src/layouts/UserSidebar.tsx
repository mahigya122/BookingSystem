import { NavLink, useLocation } from "react-router-dom";
import ExploreFilters from "../domains/cabins/components/ExploreFilters";
import BookingFilters from "../domains/bookings/components/BookingFilters";
import { useUser } from "@shared/auth_hooks";

const UserSidebar = () => {
    const { isAuthenticated, user } = useUser();
    const location = useLocation();

    console.log("SIDEBAR_DEBUG: isAuthenticated=", isAuthenticated, "user=", user);

    const isExplore = location.pathname.includes("user/explore");
    const isBookings = location.pathname.includes("user/bookings");

    return (
        <div className="flex flex-col h-full border-r-4 border-rose-500">
            {/* Tabs (Only show if authenticated to switch between Explore/Bookings) */}
            <div className="p-4">
                {isAuthenticated && (
                    <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-6">
                        <NavLink
                            to="/user/explore"
                            className={({ isActive }) =>
                                `flex-1 text-center py-2 rounded-lg text-sm font-semibold transition ${isActive ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-400"
                                }`
                            }
                        >
                            Explore
                        </NavLink>

                        <NavLink
                            to="/user/bookings"
                            className={({ isActive }) =>
                                `flex-1 text-center py-2 rounded-lg text-sm font-semibold transition ${isActive ? "bg-emerald-600 text-white" : "text-slate-600 dark:text-slate-400"
                                }`
                            }
                        >
                            My Bookings
                        </NavLink>
                    </div>
                )}

                <div className="mt-6">
                    {isExplore && <ExploreFilters />}
                    {isBookings && isAuthenticated && <BookingFilters />}
                </div>
            </div>
        </div>
    );
};

export default UserSidebar;
