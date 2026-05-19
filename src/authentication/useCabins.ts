import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase";

export function useCabins() {
  const { data: cabins, isLoading, error } = useQuery({
    queryKey: ["cabins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cabins")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  return { cabins, isLoading, error };
}
