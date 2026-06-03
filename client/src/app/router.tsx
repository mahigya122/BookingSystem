import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "@shared/components/layout/ProtectedRoute";
import ClientDashboardLayout from "../layouts/ClientDashboardLayout";
import ClientDashboard from "../domains/cabins/pages/ClientDashboard";
import ClientProfile from "../domains/guests/pages/ClientProfile";
import Login from "./LoginWrapper";
import CabinDetails from "../domains/cabins/pages/CabinDetails";
import ClientFullPageLayout from "../layouts/ClientFullPageLayout";
import MyBookings from "../domains/bookings/pages/MyBookings";
import { adminRoutes } from "../domains/admin/routes/adminRoutes";

export const router = createBrowserRouter([
  ...adminRoutes,
  {
    path: "/user/login",
    element: <Login />,
  },
  {
    path: "/user",
    element: <ClientDashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/user/explore" replace /> },
      { path: "explore", element: <ClientDashboard /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute requiredRole="guest">
            <ClientProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "bookings",
        element: (
          <ProtectedRoute requiredRole="guest">
            <MyBookings />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // 👇 FULL PAGE LAYOUT (NO SIDEBAR)
  {
    element: <ClientFullPageLayout />,
    children: [
      { path: "/user/cabin/:id", element: <CabinDetails /> },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/user/explore" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/user/explore" replace />,
  },
]);
