import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../layout/ProtectedRoute";
import ClientDashboardLayout from "../layout/ClientDashboardLayout";
import ClientDashboard from "../pages/ClientDashboard";
import ClientProfile from "../pages/ClientProfile";
import Login from "./LoginWrapper";

// Admin Layout & Pages
import DashboardLayout from "../../../Admin/src/layout/DashboardLayout";
import Home from "../../../Admin/src/pages/Home";
import Booking from "../../../Admin/src/pages/Booking";
import BookingForm from "../../../Admin/src/components/booking/BookingForm";
import Cabins from "../../../Admin/src/pages/Cabins";
import Guests from "../../../Admin/src/pages/Guests";
import Profile from "../../../Admin/src/pages/Profile";
import Settings from "../../../Admin/src/pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/user/login",
    element: <Login />,
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute requiredRole="guest">
        <ClientDashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/user/explore" replace /> },
      { path: "explore", element: <ClientDashboard /> },
      { path: "profile", element: <ClientProfile /> },
      { path: "bookings", element: <div>My Bookings Page (Coming Soon)</div> },
    ],
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
      { path: "book", element: <BookingForm /> },
      { path: "cabins", element: <Cabins /> },
      { path: "profile", element: <Profile /> },
      { path: "guests", element: <Guests /> },
      { path: "user", element: <Navigate to="/admin/guests" replace /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/user/login" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/user/login" replace />,
  },
]);
