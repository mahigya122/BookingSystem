import { QueryClient } from "@tanstack/react-query";

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false, // Prevent refetching when switching tabs/focusing
      retry: 1,
    },
  },
};

export const createQueryClient = () => new QueryClient(queryClientConfig);
