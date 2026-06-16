import { Outlet, useLocation } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import ClientNavbar from "./ClientNavbar";
import { ClientAIChatProvider } from "../domains/guests/contexts/ClientAIChatContext";
import { CabinFiltersProvider, useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";
import ClientAIChatDrawer from "../domains/guests/components/ai/ClientAIChatDrawer";

const LayoutBody = () => {
  const { sidebarOpen, isSearching } = useCabinFiltersContext();
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const shouldShowSidebar = !isHomePage || isSearching;

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* DECORATIVE ELEMENTS (SUBTLE) */}
      <div className="absolute top-40 left-80 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl pointer-events-none" />

      {/* LEFT SIDEBAR PANEL */}
      {shouldShowSidebar && (
        <aside
          className={`
                    fixed inset-y-0 left-0 z-50 lg:relative
                    flex flex-col border-r overflow-y-auto overflow-x-hidden
                    bg-white dark:bg-slate-900 lg:bg-white/60 lg:dark:bg-slate-900/60
                    backdrop-blur-2xl transition-all duration-500 ease-in-out
                    border-sky-50 dark:border-sky-900/20
                    ${sidebarOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0 lg:w-[80px]"}
                `}
        >
          <UserSidebar />
        </aside>
      )}

      {/* OVERLAY FOR MOBILE */}
      {shouldShowSidebar && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 overflow-y-auto scroll-smooth ${shouldShowSidebar ? "p-4 md:p-8 lg:p-10" : ""}`}>
        <div className={shouldShowSidebar ? "max-w-[1600px] mx-auto w-full" : "w-full"}>
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
