import { NavLink, useLocation } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import ExploreFilters from "../domains/cabins/components/ExploreFilters";
import BookingFilters from "../domains/bookings/components/BookingFilters";
import { useUser } from "@shared/auth_hooks";
import { useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";

const UserSidebar = () => {
    const { isAuthenticated } = useUser();
    const location = useLocation();

    const isExplore = location.pathname === "/";
    const isBookings = location.pathname.includes("/bookings");

    const {
        sidebarOpen,
        setSidebarOpen,
        activeFilterCount
    } = useCabinFiltersContext();

    // COLLAPSED STATE
    if (!sidebarOpen) {
        return (
            <div className="h-full flex flex-col items-center pt-6 space-y-4">
                <button
                    title="Open Filters"
                    onClick={() => setSidebarOpen(true)}
                    className="
                        relative
                        flex
                        items-center
                        justify-center
                        w-10
                        h-10
                        rounded-xl
                        bg-white/50
                        dark:bg-slate-800/50
                        border
                        border-transparent
                        hover:border-emerald-500/30
                        hover:bg-white
                        dark:hover:bg-slate-800
                        transition-all
                        shadow-sm
                    "
                >
                    <SlidersHorizontal size={18} className="text-slate-600 dark:text-slate-300" />

                    {activeFilterCount > 0 && (
                        <span
                            className="
                                absolute
                                -top-1.5
                                -right-1.5
                                min-w-[18px]
                                h-[18px]
                                px-1
                                rounded-full
                                text-[10px]
                                font-bold
                                flex
                                items-center
                                justify-center
                                bg-emerald-600
                                text-white
                                border-2
                                border-white
                                dark:border-slate-900
                                animate-in zoom-in duration-300
                            "
                        >
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>
        );
    }

    // EXPANDED STATE
    return (
        <div className="flex flex-col h-full animate-in slide-in-from-left-4 duration-300">
            {/* HEADER WITH CLOSE BUTTON */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--app-border)" }}>
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-emerald-600" />
                    <span className="text-sm font-bold uppercase tracking-widest text-slate-500">
                        Filters & Navigation
                    </span>
                </div>
                
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <X size={20} className="text-slate-400" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {/* TABS: EXPLORE / BOOKINGS */}
                {isAuthenticated && (
                    <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-8 shadow-inner">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all ${
                                    isActive 
                                        ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm" 
                                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                }`
                            }
                        >
                            Explore
                        </NavLink>

                        <NavLink
                            to="/bookings"
                            className={({ isActive }) =>
                                `flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all ${
                                    isActive 
                                        ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm" 
                                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                }`
                            }
                        >
                            My Bookings
                        </NavLink>
                    </div>
                )}

                {/* DYNAMIC FILTERS */}
                <div className="space-y-6">
                    {isExplore && <ExploreFilters />}
                    {isBookings && isAuthenticated && <BookingFilters />}
                    
                    {!isAuthenticated && isBookings && (
                        <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
                            <p className="text-sm font-medium text-slate-500">
                                Please sign in to view your bookings.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER INFO */}
            <div className="p-4 border-t text-[10px] font-bold text-center uppercase tracking-widest text-slate-400" style={{ borderColor: "var(--app-border)" }}>
                HotelFlow v2.0
            </div>
        </div>
    );
};

export default UserSidebar;
