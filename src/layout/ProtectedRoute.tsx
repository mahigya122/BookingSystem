import { Navigate } from "react-router-dom";
import { getUser } from "../features/auth/authStorage";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;