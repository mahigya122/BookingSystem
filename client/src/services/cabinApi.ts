import { supabase } from "@shared/services/supabase";
import type { Cabin } from "@shared/types/cabin";

export const getCabins = async (): Promise<Cabin[]> => {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};

// Add other cabin-related DB calls here if needed for client
