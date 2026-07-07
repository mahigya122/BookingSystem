import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "@shared/hooks";
import ThemeToggle from "@shared/components/ui/ThemeToggle";
import { Mountain, LogOut, Menu } from "lucide-react";
import { useAdminSidebar } from "../domains/admin/contexts/AdminSidebarContext";
import { useAdminProfile } from "../domains/admin/components/settings/useAdminProfile";

const Navbar = () => {
    const { logout } = useLogout();
    const navigate = useNavigate();
    const { toggle } = useAdminSidebar();
    const { avatarUrl, fullName, email, isLoading } = useAdminProfile();
    const [showTooltip, setShowTooltip] = useState(false);

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 md:h-20 items-center justify-between px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggle}
                    className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                >
                    <Menu size={20} />
                </button>
                <div className="flex items-center gap-4 md:gap-6 cursor-pointer group" onClick={() => navigate("/dashboard")}>
                    <div className="flex items-center gap-2">
                        <Mountain className="h-6 w-6 text-sky-600 group-hover:scale-110 transition-transform duration-300" />
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
                                Cabin<span className="text-sky-600">Admin</span>
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1 leading-none">
                                System Control
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* VIEW SITE LINK */}
                <button
                    onClick={() => navigate("/")}
                    className="hidden lg:flex px-5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white transition-all duration-300"
                >
                    View Site
                </button>

                <div className="flex items-center gap-2">
                    <ThemeToggle />

                    <div 
                        className="relative"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <div
                            className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-800 p-0 text-slate-500 dark:text-slate-400 text-sm drop-shadow-sm cursor-default animate-fade-in"
                        >
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <span className="leading-none" style={{ fontSize: '20px' }}>{isLoading ? "..." : "👤"}</span>
                            )}
                        </div>

                        {showTooltip && (
                            <div className="absolute right-0 top-10 mt-1 w-56 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-1 duration-200 z-50 text-left">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                                    Active Session
                                </span>
                                <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                                    {fullName || "Admin Guest"}
                                </p>
                                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                    {email}
                                </p>
                                <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                        Concierge Admin
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="p-1.5 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 transition-all duration-300 active:scale-90 flex items-center justify-center drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                        title="Logout"
                    >
                        <LogOut size={22} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
