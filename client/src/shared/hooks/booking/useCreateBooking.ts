import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking as createBookingRequest } from "../../services/apiBookings";

interface CreateBookingData {
  guest_id?: string;
  guest_full_name?: string;
  guest_email?: string;
  guest_phone?: string;
  cabin_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  has_breakfast: boolean;
  payment_status?: string;
  payment_method?: string;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  const { mutate: createBooking, isPending } = useMutation({
    mutationFn: async (bookingData: CreateBookingData) => {
      if (bookingData.start_date >= bookingData.end_date) {
        throw new Error("End date must be after the start date.");
      }

      return createBookingRequest(bookingData);
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["bookings"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["guests"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["cabin-availability"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["cabins-with-bookings"],
          refetchType: "all",
        }),
      ]);
    },
  });

  return {
    createBooking,
    isPending,
  };
}