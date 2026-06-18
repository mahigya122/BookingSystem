import { Outlet, useLocation } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import ClientNavbar from "./ClientNavbar";
import { ClientAIChatProvider, useClientAIChat } from "../domains/guests/contexts/ClientAIChatContext";
import { CabinFiltersProvider, useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";
import ClientAIChatDrawer from "../domains/guests/components/ai/ClientAIChatDrawer";
import Footer from "@shared/components/layout/Footer";
import NavigationProgressBar from "@shared/components/layout/NavigationProgressBar";
import { useScrollToTop } from "@shared/hooks/useScrollToTop";
import AIFloatButton from "@shared/components/ui/AIFloatButton";
import { useCabinsData } from "../domains/cabins/hooks/useCabinsData";

const LayoutBody = () => {
  const { sidebarOpen, isSearching, setSidebarOpen } = useCabinFiltersContext();
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const shouldShowSidebar = isHomePage && isSearching;

  return (
    <div className="flex flex-1 relative">
      {/* DECORATIVE ELEMENTS (SUBTLE) */}
      <div className="absolute top-40 left-80 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl pointer-events-none" />

      {/* LEFT SIDEBAR PANEL */}
      {shouldShowSidebar && (
        <aside
          className={`
                    fixed inset-y-0 left-0 z-50 lg:sticky lg:top-0 lg:h-[calc(100vh-80px)]
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
      <main className="flex-1 min-w-0">
        <div className={`w-full ${isHomePage ? "" : "py-16"} px-4 md:px-12 lg:px-16 max-w-[1600px] mx-auto`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const ClientDashboardLayout = () => {
  const containerRef = useScrollToTop();
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

  return (
    <ClientAIChatProvider>
      <div className="h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden">
        {/* NAVIGATION PROGRESS */}
        <NavigationProgressBar />

        {/* NAVBAR */}
        <ClientNavbar />

        {/* SCROLLABLE WRAPPER */}
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth flex flex-col w-full"
        >
          {/* DYNAMIC BODY (SIDEBAR + CONTENT) */}
          <LayoutBody />

          {/* FOOTER - NOW FULL WIDTH BELOW SIDEBAR AREA */}
          <Footer />
        </div>

        {/* GLOBAL AI DRAWER */}
        <ClientAIChatDrawer />

        {/* AI FLOAT BUTTON */}
        <AIFloatButton />
      </div>
    </ClientAIChatProvider>
  );
};

export default ClientDashboardLayout;
