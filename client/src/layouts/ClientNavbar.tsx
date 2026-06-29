import { useNavigate } from "react-router-dom";
import { useUser, useLogout } from "@shared/hooks";
import ThemeToggle from "@shared/components/ui/ThemeToggle";
import { useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";
import { Mountain, LogOut, MessageCircle } from "lucide-react";
import { scrollToTop } from "@shared/hooks/useScrollToTop";
import { useState } from "react";
import { PromoBanner } from "../domains/cabins/explore/PromoBanner";

const ClientNavbar = () => {
    const { user } = useUser();
    const { logout } = useLogout();
    const navigate = useNavigate();

    const { clearFilters, setIsSearching, setSidebarOpen } = useCabinFiltersContext();

    const [logoKey, setLogoKey] = useState(0);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleCtaClick = () => {
        setIsSearching(true);
        setSidebarOpen(true);
        navigate("/explorepage");
        scrollToTop();
    };

    const handleLogoClick = () => {
        setLogoKey(k => k + 1); // 25% chance banner fires inside PromoBanner
        setIsSearching(false);
        clearFilters(true);
        navigate("/");
        scrollToTop();
    };

    return (
        <>
            <PromoBanner
                trigger="logo"
                triggerKey={logoKey}
                onCtaClick={handleCtaClick}
            />

            <header className="sticky top-0 z-40 flex h-16 md:h-20 items-center justify-between px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                {/* LEFT: LOGO */}
                <div className="flex items-center gap-4 md:gap-6">
                    <div
                        onClick={handleLogoClick}
                        className="flex items-center gap-2 cursor-pointer group"
                    >
                        <Mountain className="h-6 w-6 text-sky-600 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
                            CabinHub
                        </span>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {user ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigate("/messages")}
                                className="p-1.5 text-slate-500 hover:text-sky-500 dark:text-slate-400 dark:hover:text-sky-400 transition-all duration-300 active:scale-90 flex items-center justify-center drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                                title="Messages"
                            >
                                <MessageCircle size={22} />
                            </button>

                            <button
                                onClick={() => navigate("/profile")}
                                className="p-1.5 text-slate-500 hover:text-sky-500 dark:text-slate-400 dark:hover:text-sky-400 transition-all duration-300 active:scale-90 text-sm flex items-center justify-center drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                                title="My Profile"
                            >
                                <span className="leading-none" style={{ fontSize: '20px' }}>👤</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="p-1.5 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition-all duration-300 active:scale-90 flex items-center justify-center drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                                title="Logout"
                            >
                                <LogOut size={22} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="px-5 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-sky-600 dark:hover:bg-sky-400 dark:hover:text-white transition-all"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </header>
        </>
    );
};

export default ClientNavbar;