import { useMemo } from "react";
import { useCabinsData } from "../domains/cabins/hooks/useCabinsData";
import { useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";
import { isCabinBookedInRange } from "@shared/utils/bookingUtils";

export const useExplore = () => {
  const { cabins = [], isLoading } = useCabinsData();
  const { filters } = useCabinFiltersContext();

  const filteredCabins = useMemo(() => {
    return cabins
      .map((cabin) => {
        const isBooked =
          filters.dateRange.startDate &&
          filters.dateRange.endDate &&
          isCabinBookedInRange(
            cabin.id,
            cabin.bookings || [],
            new Date(filters.dateRange.startDate),
            new Date(filters.dateRange.endDate)
          );

        return {
          ...cabin,
          isBooked: !!isBooked,
        };
      })
      .filter((cabin) => {
        const withinPrice =
          cabin.price_per_night >= filters.price[0] &&
          cabin.price_per_night <= filters.price[1];

        const withinCapacity =
          filters.capacity ? cabin.capacity === filters.capacity : true;

        return withinPrice && withinCapacity;
      });
  }, [cabins, filters]);

  return {
    cabins: filteredCabins,
    isLoading,
    totalCount: cabins.length,
    filteredCount: filteredCabins.length,
  };
};