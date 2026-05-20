import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteBooking } from "../services/apiBookings";

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { mutate: removeBooking, isPending } =
    useMutation({
      mutationFn: deleteBooking,

      onSuccess: () => {
        toast.success("Booking deleted");

        queryClient.invalidateQueries({
          queryKey: ["bookings"],
        });
      },

      onError: (err: Error) => {
        toast.error(err.message);
      },
    });

  return {
    removeBooking,
    isPending,
  };
}