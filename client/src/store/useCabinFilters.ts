import { useState, useEffect, useMemo } from "react";

export type CabinFilters = {
    price: [number, number];
    capacity: number | null;
    dateRange: {
        startDate: Date | null;
        endDate: Date | null;
    };
    bookingStatus: "all" | "upcoming" | "completed" | "cancelled";
};

const DEFAULT_FILTERS: CabinFilters = {
    price: [80, 250],
    capacity: null,
    dateRange: {
        startDate: null,
        endDate: null,
    },
    bookingStatus: "all",
};

export const useCabinFilters = () => {
    // 1. Initialize State from LocalStorage
    const [filters, setFilters] = useState<CabinFilters>(() => {
        try {
            const saved = localStorage.getItem("cabin-filters");
            if (!saved) return DEFAULT_FILTERS;
            
            const parsed = JSON.parse(saved);
            // Convert strings back to Date objects
            return {
                ...parsed,
                dateRange: {
                    startDate: parsed.dateRange.startDate ? new Date(parsed.dateRange.startDate) : null,
                    endDate: parsed.dateRange.endDate ? new Date(parsed.dateRange.endDate) : null,
                }
            };
        } catch (err) {
            console.error("Error loading filters from localStorage", err);
            return DEFAULT_FILTERS;
        }
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);

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
        
        // Price count: if different from default
        if (filters.price[0] !== DEFAULT_FILTERS.price[0] || filters.price[1] !== DEFAULT_FILTERS.price[1]) {
            count++;
        }
        
        return count;
    }, [filters]);

    // 4. Auto-Open Sidebar if filters become active
    useEffect(() => {
        if (activeFilterCount > 0) {
            setSidebarOpen(true);
        }
    }, [activeFilterCount]);

    // 5. Actions
    const clearFilters = () => {
        setFilters(DEFAULT_FILTERS);
        setSidebarOpen(false);
    };

    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return { 
        filters, 
        setFilters, 
        clearFilters, 
        sidebarOpen, 
        setSidebarOpen, 
        toggleSidebar,
        activeFilterCount 
    };
};
