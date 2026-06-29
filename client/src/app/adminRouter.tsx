import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "@shared/components/layout/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

// Trigger background preload for the primary entry Dashboard page
import("../domains/admin/pages/Home").catch(() => { });
import {
  Home,
  Booking,
  Cabins,
  Guests,
  Profile,
  Settings,
  Book,
  Login,
  Payments,
  Locations,
  Offers,
  Activities,
  Reviews,
  Messages,
} from "./lazyPages";

export const adminRouter = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute requiredRole="admin">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Home /> },
      { path: "bookings", element: <Booking /> },
      { path: "book", element: <Book /> },
      { path: "payments", element: <Payments /> },
      { path: "cabins", element: <Cabins /> },
      { path: "locations", element: <Locations /> },
      { path: "offers", element: <Offers /> },
      { path: "activities", element: <Activities /> },
      { path: "reviews", element: <Reviews /> },
      { path: "profile", element: <Profile /> },
      { path: "guests", element: <Guests /> },
      { path: "user", element: <Navigate to="/guests" replace /> },
      { path: "settings", element: <Settings /> },
      { path: "messages", element: <Messages /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
], {
  basename: "/admin"
});
