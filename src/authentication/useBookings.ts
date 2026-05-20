import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase";

export function useBookings() {
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          start_date,
          end_date,
          status,
          total_price,
          guests(full_name, email),
          cabins(name, price_per_night)
        `);

      if (error) throw error;
      // Normalize related rows: Supabase returns related rows as arrays.
      // Convert `guests` and `cabins` to single objects (take first related row)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (data || []).map((d: any) => ({
        ...d,
        guests: Array.isArray(d.guests) ? d.guests[0] : d.guests,
        cabins: Array.isArray(d.cabins) ? d.cabins[0] : d.cabins,
      }));
    },
  });

  return { bookings, isLoading, error };
}
