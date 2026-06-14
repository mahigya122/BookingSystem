import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "@shared/components/layout/ProtectedRoute";
import ClientDashboardLayout from "../layouts/ClientDashboardLayout";
import ClientDashboard from "../domains/cabins/pages/CabinDetails/explorepage/ClientDashboard";
import ClientProfile from "../domains/guests/pages/ClientProfile";
import Login from "./LoginWrapper";
import CabinDetails from "../domains/cabins/pages/CabinDetails/CabinDetails";
import ClientFullPageLayout from "../layouts/ClientFullPageLayout";
import MyBookings from "../domains/bookings/pages/MyBookings";
import PaymentSuccess from "../domains/payments/pages/PaymentSuccess";
import PaymentFailure from "../domains/payments/pages/PaymentFailure";

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
      { path: "/payment/success", element: <PaymentSuccess /> },
      { path: "/payment/failure", element: <PaymentFailure /> },
    ],
  },
  {
    path: "/user/*",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/admin/*",
    loader: () => {
      window.location.href = "/admin/index.html";
      return null;
    },
    element: null,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
