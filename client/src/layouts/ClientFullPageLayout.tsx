import { Outlet } from "react-router-dom";
import { Bot } from "lucide-react";
import ClientNavbar from "./ClientNavbar";
import { ClientAIChatProvider, useClientAIChat } from "../domains/guests/contexts/ClientAIChatContext";
import { CabinFiltersProvider } from "../domains/cabins/contexts/CabinFiltersContext";
import ClientAIChatDrawer from "../domains/guests/components/ai/ClientAIChatDrawer";
import Footer from "@shared/components/layout/Footer";
import NavigationProgressBar from "@shared/components/layout/NavigationProgressBar";
import { useScrollToTop } from "@shared/hooks/useScrollToTop";

const AIFloatButton = () => {
    const { open, setOpen } = useClientAIChat();

    if (open) return null;

    return (
        <button
            onClick={() => setOpen(true)}
            className="
                fixed bottom-6 right-6 z-[9999]
                animate-ai-float
                group flex h-12 w-12 md:h-14 md:w-14
                items-center justify-center
                rounded-xl md:rounded-2xl
                bg-sky-50 dark:bg-sky-900/30
                border border-sky-100 dark:border-sky-800
                text-sky-600 dark:text-sky-400
                hover:bg-sky-600 hover:text-white
                transition-all duration-500
                shadow-xl hover:shadow-sky-500/20
                hover:-translate-y-1
            "
        >
            {/* Thinking Glow */}
            <div className="absolute inset-0 rounded-2xl bg-sky-400/20 blur-xl animate-pulse opacity-30" />

            {/* Bot Icon */}
            <Bot
                size={22}
                className="
                    relative z-10
                    md:size-[26px]
                    group-hover:scale-110
                    transition-transform duration-300
                "
            />

            {/* Online Dot */}
            <div
                className="
                    absolute -top-0.5 -right-0.5
                    h-3 w-3 md:h-3.5 md:w-3.5
                    rounded-full
                    bg-sky-500
                    border-2 border-white dark:border-slate-900
                    animate-pulse
                "
            />
        </button>
    );
};

const ClientFullPageLayout = () => {
    const containerRef = useScrollToTop();


    return (
        <CabinFiltersProvider>
            <ClientAIChatProvider>
                <div className="h-screen flex flex-col bg-[var(--app-bg)] text-[var(--app-text-main)] relative">
                    {/* NAVIGATION PROGRESS */}
                    <NavigationProgressBar />

                    {/* TOP NAVBAR */}
                    <ClientNavbar />

                    {/* FULL WIDTH CONTENT (NO SIDEBAR) */}
                    <div
                        ref={containerRef as React.RefObject<HTMLDivElement>}
                        className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50 scroll-smooth flex flex-col"
                    >
                        <div className="p-8 pb-0 flex-1">
                            <Outlet />
                        </div>
                        <Footer />
                    </div>

                    {/* AI CHAT DRAWER */}
                    <ClientAIChatDrawer />

                    {/* AI FLOAT BUTTON */}
                    <AIFloatButton />
                </div>
            </ClientAIChatProvider>
        </CabinFiltersProvider>
    );
};

export default ClientFullPageLayout;