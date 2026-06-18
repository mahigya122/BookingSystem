import { Outlet, useLocation } from "react-router-dom";
import ClientNavbar from "./ClientNavbar";
import { ClientAIChatProvider } from "../domains/guests/contexts/ClientAIChatContext";
import ClientAIChatDrawer from "../domains/guests/components/ai/ClientAIChatDrawer";
import Footer from "@shared/components/layout/Footer";
import NavigationProgressBar from "@shared/components/layout/NavigationProgressBar";
import { useScrollToTop } from "@shared/hooks/useScrollToTop";
import AIFloatButton from "@shared/components/ui/AIFloatButton";
import { useCabinsData } from "../domains/cabins/hooks/useCabinsData";

const ClientFullPageLayout = () => {
    const containerRef = useScrollToTop();
    const { pathname } = useLocation();
    const { isLoading } = useCabinsData();

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
                    <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">Loading...</p>
                </div>
            </div>
        );
    }

    // Pages accessed by footer or explore page are excluded from the standardized py-16 gap
    const isExcepted = pathname === "/" || pathname.startsWith("/info/");

    return (
        <ClientAIChatProvider>
            <div className="h-screen flex flex-col bg-[var(--app-bg)] text-[var(--app-text-main)] relative overflow-x-hidden">
                {/* NAVIGATION PROGRESS */}
                <NavigationProgressBar />

                {/* TOP NAVBAR */}
                <ClientNavbar />

                {/* FULL WIDTH CONTENT (NO SIDEBAR) */}
                <div
                    ref={containerRef as React.RefObject<HTMLDivElement>}
                    className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/50 dark:bg-slate-950/50 scroll-smooth flex flex-col w-full"
                >
                    <div className={`px-0 md:px-8 flex-1 ${isExcepted ? "pb-0" : "py-16"}`}>
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
    );
};

export default ClientFullPageLayout;