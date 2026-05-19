import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../services/apiBookings";

export function useUpdateBooking() {
    const queryClient = useQueryClient();

    const { mutate: editBooking, isPending } = useMutation({
    mutationFn: updateBooking,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
  });

  return {
    editBooking,
    isPending,
  };
}
