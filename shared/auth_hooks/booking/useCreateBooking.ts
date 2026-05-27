import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../src/services/supabase";

interface CreateBookingData {
  guest_full_name: string;
  guest_email: string;
  guest_phone: string;
  cabin_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  has_breakfast: boolean;
}

type BookingOverlapRow = {
  start_date: string;
  end_date: string;
  status: string;
};

const isOverlappingBooking = (
  existingStart: string,
  existingEnd: string,
  requestedStart: string,
  requestedEnd: string
) => {
  return existingStart < requestedEnd && existingEnd > requestedStart;
};

export function useCreateBooking() {
  const queryClient = useQueryClient();

  const { mutate: createBooking, isPending } = useMutation({
    mutationFn: async (bookingData: CreateBookingData) => {
      if (bookingData.start_date >= bookingData.end_date) {
        throw new Error("End date must be after the start date.");
      }

      // 0. Prevent double booking for the same cabin/date range.
      const { data: existingBookings, error: overlapError } = await supabase
        .from("bookings")
        .select("start_date, end_date, status")
        .eq("cabin_id", bookingData.cabin_id)
        .in("status", ["booked", "checked-in"])
        .lte("start_date", bookingData.end_date)
        .gte("end_date", bookingData.start_date);

      if (overlapError) {
        throw new Error(overlapError.message);
      }

      const hasOverlap = (existingBookings as BookingOverlapRow[] | null | undefined)?.some(
        (booking) =>
          isOverlappingBooking(
            booking.start_date,
            booking.end_date,
            bookingData.start_date,
            bookingData.end_date
          )
      );

      if (hasOverlap) {
        throw new Error("This cabin is already booked for one or more of the selected dates. Please choose another cabin or change the dates.");
      }

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
            has_breakfast: bookingData.has_breakfast,
          },
        ]);

      if (bookingError) {
        throw new Error(bookingError.message);
      }
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
      ]);
    },
  });

  return {
    createBooking,
    isPending,
  };
}