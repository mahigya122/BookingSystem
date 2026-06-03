import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../services/bookingApi";

export const useBookingsData = () => {
    const { data = [], isLoading } = useQuery({
        queryKey: ["bookings"],
        queryFn: getBookings,
    });

    return {
        bookings: data,
        isLoading,
    };
};