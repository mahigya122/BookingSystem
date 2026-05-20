import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase";
import type { Cabin } from "../types/cabin";

export function useCabins() {
  const { data: cabins, isLoading } = useQuery({
    queryKey: ["cabins"],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("cabins")
        .select("*");

      if (error){
        throw new Error(error.message);
      }
      
      return data as Cabin[];
    },
  });

  return { cabins, isLoading};
}
