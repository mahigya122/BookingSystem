import type { Booking } from "../types/booking";

export const isCabinBookedInRange = (
    cabinId: string,
    bookings: Booking[],
    startDate: Date,
    endDate: Date
) => {
    return bookings.some((booking) => {
        if (booking.cabin_id !== cabinId) return false;
        if (booking.status === "cancelled") return false;

        const bookingStart = new Date(booking.start_date);
        const bookingEnd = new Date(booking.end_date);

        // Real hotel booking check: check-out day of Booking A can be the check-in day of Booking B.
        return (
            startDate < bookingEnd &&
            endDate > bookingStart
        );
    });
};