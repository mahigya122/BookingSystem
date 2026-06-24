import { Outlet, useLocation } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import ClientNavbar from "./ClientNavbar";
import { ClientAIChatProvider } from "../domains/guests/contexts/ClientAIChatContext";
import { useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";
import ClientAIChatDrawer from "../domains/guests/components/ai/ClientAIChatDrawer";
import Footer from "@shared/components/layout/Footer";
import NavigationProgressBar from "@shared/components/layout/NavigationProgressBar";
import { useScrollToTop } from "@shared/hooks/useScrollToTop";
import AIFloatButton from "@shared/components/ui/AIFloatButton";

const LayoutBody = () => {
  const { sidebarOpen, setSidebarOpen } = useCabinFiltersContext();
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isExplorePage = location.pathname.startsWith("/explorepage") || location.pathname.includes("explorepage");
  const isBookingsPage = location.pathname.startsWith("/bookings") || location.pathname.includes("bookings");
  const shouldShowSidebar = isExplorePage;

  return (
    <div className="flex flex-1 relative">
      {/* DECORATIVE ELEMENTS (SUBTLE) */}
      <div className="absolute top-40 left-80 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl pointer-events-none" />

      {/* LEFT SIDEBAR PANEL */}
      {shouldShowSidebar && (
        <aside
          className={`
                    fixed inset-y-0 left-0 z-50 flex flex-col border-r
                    lg:static lg:h-auto lg:max-h-none lg:overflow-visible
                    bg-white dark:bg-slate-900 lg:bg-white/60 lg:dark:bg-slate-900/60
                    backdrop-blur-2xl transition-all duration-500 ease-in-out
                    border-sky-50 dark:border-sky-900/20
                    ${sidebarOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0 lg:w-[80px]"}
                `}
        >
          <div className="w-full lg:sticky lg:top-20 lg:h-auto lg:max-h-full flex flex-col overflow-y-auto overflow-x-hidden">
            <UserSidebar />
          </div>
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
        <div className={`w-full ${isHomePage
            ? ""
            : isExplorePage
              ? "pt-1 md:pt-2 pb-0"
              : isBookingsPage
                ? "pt-1 md:pt-2 pb-0"
                : "pt-4 md:pt-6 pb-8"
          } px-4 mx-auto`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const ClientDashboardLayout = () => {
  const containerRef = useScrollToTop();

  return (
    <ClientAIChatProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-sky-100 selection:text-sky-900 overflow-x-hidden">
        {/* NAVIGATION PROGRESS */}
        <NavigationProgressBar />

        {/* NAVBAR */}
        <ClientNavbar />

        {/* SCROLLABLE WRAPPER */}
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          className="flex-1 flex flex-col w-full"
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
