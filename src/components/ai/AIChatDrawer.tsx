import { X } from "lucide-react";

import SQLChat from "./sqlChat";

import { useAIChat } from "../../Context/AIChatContext";

const AIChatDrawer = () => {
  const { open, setOpen } = useAIChat();

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 backdrop-blur-sm"
          style={{ background: "rgba(2, 6, 23, 0.58)" }}
        />
      )}

      {/* DRAWER */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-110 transform border-l shadow-2xl transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, color-mix(in srgb, var(--app-surface-elevated) 94%, black) 0%, color-mix(in srgb, var(--app-surface) 92%, black) 100%)",
          borderColor: "var(--app-border)",
          boxShadow: "-28px 0 80px -38px rgba(0, 0, 0, 0.55)",
        }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--app-border)" }}>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.35em]" style={{ borderColor: "var(--app-border)", color: "var(--app-primary)", background: "color-mix(in srgb, var(--app-primary) 8%, transparent)" }}>
              FlowAI
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="btn btn-ghost h-10 w-10 p-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* CHAT */}
        <div className="h-[calc(100vh-64px)] p-3">
          <SQLChat isOpen={open} />
        </div>
      </div>
    </>
  );
};

export default AIChatDrawer;