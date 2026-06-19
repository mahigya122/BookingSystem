import { useQuery } from "@tanstack/react-query";
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
  });

  const isPaginated = page !== undefined && pageSize !== undefined;
  const cabinsList = isPaginated ? data?.data ?? [] : data ?? [];
  const total = isPaginated ? data?.count ?? 0 : cabinsList.length;

  return {
    cabins: cabinsList as Cabin[],
    totalCount: total,
    isLoading,
    error,
  };
}
