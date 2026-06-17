import { Outlet, useLocation } from "react-router-dom";
import { Bot } from "lucide-react";
import UserSidebar from "./UserSidebar";
import ClientNavbar from "./ClientNavbar";
import { ClientAIChatProvider, useClientAIChat } from "../domains/guests/contexts/ClientAIChatContext";
import { CabinFiltersProvider, useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";
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
      className="fixed bottom-6 right-6 z-[9999] group flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800 text-sky-600 dark:text-sky-400 hover:bg-sky-600 hover:text-white transition-all duration-500 shadow-xl hover:shadow-sky-500/20 hover:-translate-y-1"
    >
      <Bot size={22} className="md:size-[26px] group-hover:scale-110 transition-transform duration-300" />
      <div className="absolute -top-0.5 -right-0.5 h-3 w-3 md:h-3.5 md:w-3.5 rounded-full bg-sky-500 border-2 border-white dark:border-slate-900 animate-pulse" />
    </button>
  );
};

const LayoutBody = () => {
  const { sidebarOpen, isSearching, setSidebarOpen } = useCabinFiltersContext();
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const shouldShowSidebar = !isHomePage || isSearching;

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
        <div className={`w-full ${shouldShowSidebar ? "p-4 md:p-8 lg:p-10 pb-0" : ""} ${shouldShowSidebar ? "max-w-[1600px] mx-auto" : ""}`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const ClientDashboardLayout = () => {
  const containerRef = useScrollToTop();

  return (
    <CabinFiltersProvider>
      <ClientAIChatProvider>
        <div className="h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-sky-100 selection:text-sky-900">
          {/* NAVIGATION PROGRESS */}
          <NavigationProgressBar />

          {/* NAVBAR */}
          <ClientNavbar />

          {/* SCROLLABLE WRAPPER */}
          <div
            ref={containerRef as React.RefObject<HTMLDivElement>}
            className="flex-1 overflow-y-auto scroll-smooth flex flex-col"
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
    </CabinFiltersProvider>
  );
};

export default ClientDashboardLayout;
