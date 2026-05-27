import { useMemo } from "react";
import type { Booking } from "../../../shared/types/booking";
import { toLocalDateMs } from "../../utils/dates";

export function useStayDuration(bookings: Booking[]) {
    return useMemo(() => {
        const durations = {
            "2 Nights": 0,
            "3 Nights": 0,
            "4-5 Nights": 0,
            "8-14 Nights": 0,
        };

        bookings.forEach((booking) => {
            const nights = Math.ceil(
                (toLocalDateMs(booking.end_date) -
                    toLocalDateMs(booking.start_date)) /
                    (1000 * 60 * 60 * 24)
            );

            if (nights === 2) {
                durations["2 Nights"] += 1;
            } else if (nights === 3) {
                durations["3 Nights"] += 1;
            } else if (nights >= 4 && nights <= 5) {
                durations["4-5 Nights"] += 1;
            } else if (nights >= 8 && nights <= 14) {
                durations["8-14 Nights"] += 1;
            }
        });

        return Object.entries(durations).map(([name, value]) => ({
            name,
            value,
        }));
    }, [bookings]);
}