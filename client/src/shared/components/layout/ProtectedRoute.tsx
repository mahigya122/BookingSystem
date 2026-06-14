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
  const { pathname } = useLocation();

  const isAdminApp = window.location.pathname.startsWith("/admin");

  // Navigate will be relative to the basename of the current router
  const loginPath = "/login";
  const homePath = "/";

  // 1. still loading auth session
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          <p className="text-sm font-bold text-slate-500 animate-pulse">Verifying Session...</p>
        </div>
      </div>
    );
  }

  // Prevent infinite loop if already on login page
  const isAtLogin = pathname === "/login";

  // 2. not logged in
  if (!isAuthenticated) {
    if (isAtLogin) return children;
    return <Navigate to={loginPath} replace />;
  }

  // 3. Role Check
  if (requiredRole) {
    if (!user?.role) {
      return (
        <div className="h-screen flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
        </div>
      );
    }

    // Admins can access guest pages in this app's context to allow testing
    const hasPermission = user.role === requiredRole || (user.role === "admin" && !isAdminApp);

    if (!hasPermission) {
      if (isAtLogin) return children;

      // If we are in the admin app and the user doesn't have permission,
      // redirect them to the login page. This breaks potential loops
      // and satisfies the requirement to land on the login page.
      if (isAdminApp) {
        return <Navigate to={loginPath} replace />;
      }

      // If they have a role but it's wrong, don't send to login (infinite loop if they are already logged in)
      // Send to home or dashboard instead
      return <Navigate to={homePath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;