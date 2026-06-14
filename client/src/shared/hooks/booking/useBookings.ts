import { useQuery } from "@tanstack/react-query";
import type { Booking } from "../../types/booking";
import { fetchJson } from "../../services/http";

export function useBookings() {
  const { data: bookings, isLoading, error } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: () => fetchJson<Booking[]>("/bookings"),
  });

  return { bookings: bookings || [], isLoading, error };
}
