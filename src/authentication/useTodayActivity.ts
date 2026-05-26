import { useMemo } from "react";
import type { Booking } from "../types/booking";
import { toLocalDateMs } from "../utils/dates";
interface Props {
  bookings: Booking[];
  startMs: number;
  endMs: number;
}

export function useTodayActivity({
  bookings,
  startMs,
  endMs,
}: Props) {
  const arrivals = useMemo(() => {
    return bookings.filter((booking) => {
      const start = toLocalDateMs(booking.start_date);

      return (
        start >= startMs &&
        start <= endMs
      );
    }).length;
  }, [bookings, startMs, endMs]);

  const departures = useMemo(() => {
    return bookings.filter((booking) => {
      const end = toLocalDateMs(booking.end_date);

      return (
        end >= startMs &&
        end <= endMs
      );
    }).length;
  }, [bookings, startMs, endMs]);

  const checkIns = useMemo(() => {
    return bookings.filter((booking) => {
      const start = toLocalDateMs(booking.start_date);
      const end = toLocalDateMs(booking.end_date);

      return (
        booking.status === "checked-in" &&
        start <= endMs &&
        end >= startMs
      );
    }).length;
  }, [bookings, startMs, endMs]);

  return {
    arrivals,
    departures,
    checkIns,
  };
}