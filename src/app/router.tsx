import { createBrowserRouter, Navigate } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "../layout/ProtectedRoute";

import Login from "../pages/Login";
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import Cabins from "../pages/Cabins";
import User from "../pages/User";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "bookings", element: <Booking /> },
      { path: "cabins", element: <Cabins /> },
      { path: "profile", element: <Profile /> },
      { path: "user", element: <User /> },
      { path: "settings", element: <Settings /> },
    ],
  },

  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);