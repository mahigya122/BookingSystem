import { Outlet } from "react-router-dom";
import Navbar from "./AdminNavbar";
import Sidebar from "./AdminSidebar";
import AIChatDrawer from "../domains/admin/components/ai/AIChatDrawer";
import AdminAIFloatButton from "@shared/components/ui/AdminAIFloatButton";
import { AIChatProvider } from "../domains/admin/contexts/AIChatContext";
import { AdminSidebarProvider } from "../domains/admin/contexts/AdminSidebarContext";
import { useScrollToTop } from "@shared/hooks/useScrollToTop";


const DashboardLayout = () => {
  const containerRef = useScrollToTop();

  return (
    <AdminSidebarProvider>
      <AIChatProvider>
        <div className="h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          {/* NAVBAR */}
          <Navbar />

          <div className="flex flex-1 overflow-hidden relative">
            {/* DECORATIVE BLURS */}
            <div className="absolute top-20 right-0 w-80 h-80 bg-sky-100/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-40 w-64 h-64 bg-emerald-100/20 rounded-full blur-3xl pointer-events-none" />

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT */}
            <main
              ref={containerRef as React.RefObject<HTMLElement>}
              className="flex-1 overflow-y-auto px-4 py-6 md:py-16 scroll-smooth w-full"
            >
              <div className="w-full mx-auto">
                <Outlet />
              </div>
            </main>
          </div>

          <AIChatDrawer />
          <AdminAIFloatButton />
        </div>
      </AIChatProvider>
    </AdminSidebarProvider>
  );
};

export default DashboardLayout;
