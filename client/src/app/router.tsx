import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "@shared/components/layout/ProtectedRoute";
import ClientDashboardLayout from "../layouts/ClientDashboardLayout";
import ClientDashboard from "../domains/cabins/pages/ClientDashboard";
import ClientProfile from "../domains/guests/pages/ClientProfile";
import Login from "./LoginWrapper";
import CabinDetails from "../domains/cabins/pages/CabinDetails";
import ClientFullPageLayout from "../layouts/ClientFullPageLayout";
import MyBookings from "../domains/bookings/pages/MyBookings";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ClientDashboardLayout />,
    children: [
      { index: true, element: <ClientDashboard /> },
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
      { path: "/cabin/:id", element: <CabinDetails /> },
    ],
  },
  {
    path: "/user/*",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/admin/*",
    loader: () => {
      window.location.href = "/admin/";
      return null;
    },
    element: null,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
