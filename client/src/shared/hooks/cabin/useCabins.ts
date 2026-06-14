import { useQuery } from "@tanstack/react-query";
import type { Cabin } from "../../types/cabin";
import { fetchJson } from "../../services/http";

export function useCabins() {
  const { data: cabins, isLoading, error } = useQuery({
    queryKey: ["cabins"],
    queryFn: () => fetchJson<Cabin[]>("/cabins"),
  });

  return { cabins: cabins || [], isLoading, error };
}
