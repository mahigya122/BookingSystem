import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import ClientNavbar from "./ClientNavbar";
import { ClientAIChatProvider } from "../domains/guests/contexts/ClientAIChatContext";
import { CabinFiltersProvider, useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";
import ClientAIChatDrawer from "../domains/guests/components/ai/ClientAIChatDrawer";

const LayoutBody = () => {
  const { sidebarOpen } = useCabinFiltersContext();

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* DECORATIVE ELEMENTS (SUBTLE) */}
      <div className="absolute top-40 left-80 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl pointer-events-none" />

      {/* LEFT SIDEBAR PANEL */}
      <aside
        className={`
                    flex flex-col border-r overflow-y-auto overflow-x-hidden
                    bg-white/60 dark:bg-slate-900/60
                    backdrop-blur-2xl transition-all duration-500 ease-in-out
                    border-sky-50 dark:border-sky-900/20
                `}
        style={{
          width: sidebarOpen ? "280px" : "80px"
        }}
      >
        <UserSidebar />
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 scroll-smooth">
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
        <div className="h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-sky-100 selection:text-sky-900">
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
