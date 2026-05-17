import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "../layout/ProtectedRoute";

import Home from "../pages/Home";
import Booking from "../pages/Booking";
import Cabins from "../pages/Cabins";
import User from "../pages/User";
import Settings from "../pages/Settings";
import Login from "../pages/Login";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "bookings", element: <Booking /> },
      { path: "cabins", element: <Cabins /> },
      { path: "users", element: <User /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);