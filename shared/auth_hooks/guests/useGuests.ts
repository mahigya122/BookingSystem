import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../src/services/supabase";

export function useGuests() {
  const { data: guests = [], isLoading} = useQuery({
    queryKey: ["guests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .order("created_at", {ascending: false});

      if (error) throw new Error(error.message);
      return data; 
    },
  });

  return { guests, isLoading };
}
