import { QueryClient } from "@tanstack/react-query";

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 3,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
};

export const createQueryClient = () => new QueryClient(queryClientConfig);
