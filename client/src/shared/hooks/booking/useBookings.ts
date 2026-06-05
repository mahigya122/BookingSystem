import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "../../services/supabase";
import type { Booking } from "../../types/booking";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export function useBookings() {
  const queryClient = useQueryClient();
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

  useEffect(() => {
    const channel = supabase
      .channel("bookings-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
          queryClient.invalidateQueries({ queryKey: ["cabin-availability"] });
          queryClient.invalidateQueries({ queryKey: ["cabins-with-bookings"] });
          queryClient.invalidateQueries({ queryKey: ["guests"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { bookings, isLoading, error };
}
