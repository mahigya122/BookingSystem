import { useQuery } from "@tanstack/react-query";
import { getCabinsWithBookings } from "../../../shared/services/cabinWithBookings";
import type { CabinWithBookings, ExploreFilters, PaginatedCabins } from "../../../shared/services/cabinWithBookings";

export const useCabinsData = (filters?: ExploreFilters, page?: number, pageSize?: number) => {
  const { data, isLoading, error } = useQuery<CabinWithBookings[] | PaginatedCabins, Error>({
    queryKey: ["cabins-with-bookings", filters, page, pageSize],
    queryFn: () => getCabinsWithBookings(filters, page, pageSize),
  });

  const isPaginated = page !== undefined && pageSize !== undefined;
  const rawList = isPaginated ? (data as PaginatedCabins)?.data : data;
  const cabins = Array.isArray(rawList) ? rawList : [];

  return { cabins, data, isLoading, error };
};