import { Navigate } from "react-router-dom";
import { useUser } from "../../shared/auth_hooks";

const ProtectedRoute = ({ 
  children 
}: { 
  children: React.ReactNode
 }) => {
  const { isLoading, isAuthenticated } = useUser();

  // During local development allow bypassing auth so the dashboard can be visually inspected
  if (import.meta.env.DEV) {
    return <>{children}</>;
  }

  if (isLoading) return <p>Loading...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;