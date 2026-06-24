import { useMemo } from "react";
import { useCabinsData } from "../domains/cabins/hooks/useCabinsData";
import { useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";
import type { CabinWithBookings } from "../shared/services/cabinWithBookings";

export const useExplore = (page?: number, pageSize?: number) => {
  const { appliedFilters: filters } = useCabinFiltersContext();
  const { cabins = [], data, isLoading, error } = useCabinsData(filters, page, pageSize);

  const isPaginated = page !== undefined && pageSize !== undefined;

  const cabinsList = useMemo(() => {
    return cabins.map((cabin: CabinWithBookings) => ({
      ...cabin,
      isBookedByUser: false,
      isBookedByOthers: false,
      isBooked: false,
      bookingCount: 0,
    }));
  }, [cabins]);

  const total = isPaginated ? (data as any)?.count ?? 0 : cabinsList.length;

  return {
    cabins: cabinsList,
    isLoading,
    totalCount: total,
    filteredCount: total,
    error,
  };
};
