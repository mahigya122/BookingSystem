import { Outlet } from "react-router-dom";

import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* TOP NAVBAR */}
      <Navbar />

      {/* BODY SECTION */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <Sidebar />

        {/* RIGHT CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
