import { Outlet } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import AIChatDrawer from "../components/ai/AIChatDrawer";

const DashboardLayout = () => {
  return (
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
  );
};

export default DashboardLayout;
