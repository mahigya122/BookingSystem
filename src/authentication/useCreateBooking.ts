import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../services/supabase";

interface CreateBookingData {
  guest_full_name: string;
  guest_email: string;
  guest_phone: string;
  cabin_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  const { mutate: createBooking, isPending } = useMutation({
    mutationFn: async (bookingData: CreateBookingData) => {
      // 1. Check if guest already exists
      const { data: existingGuest, error: guestFetchError } = await supabase
        .from("guests")
        .select("*")
        .eq("email", bookingData.guest_email)
        .single();

      // Ignore "no rows found" error
      if (
        guestFetchError &&
        guestFetchError.code !== "PGRST116"
      ) {
        throw new Error(guestFetchError.message);
      }

      let guestId: string;

      // 2. If guest exists → use existing id
      if (existingGuest) {
        guestId = existingGuest.id;
      }

      // 3. Otherwise create new guest
      else {
        const { data: newGuest, error: newGuestError } = await supabase
          .from("guests")
          .insert([
            {
              full_name: bookingData.guest_full_name,
              email: bookingData.guest_email,
              phone: bookingData.guest_phone,
            },
          ])
          .select()
          .single();

        if (newGuestError) {
          throw new Error(newGuestError.message);
        }

        guestId = newGuest.id;
      }

      // 4. Create booking
      const { error: bookingError } = await supabase
        .from("bookings")
        .insert([
          {
            guest_id: guestId,
            cabin_id: bookingData.cabin_id,
            start_date: bookingData.start_date,
            end_date: bookingData.end_date,
            total_price: bookingData.total_price,
            status: "booked",
          },
        ]);

      if (bookingError) {
        throw new Error(bookingError.message);
      }
    },

    onSuccess: () => {
      // Refresh bookings automatically
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
  });

  return {
    createBooking,
    isPending,
  };
}