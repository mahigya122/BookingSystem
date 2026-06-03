import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import ClientNavbar from "./ClientNavbar";
import { ClientAIChatProvider } from "../domains/guests/contexts/ClientAIChatContext";
import { CabinFiltersProvider } from "../domains/cabins/contexts/CabinFiltersContext";
import ClientAIChatDrawer from "../domains/guests/components/ai/ClientAIChatDrawer";

const ClientDashboardLayout = () => {
  return (
    <CabinFiltersProvider>
      <ClientAIChatProvider>
        <div className="h-screen flex flex-col bg-[var(--app-bg)] text-[var(--app-text-main)]">
          {/* TOP NAVBAR */}
          <ClientNavbar />

          <div className="flex flex-1 overflow-hidden">
            {/* LEFT PANEL */}
            <div
              className=" w-[420px]
    flex
    flex-col
    border-r
    overflow-y-auto
    bg-white/70
    dark:bg-slate-900/70
    backdrop-blur-xl
    shadow-xl"
              style={{ borderColor: "var(--app-border)" }}
            >
              <UserSidebar />
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-950/50">
              <Outlet />
            </div>

          </div>

          {/* AI CHAT DRAWER */}
          <ClientAIChatDrawer />
        </div>
      </ClientAIChatProvider>
    </CabinFiltersProvider>
  );
};

export default ClientDashboardLayout;
