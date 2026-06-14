import type { Booking } from "../types/booking";

/**
 * Calculates the "source of truth" status for a booking based on the current date.
 * Rules:
 * - Cancelled stays cancelled.
 * - Upcoming: today < start_date
 * - Checked-in (Active): today >= start_date AND today < end_date
 * - Completed: today >= end_date
 */
export const getBookingRealStatus = (booking: { start_date: string; end_date: string; status: string }) => {
    if (booking.status === "cancelled") return "cancelled";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parse YYYY-MM-DD correctly without timezone shifts
    const [sYear, sMonth, sDay] = booking.start_date.split("-").map(Number);
    const start = new Date(sYear, sMonth - 1, sDay);
    
    const [eYear, eMonth, eDay] = booking.end_date.split("-").map(Number);
    const end = new Date(eYear, eMonth - 1, eDay);

    if (today < start) return "booked";
    if (today >= start && today < end) return "checked-in";
    return "checked-out";
};

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