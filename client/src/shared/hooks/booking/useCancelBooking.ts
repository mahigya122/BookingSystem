import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cancelBooking } from "../../services/apiBookings";

export function useCancelBooking() {
  const queryClient = useQueryClient();

  const { mutate: cancel, isPending: isCancelling } = useMutation({
    mutationFn: (id: string) => cancelBooking(id),

    onSuccess: () => {
      toast.success("Booking successfully cancelled");

      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["cabin-availability"],
      });
      queryClient.invalidateQueries({
        queryKey: ["cabins-with-bookings"],
      });
    },

    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return {
    cancel,
    isCancelling,
  };
}
