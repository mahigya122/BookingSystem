import { useQuery } from "@tanstack/react-query";
import { getCabinAvailability } from "@shared/services/cabinAvailabilityApi";

export function useCabinAvailability(cabinId?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["cabin-availability", cabinId],
    queryFn: async () => {
      if (!cabinId) {
        throw new Error("Cabin id is required");
      }

      return getCabinAvailability(cabinId);
    },
    enabled: Boolean(cabinId),
  });

  return {
    availability: data,
    isLoading,
    error,
  };
}