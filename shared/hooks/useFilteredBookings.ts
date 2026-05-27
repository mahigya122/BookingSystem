import { useMemo } from "react";
import type { Booking, BookingStatus, SortType } from "../../shared/types/booking";

interface Props {
  bookings: Booking[];
  filter: BookingStatus;
  sort: SortType;
  search: string;
}

export function useFilteredBookings({
  bookings,
  filter,
  sort,
  search,
}: Props) {
  return useMemo(() => {
    let result = [...bookings];

    // FILTER
    if (filter !== "all") {
      result = result.filter((b) => b.status === filter);
    }

    // SEARCH
    if (search.trim()) {
      result = result.filter((b) =>
        b.guests?.full_name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // SORT
    result.sort((a, b) => {
      switch (sort) {
        case "recent":
          return (
            new Date(
              (b as { created_at?: string }).created_at ?? b.start_date
            ).getTime() -
            new Date(
              (a as { created_at?: string }).created_at ?? a.start_date
            ).getTime()
          );

        case "earlier":
          return (
            new Date(a.start_date).getTime() -
            new Date(b.start_date).getTime()
          );

        case "price-high":
          return b.total_price - a.total_price;

        case "price-low":
          return a.total_price - b.total_price;

        default:
          return 0;
      }
    });

    return result;
  }, [bookings, filter, sort, search]);
}