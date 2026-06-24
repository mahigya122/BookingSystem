import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { Booking } from "../../types/booking";
import { fetchJson } from "../../services/http";

export function useBookings(
  page?: number,
  pageSize?: number,
  filter = "all",
  sort = "recent",
  search = "",
  paymentStatus = "all",
  guestEmail = ""
): {
  bookings: Booking[];
  totalCount: number;
  isLoading: boolean;
  error: any;
} {
  const {
    data,
    isLoading,
    error,
  } = useQuery<any>({
    queryKey: [
      "bookings",
      page,
      pageSize,
      filter,
      sort,
      search,
      paymentStatus,
      guestEmail,
    ],

    queryFn: () => {
      let url = `/bookings?filter=${filter}&sort=${sort}&search=${encodeURIComponent(search)}&paymentStatus=${paymentStatus}`;
      if (guestEmail) {
        url += `&guestEmail=${encodeURIComponent(guestEmail)}`;
      }
      if (page !== undefined && pageSize !== undefined) {
        url += `&page=${page}&pageSize=${pageSize}`;
      }
      return fetchJson<any>(url);
    },
    staleTime: 60 * 1000, // Keep data fresh for 1 minute (overrides global default)
    placeholderData: keepPreviousData,
  });

  const bookingsList = (data as any)?.data ?? (data as any) ?? [];
  const total = (data as any)?.count ?? bookingsList.length;

  return {
    bookings: bookingsList as Booking[],
    totalCount: total,
    isLoading,
    error,
  };
}