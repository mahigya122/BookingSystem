import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

export type CabinFilters = {
    price: [number, number];
    capacity: number | null;
    dateRange: {
        startDate: Date | null;
        endDate: Date | null;
    };
    bookingStatus: "all" | "upcoming" | "completed" | "cancelled";
    location_id: string | null;
    activity_id: string | null;
    offer_id: string | null;
};

export const DEFAULT_FILTERS: CabinFilters = {
    price: [50, 1000],
    capacity: null,
    dateRange: {
        startDate: null,
        endDate: null,
    },
    bookingStatus: "all",
    location_id: null,
    activity_id: null,
    offer_id: null,
};

export const useCabinFilters = () => {
    // 1. Initialize State from LocalStorage
    const [filters, setFilters] = useState<CabinFilters>(() => {
        try {
            const saved = localStorage.getItem("cabin-filters");
            if (!saved) return DEFAULT_FILTERS;
            
            const parsed = JSON.parse(saved);
            // Merge with defaults and convert strings back to Date objects
            return {
                ...DEFAULT_FILTERS,
                ...parsed,
                dateRange: {
                    startDate: parsed?.dateRange?.startDate ? new Date(parsed.dateRange.startDate) : null,
                    endDate: parsed?.dateRange?.endDate ? new Date(parsed.dateRange.endDate) : null,
                }
            };
        } catch (err) {
            console.error("Error loading filters from localStorage", err);
            return DEFAULT_FILTERS;
        }
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<CabinFilters>(filters);

    // 2. Persist to LocalStorage
    useEffect(() => {
        localStorage.setItem("cabin-filters", JSON.stringify(filters));
    }, [filters]);

    // 3. Compute Active Filter Count
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.capacity !== null) count++;
        if (filters.bookingStatus !== "all") count++;
        if (filters.dateRange.startDate !== null) count++;
        if (filters.dateRange.endDate !== null) count++;
        if (filters.location_id !== null) count++;
        if (filters.activity_id !== null) count++;
        if (filters.offer_id !== null) count++;
        
        // Price count: if different from default
        if (filters.price[0] !== DEFAULT_FILTERS.price[0] || filters.price[1] !== DEFAULT_FILTERS.price[1]) {
            count++;
        }
        
        return count;
    }, [filters]);

    // 4. Auto-Open Sidebar when filters change
    const [prevFiltersJson, setPrevFiltersJson] = useState(JSON.stringify(filters));
    
    const currentJson = JSON.stringify(filters);
    if (currentJson !== prevFiltersJson) {
        setPrevFiltersJson(currentJson);
        // Only open if there are active filters
        if (activeFilterCount > 0) {
            setSidebarOpen(true);
        }
    }

    // 5. Actions
    const clearFilters = (silent = false) => {
        const clearedJson = JSON.stringify(DEFAULT_FILTERS);
        setFilters(DEFAULT_FILTERS);
        setAppliedFilters(DEFAULT_FILTERS);
        setPrevFiltersJson(clearedJson); // Update prevJson to avoid auto-opening after clear
        setSidebarOpen(false);
        setIsSearching(false);
        if (!silent) {
            toast.success("Filters cleared");
        }
    };

    const applyFilters = (newFilters?: CabinFilters) => {
        const filtersToApply = newFilters || filters;
        
        setIsRefreshing(true);
        const tid = toast.loading(isSearching ? "Refining results..." : "Searching cabins...");
        
        // Brief delay to simulate a "refresh" and ensure the user sees the transition
        setTimeout(() => {
            setAppliedFilters(filtersToApply);
            setIsSearching(true);
            setIsRefreshing(false);
            // setSidebarOpen(false); // REMOVED: Keep sidebar open as requested
            toast.dismiss(tid);
        }, 400);
    };

    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return { 
        filters, 
        appliedFilters,
        setFilters, 
        clearFilters, 
        applyFilters,
        isSearching,
        setIsSearching,
        isRefreshing,
        sidebarOpen, 
        setSidebarOpen, 
        toggleSidebar,
        activeFilterCount 
    };
};
