import { useNavigate, useLocation } from "react-router-dom";
import { useUser, useLogout } from "@shared/hooks";
import ThemeToggle from "@shared/components/ui/ThemeToggle";
import { useClientAIChat } from "../domains/guests/contexts/ClientAIChatContext";
import { useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";
import { Mountain, Menu, Bot, LogOut } from "lucide-react";
import { scrollToTop } from "@shared/hooks/useScrollToTop";

const ClientNavbar = () => {
    const { user } = useUser();
    const { logout } = useLogout();
    const navigate = useNavigate();
    const location = useLocation();
    const { setOpen } = useClientAIChat();
    const { clearFilters, setSidebarOpen, sidebarOpen, setIsSearching } = useCabinFiltersContext();

    const isExplorePage = location.pathname === "/";

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleReset = () => {
        setIsSearching(false);
        clearFilters(true);
        navigate("/");
        scrollToTop();
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 md:h-20 items-center justify-between px-4 md:px-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-sky-100 dark:border-sky-900/20">
            {/* LEFT: LOGO & MOBILE MENU */}
            <div className="flex items-center gap-2 md:gap-4">
                {!isExplorePage && (
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <Menu size={20} className="text-slate-600 dark:text-slate-300" />
                    </button>
                )}

                <div
                    onClick={handleReset}
                    className="flex items-center gap-2 md:gap-3 cursor-pointer group"
                >
                    <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl md:rounded-2xl bg-sky-600 shadow-lg shadow-sky-200 dark:shadow-none group-hover:scale-110 transition-transform duration-300">
                        <Mountain className="h-4 w-4 md:h-6 md:w-6 text-white" />
                    </div>
                    <div className="flex flex-col hidden xs:flex">
                        <span className="text-base md:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                            Cabin<span className="text-sky-600">Hub</span>
                        </span>
                        <span
                            className="text-[8px] md:text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em] mt-1"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            Explore Mode
                        </span>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-2">
                {/* THEME TOGGLE */}
                <ThemeToggle />

                {/* USER SECTION */}
                <div className="flex items-center gap-2">
                    {user ? (
                        <>
                            <button
                                onClick={() => navigate("/profile")}
                                className="flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:border-sky-400 hover:shadow-xl hover:shadow-sky-400/20 transition-all duration-500 shadow-sm group"
                                title="My Profile"
                            >
                                <span className="group-hover:scale-125 transition-transform duration-500 text-sm md:text-base">👤</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="group relative flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-100 dark:hover:border-rose-900/30 transition-all duration-500 shadow-sm"
                                title="Logout"
                            >
                                <LogOut size={16} className="md:size-[18px] group-hover:scale-110 transition-transform duration-300" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 rounded-xl md:rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-sky-600 dark:hover:bg-sky-400 dark:hover:text-white hover:scale-105 transition-all duration-300 shadow-lg shadow-slate-200 dark:shadow-none"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default ClientNavbar;
