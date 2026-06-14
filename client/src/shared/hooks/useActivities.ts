import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getActivities, createActivity, updateActivity, deleteActivity } from "../services/activitiesApi";
import toast from "react-hot-toast";

export function useActivities() {
  const queryClient = useQueryClient();

  const { data: activities, isLoading, error } = useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
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

  return { activities, isLoading, error, addActivity, isCreating, editActivity, isUpdating, removeActivity, isDeleting };
}
