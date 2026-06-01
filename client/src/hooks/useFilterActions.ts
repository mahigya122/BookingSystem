import { useCabinFiltersContext } from "../contexts/CabinFiltersContext";
import type { CabinFilters } from "../store/useCabinFilters";

export const useFilterActions = () => {
  const { filters, setFilters, clearFilters } = useCabinFiltersContext();

  const handlePriceChange = (values: number[]) => {
    setFilters({ ...filters, price: [values[0], values[1]] });
  };

  const handleCapacityChange = (guest: number) => {
    setFilters({ ...filters, capacity: filters.capacity === guest ? null : guest });
  };

  const handleDateChange = (item: any) => {
    setFilters({
      ...filters,
      dateRange: {
        startDate: item.startDate,
        endDate: item.endDate,
      }
    });
  };

  const handleStatusChange = (status: CabinFilters["bookingStatus"]) => {
    setFilters({ ...filters, bookingStatus: status });
  };

  return {
    filters,
    handlePriceChange,
    handleCapacityChange,
    handleDateChange,
    handleStatusChange,
    clearFilters
  };
};
