import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@shared/hooks/auth/useAuthUser";
import type { AuthRole } from "../../types/auth";

const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: AuthRole;
}) => {
  const { isLoading, isAuthenticated, user } = useUser();
  const location = useLocation();


  const loginPath = location.pathname.startsWith("/admin")
    ? "/admin/login"
    : "/user/login";

  // 1. still loading auth session
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // 2. not logged in
  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace />;
  }

  // 3. IMPORTANT FIX: wait for role to exist
  if (requiredRole) {
    if (!user?.role) {
      return (
        <div className="h-screen flex items-center justify-center">
          Loading permissions...
        </div>
      );
    }

    if (user.role !== requiredRole) {
      return <Navigate to={loginPath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;