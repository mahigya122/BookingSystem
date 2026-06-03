import { useState, useEffect } from "react";

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
    const [filters, setFilters] = useState<CabinFilters>(() => {
        const saved = localStorage.getItem("cabin-filters");
        return saved ? JSON.parse(saved) : DEFAULT_FILTERS;
    });

    useEffect(() => {
        localStorage.setItem("cabin-filters", JSON.stringify(filters));
    }, [filters]);

    const clearFilters = () => {
        setFilters(DEFAULT_FILTERS);
    };

    return { filters, setFilters, clearFilters };
};