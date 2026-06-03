import { useMemo } from "react";

import type { Booking } from "@shared/types/booking";
import { toLocalDateMs } from "@shared/utils/dates";

interface Props {
  bookings: Booking[];
  startMs: number;
  endMs: number;
}

export function useDashboardStats({ 
    bookings, 
    startMs, 
    endMs 
}: Props) {
    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const bookingStart = toLocalDateMs(booking.start_date);
            const bookingEnd = toLocalDateMs(booking.end_date);

            return bookingStart <= endMs && bookingEnd >= startMs;
        });
    }, [bookings, startMs, endMs]);

    const totalBookings = filteredBookings.length;

    const totalSales = filteredBookings.reduce(
        (sum, booking) => sum + booking.total_price,
        0
    );

    const checkedIn = filteredBookings.filter(
        (booking) => booking.status === "checked-in"
    ).length;

    const occupancyRate =
        totalBookings > 0 ? Math.round((checkedIn / totalBookings) * 100) : 0;

    return {
        filteredBookings,
        totalBookings,
        totalSales,
        checkedIn,
        occupancyRate,
    };
}
