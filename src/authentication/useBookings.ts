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
      return data;
    },
  });

  return { bookings, isLoading, error };
}
