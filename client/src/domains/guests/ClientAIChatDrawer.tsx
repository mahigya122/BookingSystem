import { useClientAIChat } from "./ClientAIChatContext";
import { useUser } from "@shared/hooks";
import { MessageCircle, Bot, X } from "lucide-react";
import { useGuestUnreadSupportCount } from "@shared/hooks/useGuestUnreadSupportCount";
import GuestChat from "./GuestChat";
import GuestSupportChat from "./GuestSupportChat";

const ClientAIChatDrawer = () => {
  const { open, setOpen, activeTab, setActiveTab } = useClientAIChat();
  const { user } = useUser();
  const unreadSupport = useGuestUnreadSupportCount(user?.id ?? null);

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 backdrop-blur-sm"
          style={{
            background: "rgba(2, 6, 23, 0.58)",
          }}
        />
      )}

      {/* DRAWER */}
      <div
        className={`fixed right-0 top-0 z-50 h-[100dvh] w-full sm:w-[440px] transform border-l shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--app-surface-elevated) 94%, black) 0%, color-mix(in srgb, var(--app-surface) 92%, black) 100%)",
          borderColor: "var(--app-border)",
          boxShadow: "-28px 0 80px -38px rgba(0, 0, 0, 0.55)",
        }}
      >
        {/* SHARED TAB STRIP */}
        <div
          className="flex items-center justify-between px-3 pt-3 border-b bg-white/60 dark:bg-slate-950/60 backdrop-blur-md relative z-30 shrink-0"
          style={{ borderColor: "var(--app-border)" }}
        >
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("ai")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl text-xs font-bold transition-colors ${
                activeTab === "ai"
                  ? "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-300"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <Bot size={15} />
              AI Concierge
            </button>
            <button
              onClick={() => setActiveTab("support")}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl text-xs font-bold transition-colors ${
                activeTab === "support"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <MessageCircle size={15} />
              Human Support
              {unreadSupport > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadSupport > 9 ? "9+" : unreadSupport}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="h-9 w-9 mb-2 rounded-2xl border bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 flex items-center justify-center transition-all duration-300 shadow-sm active:scale-95 cursor-pointer shrink-0"
            style={{ borderColor: "var(--app-border)" }}
          >
            <X size={18} className="text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* CHAT BODY */}
        <div className="flex-1 relative overflow-hidden min-h-0">
          <div className={activeTab === "ai" ? "h-full" : "hidden"}>
            <GuestChat
              isOpen={open}
              onClose={() => setOpen(false)}
              hideOwnClose
            />
          </div>
          <div className={activeTab === "support" ? "h-full" : "hidden"}>
            <GuestSupportChat isOpen={open} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientAIChatDrawer;
