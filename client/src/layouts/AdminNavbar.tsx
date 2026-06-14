import { useNavigate } from "react-router-dom";
import { useUser, useLogout } from "@shared/auth_hooks";
import ThemeToggle from "@shared/components/ui/ThemeToggle";
import { Bot, Mountain } from "lucide-react";
import { useAIChat } from "../domains/admin/contexts/AIChatContext";

const Navbar = () => {
    const { user } = useUser();
    const { logout } = useLogout();
    const navigate = useNavigate();
    const { setOpen } = useAIChat();

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="nav-panel sticky top-0 z-40 flex h-20 items-center justify-between px-8 backdrop-blur-xl border-b border-sky-100 dark:border-sky-900/20">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/dashboard")}>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 shadow-lg shadow-sky-200 dark:shadow-none group-hover:scale-110 transition-transform duration-300">
                    <Mountain className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                        Cabin<span className="text-sky-600">Admin</span>
                    </span>
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em] mt-1">
                        System Control
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* VIEW SITE LINK (Subtle) */}
                <button
                    onClick={() => window.location.href = "/"}
                    className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-sky-100 dark:border-sky-900/40 text-[10px] font-black uppercase tracking-widest text-sky-400 hover:text-sky-600 hover:border-sky-200 transition-all duration-300"
                >
                    View Site
                </button>

                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all duration-300 shadow-sm"
                >
                    <Bot size={16} className="animate-bounce" />
                    <span className="text-xs font-black uppercase tracking-widest">AI Intelligence</span>
                </button>

                <div className="hidden h-8 w-px bg-slate-100 dark:bg-slate-800 sm:block" />

                <div className="hidden sm:flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-black text-slate-900 dark:text-white leading-none">{user?.email?.split('@')[0] || "Admin"}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 mt-1.5">Master Controller</span>
                    </div>
                    <button
                        onClick={() => navigate("/profile")}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:border-sky-400 hover:shadow-xl hover:shadow-sky-400/20 transition-all duration-500 shadow-sm group"
                    >
                        <span className="group-hover:scale-125 transition-transform duration-500">👤</span>
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <button
                        onClick={handleLogout}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
