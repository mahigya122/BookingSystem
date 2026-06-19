import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "../services/http";

export type DashboardStats = {
  totalBookings: number;
  totalGuests: number;
  revenue: number;
  occupancyRate: number;
};

export function useDashboardStats() {
  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: () => fetchJson<DashboardStats>("/dashboard/stats"),
  });

  return { stats, isLoading, error };
}
