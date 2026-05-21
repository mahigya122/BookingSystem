import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGuest } from "../services/apiGuests";
import toast from "react-hot-toast";

export function useDeleteGuest() {
  const queryClient = useQueryClient();

  const { mutate: removeGuest, isPending } = useMutation({
    mutationFn: deleteGuest,

    onSuccess: () => {
      toast.success("Guest deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },

    onError:(err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete guest");
    }  
  });

  return {
    removeGuest,
    isPending
  };
}