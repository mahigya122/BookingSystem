import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGuest } from "../../services/apiGuests";
import toast from "react-hot-toast";
import type { GuestData } from "../../services/apiGuests";

type UpdateGuestInput = {
  id: string;
  guest: GuestData;
};

export function useUpdateGuest() {
  const queryClient = useQueryClient();

  const { mutate: updateGuestMutation, isPending } = useMutation<void, Error, UpdateGuestInput>({
    mutationFn: ({ id, guest }: UpdateGuestInput) => updateGuest({ id, ...guest }),

    onSuccess: () => {
      toast.success("Guest updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },

    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to update guest");
    }
  });

  return {
    updateGuest: updateGuestMutation,
    isPending
  };
}