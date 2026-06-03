import { Outlet } from "react-router-dom";
import ClientNavbar from "./ClientNavbar";
import { ClientAIChatProvider } from "../domains/guests/contexts/ClientAIChatContext";
import { CabinFiltersProvider } from "../domains/cabins/contexts/CabinFiltersContext";
import ClientAIChatDrawer from "../domains/guests/components/ai/ClientAIChatDrawer";

const ClientFullPageLayout = () => {
    return (
        <CabinFiltersProvider>
            <ClientAIChatProvider>
                <div className="h-screen flex flex-col bg-[var(--app-bg)] text-[var(--app-text-main)]">
                    {/* TOP NAVBAR */}
                    <ClientNavbar />

                    {/* FULL WIDTH CONTENT (NO SIDEBAR) */}
                    <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-950/50">
                        <Outlet />
                    </div>

                    {/* AI CHAT DRAWER */}
                    <ClientAIChatDrawer />
                </div>
            </ClientAIChatProvider>
        </CabinFiltersProvider>
    );
};

export default ClientFullPageLayout;