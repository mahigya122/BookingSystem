import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGuest } from "../services/apiGuests";
import toast from "react-hot-toast";
import type { GuestData } from "../services/apiGuests";

export function useCreateGuest() {
  const queryClient = useQueryClient();

  const { mutate: addGuest, isPending } = useMutation({
    mutationFn: (guest: GuestData) => createGuest(guest),

    onSuccess: () => {
      toast.success("Guest created successfully!");
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },

    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to create guest");
    }
  });

  return {
    addGuest,
    isPending,
  };
}