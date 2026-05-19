import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase";

export function useGuests() {
  const { data: guests, isLoading, error } = useQuery({
    queryKey: ["guests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guests")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  return { guests, isLoading, error };
}
