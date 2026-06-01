import { useNavigate, Link } from "react-router-dom";
import { useUser, useLogout } from "@shared/auth_hooks";
import ThemeToggle from "@shared/components/ui/ThemeToggle";
import { useClientAIChat } from "../contexts/ClientAIChatContext";

const ClientNavbar = () => {
    const { user } = useUser();
    const { logout } = useLogout();
    const navigate = useNavigate();
    const { setOpen } = useClientAIChat();

    const handleLogout = () => {
        logout();
        navigate("/user/login");
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/user/explore" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                            <span className="text-sm font-black text-white">H</span>
                        </div>
                        <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                            Hotel<span className="text-emerald-600">Flow</span>
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setOpen(true)}
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                        title="AI Assistant"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="text-xs font-bold hidden md:inline">AI Assistant</span>
                    </button>
                    <ThemeToggle />

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{user.email?.split('@')[0]}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Guest</span>
                            </div>
                            <button
                                onClick={() => navigate("/user/profile")}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            >
                                👤
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-rose-500 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/user/login"
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default ClientNavbar;
