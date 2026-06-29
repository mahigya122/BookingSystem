import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { getActivities, createActivity, updateActivity, deleteActivity } from "../services/activitiesApi";
import type { Activity } from "../types/activity";
import toast from "react-hot-toast";

export function useActivities(
  page?: number,
  pageSize?: number,
  search = ""
): {
  activities: Activity[];
  totalCount: number;
  isLoading: boolean;
  error: any;
  addActivity: any;
  isCreating: boolean;
  editActivity: any;
  isUpdating: boolean;
  removeActivity: any;
  isDeleting: boolean;
} {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["activities", page, pageSize, search],
    queryFn: () => {
      let url = "/activities";
      if (page !== undefined && pageSize !== undefined) {
        url += `?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`;
      } else if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }
      return getActivities(url);
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const { mutate: addActivity, isPending: isCreating } = useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      toast.success("Activity created successfully");
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const { mutate: editActivity, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateActivity(id, data),
    onSuccess: () => {
      toast.success("Activity updated successfully");
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const { mutate: removeActivity, isPending: isDeleting } = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      toast.success("Activity deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const rawList = (data as any)?.data ?? data;
  const activitiesList = Array.isArray(rawList) ? rawList : [];
  const total = (data as any)?.count ?? activitiesList.length;

  return {
    activities: activitiesList as Activity[],
    totalCount: total,
    isLoading,
    error,
    addActivity,
    isCreating,
    editActivity,
    isUpdating,
    removeActivity,
    isDeleting,
  };
}
