import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateBooking } from "../services/apiBookings";

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  const { mutate: editBooking, isPending } =
    useMutation({
      mutationFn: updateBooking,

      onSuccess: () => {
        toast.success("Booking updated");

        queryClient.invalidateQueries({
          queryKey: ["bookings"],
        });
      },

      onError: (err: Error) => {
        toast.error(err.message);
      },
    });

  return {
    editBooking,
    isPending,
  };
}