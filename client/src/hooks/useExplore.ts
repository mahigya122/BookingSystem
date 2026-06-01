import { useMemo } from "react";
import { useCabinsData } from "./useCabinsData";
import { useCabinFiltersContext } from "../contexts/CabinFiltersContext";

export const useExplore = () => {
  const { cabins = [], isLoading } = useCabinsData();
  const { filters } = useCabinFiltersContext();

  const filteredCabins = useMemo(() => {
    return cabins.filter((cabin) => {
      // Price filter
      const withinPrice =
        cabin.price_per_night >= filters.price[0] &&
        cabin.price_per_night <= filters.price[1];

      // Capacity filter
      const withinCapacity = filters.capacity
        ? cabin.capacity >= filters.capacity
        : true;

      const withinDate =
        !filters.dateRange.startDate || !filters.dateRange.endDate
          ? true
          : true;

      return withinPrice && withinCapacity && withinDate;
    });
  }, [cabins, filters]);

  // Sort logic could also be moved here

  return {
    cabins: filteredCabins,
    isLoading,
    totalCount: cabins.length,
    filteredCount: filteredCabins.length
  };
};
