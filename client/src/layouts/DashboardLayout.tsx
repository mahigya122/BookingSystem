import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./AdminNavbar";
import Sidebar from "./AdminSidebar";
import AIChatDrawer from "../domains/admin/components/ai/AIChatDrawer";
import AdminAIFloatButton from "@shared/components/ui/AdminAIFloatButton";
import { AIChatProvider, useAIChat } from "../domains/admin/ai/AIChatContext";
import { AdminSidebarProvider } from "../domains/admin/contexts/AdminSidebarContext";
import { useScrollToTop } from "@shared/hooks/useScrollToTop";
import DashboardSkeleton from "../domains/admin/components/dashboard/DashboardSkeleton";

const DashboardLayoutContent = () => {
  const containerRef = useScrollToTop();
  const { open: aiOpen } = useAIChat();
  const location = useLocation();
  const isMessagesPage = location.pathname === "/messages";

  return (
    <div className="h-screen flex flex-col bg-sky-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* NAVBAR */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden relative">
        {/* DECORATIVE BLURS */}
        <div className="absolute top-20 right-0 w-80 h-80 bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-40 w-64 h-64 bg-emerald-100/20 rounded-full blur-3xl pointer-events-none" />

        {/* SIDEBAR */}
        {!aiOpen && <Sidebar />}

        {/* MAIN CONTENT */}
        <main
          ref={containerRef as React.RefObject<HTMLElement>}
          className={`flex-1 w-full min-w-0 ${
            isMessagesPage
              ? "h-full overflow-hidden flex flex-col"
              : "overflow-y-auto px-4 pt-4 md:px-6 md:pt-6 pb-8 scroll-smooth"
          }`}
        >
          <div className={isMessagesPage ? "h-full w-full" : "w-full mx-auto"}>
            <Suspense fallback={<DashboardSkeleton />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>

      <AIChatDrawer />
      <AdminAIFloatButton />
    </div>
  );
};

const DashboardLayout = () => {
  return (
    <AdminSidebarProvider>
      <AIChatProvider>
        <DashboardLayoutContent />
      </AIChatProvider>
    </AdminSidebarProvider>
  );
};

export default DashboardLayout;
