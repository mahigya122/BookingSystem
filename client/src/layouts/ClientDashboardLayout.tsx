import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import ClientNavbar from "./ClientNavbar";
import { ClientAIChatProvider } from "../domains/guests/contexts/ClientAIChatContext";
import { CabinFiltersProvider, useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";
import ClientAIChatDrawer from "../domains/guests/components/ai/ClientAIChatDrawer";

/**
 * Sub-component to consume the context and apply layout changes
 */
const LayoutBody = () => {
  const { sidebarOpen } = useCabinFiltersContext();

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* LEFT SIDEBAR PANEL */}
      <aside
        className={`
                    flex flex-col border-r overflow-y-auto overflow-x-hidden
                    bg-white/70 dark:bg-slate-900/70
                    backdrop-blur-xl shadow-xl
                    transition-all duration-300 ease-in-out
                `}
        style={{
          borderColor: "var(--app-border)",
          width: sidebarOpen ? "250px" : "56px" // Use 56px for a bit more room for the icon
        }}
      >
        <UserSidebar />
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const ClientDashboardLayout = () => {
  return (
    <CabinFiltersProvider>
      <ClientAIChatProvider>
        <div className="h-screen flex flex-col bg-[var(--app-bg)] text-[var(--app-text-main)]">
          {/* NAVBAR */}
          <ClientNavbar />

          {/* DYNAMIC BODY */}
          <LayoutBody />

          {/* GLOBAL AI DRAWER */}
          <ClientAIChatDrawer />
        </div>
      </ClientAIChatProvider>
    </CabinFiltersProvider>
  );
};

export default ClientDashboardLayout;
