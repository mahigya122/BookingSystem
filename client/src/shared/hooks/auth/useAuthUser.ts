import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@shared/services/apiAuth";
import type { AuthUser } from "@shared/types/auth";

export function useAuthUser() {
  const {
    isLoading,
    data: user,
    error,
  } = useQuery<AuthUser | null>({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    isLoading,
    user,
    role: user?.role ?? null,
    isAdmin: user?.role === "admin",
    isGuest: user?.role === "guest",
    isAuthenticated: !!user,
    isError: !!error,
  };
}

export { useAuthUser as useUser };

