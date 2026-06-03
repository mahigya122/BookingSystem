import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "@shared/components/layout/ProtectedRoute";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import Cabins from "../pages/Cabins";
import Guests from "../pages/Guests";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Book from "../pages/Book";
import Login from "../pages/Login";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <Home /> },
      { path: "bookings", element: <Booking /> },
      { path: "book", element: <Book /> },
      { path: "cabins", element: <Cabins /> },
      { path: "profile", element: <Profile /> },
      { path: "guests", element: <Guests /> },
      { path: "user", element: <Navigate to="/admin/guests" replace /> },
      { path: "settings", element: <Settings /> },
    ],
  },
];
