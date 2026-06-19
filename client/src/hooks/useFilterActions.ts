import { useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";
import type { CabinFilters } from "../store/useCabinFilters";
import { DEFAULT_FILTERS } from "../store/useCabinFilters";
import { useNavigate } from "react-router-dom";
import { scrollToTop } from "@shared/hooks/useScrollToTop";

export const useFilterActions = () => {
  const { 
    filters, 
    setFilters, 
    clearFilters, 
    applyFilters, 
    isSearching, 
    setSidebarOpen
  } = useCabinFiltersContext();
  const navigate = useNavigate();

  const handlePriceChange = (values: number[]) => {
    setFilters({ ...filters, price: [values[0], values[1]] });
  };

  const handleCapacityChange = (guest: number) => {
    setFilters({ ...filters, capacity: filters.capacity === guest ? null : guest });
  };

  const handleDateChange = (item: { startDate: Date | null; endDate: Date | null }) => {
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
    // Auto-close sidebar on mobile after selection to show results
    if (window.innerWidth < 1024) {
      setTimeout(() => setSidebarOpen(false), 300);
    }
  };

  const handleLocationChange = (locationId: string | null) => {
    setFilters({ ...filters, location_id: locationId });
  };

  const handleActivityChange = (activityId: string | null) => {
    setFilters({ ...filters, activity_id: activityId });
  };

  const handleReset = () => {
    // Reset to defaults but keep the results page visible
    setFilters(DEFAULT_FILTERS);
    applyFilters(DEFAULT_FILTERS);
    setSidebarOpen(true);
    navigate("/");
    scrollToTop(null, "auto");
  };

  return {
    filters,
    handlePriceChange,
    handleCapacityChange,
    handleDateChange,
    handleStatusChange,
    handleLocationChange,
    handleActivityChange,
    handleReset,
    clearFilters,
    applyFilters,
    isSearching,
    setSidebarOpen
  };
};
