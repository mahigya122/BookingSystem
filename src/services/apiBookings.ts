import { supabase } from "./supabase";

// DELETE BOOKING
export async function deleteBooking(id: string) {
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

// UPDATE BOOKING
export interface UpdateBookingData {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
}

export async function updateBooking(
  bookingData: UpdateBookingData
) {
  const { error } = await supabase
    .from("bookings")
    .update({
      start_date: bookingData.start_date,
      end_date: bookingData.end_date,
      total_price: bookingData.total_price,
      status: bookingData.status,
    })
    .eq("id", bookingData.id);

  if (error) {
    throw new Error(error.message);
  }

  return bookingData;
}