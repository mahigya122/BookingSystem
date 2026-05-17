import { createBrowserRouter, Navigate } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "../layout/ProtectedRoute";

import Login from "../pages/Login";
import Home from "../pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

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
    ],
  },

  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);