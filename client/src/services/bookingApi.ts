import { supabase } from "@shared/services/supabase";

export const getBookings = async () => {
    const { data, error } = await supabase
        .from("bookings")
        .select("*");

    if (error) throw error;

    return data;
};