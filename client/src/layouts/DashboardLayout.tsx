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
        <div className="h-screen flex flex-col" style={{ background: "var(--app-bg)", color: "var(--app-text-main)" }}>
          <Navbar />

          <div className="flex flex-1 overflow-hidden">
            <Sidebar />

            <main className="flex-1 overflow-y-auto p-6 lg:p-10">
              <div className="max-w-7xl mx-auto">
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
