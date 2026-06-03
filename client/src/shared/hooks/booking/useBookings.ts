import { useQuery } from "@tanstack/react-query";
import type { Booking } from "../../types/booking";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export function useBookings() {
  const { data: bookings, isLoading, error } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/bookings`);
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Failed to load bookings");
      }

      return payload;
    },
  });

  return { bookings, isLoading, error };
}
