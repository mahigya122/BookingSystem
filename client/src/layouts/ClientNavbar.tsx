import { useNavigate } from "react-router-dom";
import { useUser, useLogout } from "@shared/auth_hooks";
import ThemeToggle from "@shared/components/ui/ThemeToggle";
import { useClientAIChat } from "../domains/guests/contexts/ClientAIChatContext";
import { useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";
import { Mountain } from "lucide-react";

const ClientNavbar = () => {
    const { user } = useUser();
    const { logout } = useLogout();
    const navigate = useNavigate();
    const { setOpen } = useClientAIChat();
    const { clearFilters } = useCabinFiltersContext();

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
        <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-sky-100 dark:border-sky-900/20">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* LOGO */}
                <div
                    onClick={handleReset}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 shadow-lg shadow-sky-200 dark:shadow-none group-hover:scale-110 transition-transform duration-300">
                        <Mountain className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                            Cabin<span className="text-sky-500">Hub</span>
                        </span>
                        <span
                            className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em] mt-1"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                        >
                            Explore Mode
                        </span>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-6">

                    {/* AI BUTTON */}
                    <button
                        onClick={() => setOpen(true)}
                        className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all duration-300 shadow-sm"
                    >
                        <div className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-widest">AI Concierge</span>
                    </button>

                    {/* ADMIN PANEL LINK */}
                    {user?.role === "admin" && (
                        <button
                            onClick={() => window.location.href = "/admin/dashboard"}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-sky-100 dark:border-sky-900/40 text-[10px] font-black uppercase tracking-widest text-sky-500 hover:text-sky-600 hover:border-sky-200 transition-all duration-300 cursor-pointer"
                        >
                            Admin Panel
                        </button>
                    )}

                    <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 hidden md:block" />

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        {user ? (
                            <div className="flex items-center gap-4 pl-2">
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-xs font-black text-slate-900 dark:text-white">
                                        {user.email?.split("@")[0]}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        Guest Member
                                    </span>
                                </div>

                                <button
                                    onClick={() => navigate("/profile")}
                                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:border-sky-400 transition-all duration-300 shadow-sm"
                                >
                                    👤
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate("/login")}
                                className="btn btn-primary px-8"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ClientNavbar;
