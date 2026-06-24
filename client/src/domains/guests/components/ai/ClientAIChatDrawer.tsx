import { useClientAIChat } from "../../contexts/ClientAIChatContext";

import GuestChat from "./GuestChat";

const ClientAIChatDrawer = () => {
    const { open, setOpen } = useClientAIChat();

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
                className={`fixed right-0 top-0 z-50 h-[100dvh] w-full sm:w-[440px] transform border-l shadow-2xl transition-transform duration-300 ${open
                        ? "translate-x-0"
                        : "translate-x-full"
                    }`}
                style={{
                    background:
                        "linear-gradient(180deg, color-mix(in srgb, var(--app-surface-elevated) 94%, black) 0%, color-mix(in srgb, var(--app-surface) 92%, black) 100%)",
                    borderColor: "var(--app-border)",
                    boxShadow:
                        "-28px 0 80px -38px rgba(0, 0, 0, 0.55)",
                }}
            >
                {/* CHAT BODY (FULL SCREEN) */}
                <div className="h-full relative overflow-hidden">
                    <GuestChat isOpen={open} onClose={() => setOpen(false)} />
                </div>
            </div>
        </>
    );
};

export default ClientAIChatDrawer;
