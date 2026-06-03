import { useNavigate } from "react-router-dom";
import { useUser, useLogout } from "@shared/hooks/auth";
import ThemeToggle from "@shared/components/ui/ThemeToggle";
import { Bot } from "lucide-react";
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
        <header className="nav-panel sticky top-0 z-40 flex h-16 items-center justify-between px-6 backdrop-blur-xl lg:px-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
                <div className="brand-chip flex h-9 w-9 items-center justify-center rounded-xl">
                    <span className="text-sm font-black text-white">H</span>
                </div>
                <h1 className="text-xl font-black tracking-tight" style={{ color: "var(--app-text-main)" }}>
                    Hotel<span style={{ color: "var(--app-primary)" }}>Flow</span>
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={() => setOpen(true)}
                    className="btn-secondary flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
                >
                    <Bot size={14} />
                    AI
                </button>

                <div className="hidden h-8 w-px sm:block mx-2" style={{ background: "var(--app-border)" }} />

                <div className="hidden sm:flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold" style={{ color: "var(--app-text-main)" }}>{user?.email?.split('@')[0] || "Guest"}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--app-text-muted)" }}>{user?.role || "Administrator"}</span>
                    </div>
                    <button
                        onClick={() => navigate("/admin/profile")}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors btn-secondary"
                    >
                        👤
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <button
                        onClick={handleLogout}
                        className="text-xs font-bold uppercase tracking-widest hover:text-rose-500"
                        style={{ color: "var(--app-text-muted)" }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
