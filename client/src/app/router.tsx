import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "@shared/components/layout/ProtectedRoute";
import ClientDashboardLayout from "../layouts/ClientDashboardLayout";
import ClientFullPageLayout from "../layouts/ClientFullPageLayout";
import RootClientLayout from "../layouts/RootClientLayout";
import {
  ClientDashboard,
  ClientProfile,
  Login,
  CabinDetails,
  MyBookings,
  PaymentSuccess,
  PaymentFailure,
  InfoPage,
} from "./lazyClientPages";

export const router = createBrowserRouter([
  {
    element: <RootClientLayout />,
    children: [
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
            path: "explorepage",
            element: <ClientDashboard />,
          },
          {
            path: "explorepage:pageSuffix",
            element: <ClientDashboard />,
          },
          {
            path: "explorepage/:pageParam",
            element: <ClientDashboard />,
          },
          {
            path: "bookings",
            element: (
              <ProtectedRoute requiredRole="guest">
                <MyBookings />
              </ProtectedRoute>
            ),
          },
          {
            path: "bookings:pageSuffix",
            element: (
              <ProtectedRoute requiredRole="guest">
                <MyBookings />
              </ProtectedRoute>
            ),
          },
          {
            path: "bookings/:pageParam",
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
          {
            path: "/profile",
            element: (
              <ProtectedRoute requiredRole="guest">
                <ClientProfile />
              </ProtectedRoute>
            ),
          },
          { path: "/info/:slug", element: <InfoPage /> },
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
    ],
  },
]);
