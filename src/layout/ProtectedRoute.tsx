import { Navigate } from "react-router-dom";
import { useUser } from "../authentication/useUser";

const ProtectedRoute = ({ 
  children 
}: { 
  children: React.ReactNode
 }) => {
  const { isLoading, isAuthenticated } = useUser();

  if (isLoading) return <p>Loading...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;