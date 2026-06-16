import { useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";
import type { CabinFilters } from "../store/useCabinFilters";

export const useFilterActions = () => {
  const { filters, setFilters, clearFilters, applyFilters, isSearching, setSidebarOpen } = useCabinFiltersContext();

  const handlePriceChange = (values: number[]) => {
    setFilters({ ...(filters || {}), price: [values[0], values[1]] } as any);
  };

  const handleCapacityChange = (guest: number) => {
    setFilters({ ...(filters || {}), capacity: filters?.capacity === guest ? null : guest } as any);
  };

  const handleDateChange = (item: { startDate: Date | null; endDate: Date | null }) => {
    setFilters({
      ...(filters || {}),
      dateRange: {
        startDate: item.startDate,
        endDate: item.endDate,
      }
    } as any);
  };

  const handleStatusChange = (status: CabinFilters["bookingStatus"]) => {
    setFilters({ ...(filters || {}), bookingStatus: status } as any);
    // Auto-close sidebar on mobile after selection to show results
    if (window.innerWidth < 1024) {
      setTimeout(() => setSidebarOpen(false), 300);
    }
  };

  return {
    filters,
    handlePriceChange,
    handleCapacityChange,
    handleDateChange,
    handleStatusChange,
    clearFilters,
    applyFilters,
    isSearching,
    setSidebarOpen
  };
};
