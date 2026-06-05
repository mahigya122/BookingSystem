import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "@shared/components/layout/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../domains/admin/pages/Home";
import Booking from "../domains/admin/pages/Booking";
import Cabins from "../domains/admin/pages/Cabins";
import Guests from "../domains/admin/pages/Guests";
import Profile from "../domains/admin/pages/Profile";
import Settings from "../domains/admin/pages/Settings";
import Book from "../domains/admin/pages/Book";
import Login from "../domains/admin/pages/Login";
import Payments from "../domains/admin/pages/Payments";

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
      { path: "profile", element: <Profile /> },
      { path: "guests", element: <Guests /> },
      { path: "user", element: <Navigate to="/guests" replace /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
], {
  basename: "/admin"
});
