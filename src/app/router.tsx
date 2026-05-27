import { createBrowserRouter, Navigate } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "../layout/ProtectedRoute";

import Login from "../pages/Login";
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import BookingForm from "../components/booking/BookingForm";
import Cabins from "../pages/Cabins";
import Guests from "../pages/Guests";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import ClientDashboard from "../client/pages/ClientDashboard";
import ClientProfile from "../client/pages/ClientProfile";

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
      { path: "book", element: <BookingForm /> },
      { path: "cabins", element: <Cabins /> },
    { path: "client", element: <ClientDashboard /> },
    { path: "client/profile", element: <ClientProfile /> },
      { path: "profile", element: <Profile /> },
      { path: "guests", element: <Guests /> },
      { path: "user", element: <Navigate to="/dashboard/guests" replace /> },
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