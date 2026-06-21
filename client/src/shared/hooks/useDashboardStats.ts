import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchJson } from "../services/http";
import type { Booking } from "../types/booking";

export type DashboardStats = {
  totalBookings: number;
  totalGuests: number;
  revenue: number;
  occupancyRate: number;
  salesChartData: { date: string; sales: number }[];
  stayDurationData: { name: string; value: number }[];
  todayActivity: { arrivals: number; departures: number; checkIns: number };
  recentBookings: Booking[];
  todayBookings: Booking[];
  cancelledBookingsCount: number;
};

export function useDashboardStats(startDate?: string, endDate?: string) {
  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats", startDate, endDate],
    queryFn: () => {
      let url = "/dashboard/stats";
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      return fetchJson<DashboardStats>(url);
    },
    staleTime: 30 * 1000, // Keep data fresh for 30 seconds (overrides global default)
    gcTime: 30 * 60 * 1000, // Cache inactive queries for 30 minutes
    refetchOnWindowFocus: false, // Avoid refetching on window focus
    placeholderData: keepPreviousData, // Keep previous data when key changes
  });

  return { stats, isLoading, error };
}
