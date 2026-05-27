import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGuest } from "../../../src/services/apiGuests";
import toast from "react-hot-toast";

export function useDeleteGuest() {
  const queryClient = useQueryClient();

  const { mutate: removeGuest, isPending } = useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteGuest(id),

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