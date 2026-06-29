import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { getLocations, createLocation, updateLocation, deleteLocation } from "../services/locationsApi";
import type { Location } from "../types/location";
import toast from "react-hot-toast";

export function useLocations(
  page?: number,
  pageSize?: number,
  search = "",
  sort = "name-az"
): {
  locations: Location[];
  totalCount: number;
  isLoading: boolean;
  error: any;
  addLocation: any;
  isCreating: boolean;
  editLocation: any;
  isUpdating: boolean;
  removeLocation: any;
  isDeleting: boolean;
} {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["locations", page, pageSize, search, sort],
    queryFn: () => {
      let url = "/locations";
      if (page !== undefined && pageSize !== undefined) {
        url += `?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&sort=${sort}`;
      } else if (search) {
        url += `?search=${encodeURIComponent(search)}&sort=${sort}`;
      } else if (sort !== "name-az") {
        url += `?sort=${sort}`;
      }
      return getLocations(url);
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
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

  const rawList = (data as any)?.data ?? data;
  const locationsList = Array.isArray(rawList) ? rawList : [];
  const total = (data as any)?.count ?? locationsList.length;

  return {
    locations: locationsList as Location[],
    totalCount: total,
    isLoading,
    error,
    addLocation,
    isCreating,
    editLocation,
    isUpdating,
    removeLocation,
    isDeleting,
  };
}
