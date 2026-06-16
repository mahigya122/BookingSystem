import { useQuery } from "@tanstack/react-query";
import { getCabinsWithBookings } from "../../../shared/services/cabinWithBookings";
import type { CabinWithBookings } from "../../../shared/services/cabinWithBookings";

export const useCabinsData = () => {
  const { data: cabins, isLoading, error } = useQuery<CabinWithBookings[]>({
    queryKey: ["cabins-with-bookings"],
    queryFn: getCabinsWithBookings,
  });

  return { cabins, isLoading, error };
};