import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { Cabin } from "../../types/cabin";
import { fetchJson } from "../../services/http";

export function useCabins(
  page?: number,
  pageSize?: number,
  filter = "all",
  sort = "recent"
): {
  cabins: Cabin[];
  totalCount: number;
  isLoading: boolean;
  error: any;
} {
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["cabins", page, pageSize, filter, sort],
    queryFn: () => {
      let url = `/cabins?filter=${filter}&sort=${sort}`;
      if (page !== undefined && pageSize !== undefined) {
        url += `&page=${page}&pageSize=${pageSize}`;
      }
      return fetchJson<any>(url);
    },
    staleTime: 15 * 60 * 1000, // Keep data fresh for 15 minutes (overrides global default)
    placeholderData: keepPreviousData,
  });

  const rawList = (data as any)?.data ?? data;
  const cabinsList = Array.isArray(rawList) ? rawList : [];
  const total = (data as any)?.count ?? cabinsList.length;

  return {
    cabins: cabinsList as Cabin[],
    totalCount: total,
    isLoading,
    error,
  };
}
