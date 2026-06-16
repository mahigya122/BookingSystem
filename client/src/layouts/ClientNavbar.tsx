import { useNavigate } from "react-router-dom";
import { useUser, useLogout } from "@shared/hooks";
import ThemeToggle from "@shared/components/ui/ThemeToggle";
import { useClientAIChat } from "../domains/guests/contexts/ClientAIChatContext";
import { useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";
import { Mountain, Menu } from "lucide-react";

const ClientNavbar = () => {
    const { user } = useUser();
    const { logout } = useLogout();
    const navigate = useNavigate();
    const { setOpen } = useClientAIChat();
    const { clearFilters, setSidebarOpen, sidebarOpen } = useCabinFiltersContext();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleReset = () => {
        setOpen(false);
        clearFilters();
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 md:h-20 items-center justify-between px-4 md:px-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-sky-100 dark:border-sky-900/20">
            {/* LEFT: LOGO & MOBILE MENU */}
            <div className="flex items-center gap-2 md:gap-4">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <Menu size={20} className="text-slate-600 dark:text-slate-300" />
                </button>

                <div
                    onClick={handleReset}
                    className="flex items-center gap-2 md:gap-3 cursor-pointer group"
                >
                    <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl md:rounded-2xl bg-sky-600 shadow-lg shadow-sky-200 dark:shadow-none group-hover:scale-110 transition-transform duration-300">
                        <Mountain className="h-4 w-4 md:h-6 md:w-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base md:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                            Cabin<span className="text-sky-600">Hub</span>
                        </span>
                        <span
                            className="text-[8px] md:text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em] mt-1 hidden xs:block"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            Explore Mode
                        </span>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-2 md:gap-6">
                {/* AI BUTTON */}
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 md:px-5 md:py-2.5 rounded-full bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all duration-300 shadow-sm"
                >
                    <div className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
                    <span className="text-[9px] md:text-xs font-black uppercase tracking-widest hidden sm:inline">AI Concierge</span>
                    <span className="text-[9px] font-black uppercase tracking-widest sm:hidden">AI</span>
                </button>

                <div className="hidden h-8 w-px bg-slate-100 dark:bg-slate-800 sm:block" />

                <div className="flex items-center gap-2 md:gap-3">
                    {user ? (
                        <>
                            <div className="hidden lg:flex flex-col items-end">
                                <span className="text-xs font-black text-slate-900 dark:text-white leading-none">
                                    {user.email?.split("@")[0]}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 mt-1.5">
                                    Guest Member
                                </span>
                            </div>

                            <button
                                onClick={() => navigate("/profile")}
                                className="flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:border-sky-400 hover:shadow-xl hover:shadow-sky-400/20 transition-all duration-500 shadow-sm group"
                            >
                                <span className="group-hover:scale-125 transition-transform duration-500 text-sm md:text-base">👤</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-sky-100 dark:border-sky-900/40 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-sky-400 hover:text-sky-600 hover:border-sky-200 transition-all duration-300"
                        >
                            Sign In
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <ThemeToggle />
                    {user && (
                        <button
                            onClick={handleLogout}
                            className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors hidden lg:block"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default ClientNavbar;
