import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../src/services/supabase";
import type { Booking } from "../../../shared/types/booking";

type BookingRow = Booking & {
  guests: Booking["guests"][] | Booking["guests"];
  cabins: Booking["cabins"][] | Booking["cabins"];
};

export function useBookings() {
  const { data: bookings, isLoading, error } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          created_at,
          cabin_id,
          start_date,
          end_date,
          status,
          total_price,
          has_breakfast,
          guests(full_name, email),
          cabins(name, price_per_night)
        `);

      if (error) throw error;
      return (data || []).map((row) => {
        const bookingRow = row as BookingRow;

        return {
          ...bookingRow,
          guests: Array.isArray(bookingRow.guests)
            ? bookingRow.guests[0]
            : bookingRow.guests,
          cabins: Array.isArray(bookingRow.cabins)
            ? bookingRow.cabins[0]
            : bookingRow.cabins,
        };
      });
    },
  });

  return { bookings, isLoading, error };
}
