import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getCurrentUser } from "../../../src/services/apiAuth";

export function useUser() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  const {
    isLoading,
    data: user,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: isDashboard,
  });

  return {
    isLoading,
    user,
    isError: !!error,
    isAuthenticated: !!user,
  };
}
