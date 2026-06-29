import { Outlet, useLocation } from "react-router-dom";
import ClientNavbar from "./ClientNavbar";
import { ClientAIChatProvider } from "../domains/guests/ClientAIChatContext";
import ClientAIChatDrawer from "../domains/guests/ClientAIChatDrawer";
import Footer from "@shared/components/layout/Footer";
import NavigationProgressBar from "@shared/components/layout/NavigationProgressBar";
import { useScrollToTop } from "@shared/hooks/useScrollToTop";
import AIFloatButton from "@shared/components/ui/AIFloatButton";

const ClientFullPageLayout = () => {
    const containerRef = useScrollToTop();
    const { pathname } = useLocation();

    // Pages accessed by footer or explore page are excluded from the standardized py-16 gap
    const isExcepted = pathname === "/" || pathname.startsWith("/info/") || pathname.startsWith("/cabin/");

    return (
        <ClientAIChatProvider>
            <div className="min-h-screen flex flex-col bg-[var(--app-bg)] text-[var(--app-text-main)] relative overflow-x-hidden">
                {/* NAVIGATION PROGRESS */}
                <NavigationProgressBar />

                {/* TOP NAVBAR */}
                <ClientNavbar />

                {/* FULL WIDTH CONTENT (NO SIDEBAR) */}
                <div
                    ref={containerRef as React.RefObject<HTMLDivElement>}
                    className="flex-1 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col w-full"
                >
                    <div className={`px-0 md:px-8 flex-1 flex flex-col ${isExcepted ? "pb-0" : "pt-[2px] pb-[2px]"}`}>
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