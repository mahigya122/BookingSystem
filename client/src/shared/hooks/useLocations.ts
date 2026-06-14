import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLocations, createLocation, updateLocation, deleteLocation } from "../services/locationsApi";
import toast from "react-hot-toast";

export function useLocations() {
  const queryClient = useQueryClient();

  const { data: locations, isLoading, error } = useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,
  });

  const { mutate: addLocation, isPending: isCreating } = useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      toast.success("Location created successfully");
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const { mutate: editLocation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateLocation(id, data),
    onSuccess: () => {
      toast.success("Location updated successfully");
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const { mutate: removeLocation, isPending: isDeleting } = useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      toast.success("Location deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { locations, isLoading, error, addLocation, isCreating, editLocation, isUpdating, removeLocation, isDeleting };
}
