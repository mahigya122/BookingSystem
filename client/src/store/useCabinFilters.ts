import { useState } from "react";

export type CabinFilters = {
    price: [number, number];
    capacity: number | null;
    dateRange: {
        startDate: Date | null;
        endDate: Date | null;
    };
    bookingStatus: "all" | "upcoming" | "completed" | "cancelled";
};

export const useCabinFilters = () => {
    const [filters, setFilters] = useState<CabinFilters>({
        price: [80, 250],
        capacity: null,
        dateRange: {
            startDate: null,
            endDate: null,
        },
        bookingStatus: "all",
    });

    const clearFilters = () => {
        setFilters({
            price: [80, 250],
            capacity: null,
            dateRange: {
                startDate: null,
                endDate: null,
            },
            bookingStatus: "all",
        });
    };

    return { filters, setFilters, clearFilters };
};