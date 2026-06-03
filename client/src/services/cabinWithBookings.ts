import { supabase } from "@shared/services/supabase";
import type { Cabin } from "@shared/types/cabin";
import type { Booking } from "@shared/types/booking";

export type CabinWithBookings = Cabin & {
    bookings: Booking[];
};

export const getCabinsWithBookings = async (): Promise<CabinWithBookings[]> => {
    const { data, error } = await supabase
        .from("cabins")
        .select(`
      *,
      bookings (*)
    `);

    if (error) throw new Error("Failed to load cabins with bookings");

    return data as CabinWithBookings[];
};