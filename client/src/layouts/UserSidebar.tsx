import { NavLink, useLocation } from "react-router-dom";
import { SlidersHorizontal, X, MapPin } from "lucide-react";
import ExploreFilters from "../domains/cabins/components/ExploreFilters";
import BookingFilters from "../domains/bookings/components/BookingFilters";
import { useUser } from "@shared/hooks";
import { useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";

const UserSidebar = () => {
    const { isAuthenticated } = useUser();
    const location = useLocation();

    const isExplore = location.pathname === "/";
    const isBookings = location.pathname.includes("/bookings");

    const {
        sidebarOpen,
        setSidebarOpen,
        activeFilterCount,
        isSearching
    } = useCabinFiltersContext();

    // COLLAPSED STATE
    if (!sidebarOpen) {
        return (
            <div className="h-full flex flex-col items-center pt-10 space-y-8 relative overflow-hidden">
                {/* Subtle background decoration */}
                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-sky-50 to-transparent dark:from-sky-900/10 pointer-events-none" />

                <button
                    title="Open Preferences"
                    onClick={() => setSidebarOpen(true)}
                    className="
                        relative
                        flex
                        items-center
                        justify-center
                        w-14
                        h-14
                        rounded-[1.25rem]
                        bg-white
                        dark:bg-slate-800
                        border
                        border-sky-100
                        dark:border-sky-900/30
                        hover:border-sky-400
                        hover:shadow-2xl
                        hover:shadow-sky-400/20
                        hover:-translate-y-1
                        transition-all
                        duration-500
                        z-10
                        group
                    "
                >
                    <SlidersHorizontal size={22} className="text-sky-600 dark:text-sky-400 group-hover:rotate-12 transition-transform" />

                    {activeFilterCount > 0 && (
                        <span
                            className="
                                absolute
                                -top-2
                                -right-2
                                min-w-[22px]
                                h-[22px]
                                px-1
                                rounded-full
                                text-[10px]
                                font-black
                                flex
                                items-center
                                justify-center
                                bg-sky-500
                                text-white
                                border
                                border-white
                                dark:border-slate-900
                                shadow-lg
                                animate-in zoom-in duration-500
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
        <div className="flex flex-col h-full animate-in slide-in-from-left-4 duration-700 relative overflow-hidden">
            {/* DECORATIVE SVG BACKGROUNDS */}
            <svg className="absolute -top-10 -left-10 w-40 h-40 text-sky-100/50 dark:text-sky-900/10 pointer-events-none" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="8 6" />
            </svg>
            <svg className="absolute top-1/2 -right-12 w-32 h-32 text-emerald-100/30 dark:text-emerald-900/10 pointer-events-none" viewBox="0 0 200 200" fill="none">
                <path d="M200 200 Q0 200 0 0" stroke="currentColor" strokeWidth="2" strokeDasharray="8 6" />
            </svg>

            {/* HEADER */}
            <div className="flex items-center justify-between p-8 border-b border-sky-50 dark:border-sky-900/20 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-900/40 border border-sky-100 dark:border-sky-800 shadow-sm">
                        <SlidersHorizontal size={18} className="text-sky-600 dark:text-sky-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none mb-1">
                            {isSearching ? "Refine" : "Search"}
                        </span>
                        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                            Preferences
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2.5 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group"
                >
                    <X size={20} className="text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-hover:rotate-90 transition-all duration-500" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10 relative z-10">
                {/* TABS: EXPLORE / BOOKINGS */}
                {isAuthenticated && (
                    <div className="flex rounded-[1.5rem] bg-slate-50 dark:bg-slate-800/40 p-2 shadow-inner border border-slate-100 dark:border-slate-800">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `flex-1 text-center py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${isActive
                                    ? "bg-white dark:bg-slate-700 text-sky-600 shadow-xl shadow-sky-900/5 border border-sky-50 dark:border-sky-900/20 scale-[1.02]"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                }`
                            }
                        >
                            Explore
                        </NavLink>

                        <NavLink
                            to="/bookings"
                            end={false}
                            className={({ isActive }) =>
                                `flex-1 text-center py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${isActive
                                    ? "bg-white dark:bg-slate-700 text-sky-600 shadow-xl shadow-sky-900/5 border border-sky-50 dark:border-sky-900/20 scale-[1.02]"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                }`
                            }
                        >
                            My Trips
                        </NavLink>
                    </div>
                )}

                {/* DYNAMIC FILTERS */}
                <div className="space-y-10">
                    {isExplore && <ExploreFilters />}
                    {isBookings && isAuthenticated && <BookingFilters />}

                    {!isAuthenticated && isBookings && (
                        <div className="p-10 rounded-[2rem] border-2 border-dashed border-sky-100 dark:border-sky-900/30 text-center bg-sky-50/20 dark:bg-transparent backdrop-blur-sm">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-900/30 text-sky-500">
                                <MapPin size={24} />
                            </div>
                            <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight mb-2">
                                Adventure is calling
                            </p>
                            <p className="text-xs font-bold text-slate-400 leading-relaxed">
                                Sign in to unlock your handpicked itinerary.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <div className="p-8 border-t border-sky-50 dark:border-sky-900/20 relative z-10 flex flex-col items-center gap-3">
                <div className="flex gap-4">
                    {["🌲", "⛰️", "🛶"].map((emoji, i) => (
                        <span key={i} className="text-sm opacity-30 hover:opacity-100 transition-opacity cursor-default grayscale hover:grayscale-0">{emoji}</span>
                    ))}
                </div>
                <span className="text-[10px] font-black text-center uppercase tracking-[0.4em] text-slate-300 dark:text-slate-600 leading-none">
                    CabinHub v2.4
                </span>
            </div>
        </div>
    );
};

export default UserSidebar;
