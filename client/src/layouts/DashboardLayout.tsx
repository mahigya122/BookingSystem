import { Outlet } from "react-router-dom";
import Navbar from "./AdminNavbar";
import Sidebar from "./AdminSidebar";
import AIChatDrawer from "../domains/admin/components/ai/AIChatDrawer";
import { AIChatProvider } from "../domains/admin/contexts/AIChatContext";
import { AdminSidebarProvider } from "../domains/admin/contexts/AdminSidebarContext";


const DashboardLayout = () => {
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
            <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 scroll-smooth">
              <div className="max-w-[1600px] mx-auto">
                <Outlet />
              </div>
            </main>
          </div>

          <AIChatDrawer />
        </div>
      </AIChatProvider>
    </AdminSidebarProvider>
  );
};

export default DashboardLayout;
