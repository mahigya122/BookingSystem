import { useQuery } from "@tanstack/react-query";
import { supabase } from "@shared/services/supabase";
import type { Guest, GuestSortType } from "../../types/guest";

export function useGuests(
  page?: number,
  pageSize?: number,
  search = "",
  sort: GuestSortType = "recent"
): {
  guests: Guest[];
  totalCount: number;
  isLoading: boolean;
  error: any;
} {
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["guests", page, pageSize, search, sort],
    queryFn: async () => {
      let query = supabase
        .from("guests")
        .select("*", { count: "exact" });

      if (search && search.trim()) {
        const queryTerm = `%${search.trim()}%`;
        query = query.or(`full_name.ilike.${queryTerm},email.ilike.${queryTerm},phone.ilike.${queryTerm}`);
      }

      if (sort === "recent") {
        query = query.order("created_at", { ascending: false });
      } else if (sort === "earlier") {
        query = query.order("created_at", { ascending: true });
      } else if (sort === "name-az") {
        query = query.order("full_name", { ascending: true });
      } else if (sort === "name-za") {
        query = query.order("full_name", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      if (page !== undefined && pageSize !== undefined) {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
      }

      const { data: list, count, error: err } = await query;

      if (err) throw err;

      if (page !== undefined && pageSize !== undefined) {
        return {
          guests: list ?? [],
          count: count ?? 0,
        };
      }
      return list ?? [];
    },
  });

  const isPaginated = page !== undefined && pageSize !== undefined;
  const guestsList = isPaginated ? data?.guests ?? [] : data ?? [];
  const total = isPaginated ? data?.count ?? 0 : guestsList.length;

  return {
    guests: guestsList as Guest[],
    totalCount: total,
    isLoading,
    error,
  };
}