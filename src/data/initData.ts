import { supabase } from "../services/supabase";
import {
  generateGuests,
  generateCabins,
  generateBookings,
} from "./generators";

let hasSeed = false;

export async function initializeData() {
  // Prevent multiple seed attempts
  if (hasSeed) return;
  hasSeed = true;

  try {
    console.log("🌱 Initializing data...");

    // Always refresh cabins with new images
    await supabase.from("cabins").delete().gte("id", 0);

    // Check if guests and bookings already exist
    const { count: guestCount } = await supabase
      .from("guests")
      .select("id", { count: "exact", head: true });

    const { count: bookingCount } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true });

    // If guests and bookings exist, only refresh cabins
    if (guestCount && guestCount > 0 && bookingCount && bookingCount > 0) {
      console.log("Refreshing cabins with new images...");
      const cabins = generateCabins();
      const { error: cErr } = await supabase.from("cabins").insert(cabins);
      if (cErr) throw cErr;
      console.log("Cabins refreshed");
      return;
    }

    // Otherwise, seed everything from scratch
    // Clean tables if partially empty
    await supabase.from("bookings").delete().gte("created_at", "1970-01-01");
    await supabase.from("guests").delete().gte("created_at", "1970-01-01");

    // 1. INSERT GUESTS
    const guests = generateGuests();
    const { data: guestData, error: gErr } = await supabase
      .from("guests")
      .insert(guests)
      .select();

    if (gErr) throw gErr;
    console.log("Guests seeded");

    // 2. INSERT CABINS
    const cabins = generateCabins();
    const { data: cabinData, error: cErr } = await supabase
      .from("cabins")
      .insert(cabins)
      .select();

    if (cErr) throw cErr;
    console.log("Cabins seeded");

    // 3. INSERT BOOKINGS
    const bookings = generateBookings(guestData!, cabinData!);
    const { error: bErr } = await supabase.from("bookings").insert(bookings);

    if (bErr) throw bErr;
    console.log("Bookings seeded");
    console.log("Data initialization complete");
  } catch (err: any) {
    console.error("Data initialization failed:", err.message);
  }
}
