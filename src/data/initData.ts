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

    // Only refresh or seed cabins when needed

    // Check table state first
    const { count: guestCount, error: guestCountErr } = await supabase
      .from("guests")
      .select("id", { count: "exact", head: true });

    const { count: bookingCount, error: bookingCountErr } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true });

    const { count: cabinCount, error: cabinCountErr } = await supabase
      .from("cabins")
      .select("id", { count: "exact", head: true });

    if (guestCountErr) throw guestCountErr;
    if (bookingCountErr) throw bookingCountErr;
    if (cabinCountErr) throw cabinCountErr;

    // All seeded already: do nothing on refresh
    if (guestCount && guestCount > 0 && bookingCount && bookingCount > 0 && cabinCount && cabinCount > 0) {
      console.log("Data already initialized. Skipping seed.");
      return;
    }

    // If only cabins are missing, seed just cabins
    if (guestCount && guestCount > 0 && bookingCount && bookingCount > 0 && (!cabinCount || cabinCount === 0)) {
      console.log("Guests and bookings exist; seeding missing cabins...");
      const cabins = generateCabins();
      const { error: cErr } = await supabase.from("cabins").insert(cabins);
      if (cErr) throw cErr;
      console.log("Cabins seeded");
      return;
    }

    // Otherwise, seed everything from scratch
    // Clean tables if partially empty
    const { error: deleteBookingsErr } = await supabase
      .from("bookings")
      .delete()
      .not("id", "is", null);
    if (deleteBookingsErr) throw deleteBookingsErr;

    const { error: deleteGuestsErr } = await supabase
      .from("guests")
      .delete()
      .not("id", "is", null);
    if (deleteGuestsErr) throw deleteGuestsErr;

    // 1. INSERT GUESTS
    const guests = generateGuests();
    const { data: guestData, error: gErr } = await supabase
      .from("guests")
      .insert(guests)
      .select();

    if (gErr) throw gErr;
    console.log("Guests seeded");

    // 2. INSERT CABINS
    // Ensure cabins table is clean before seeding
    const { error: deleteCabinsErr } = await supabase
      .from("cabins")
      .delete()
      .not("id", "is", null);
    if (deleteCabinsErr) throw deleteCabinsErr;
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
  } catch (err: unknown) {
    console.error(
      "Data initialization failed:",
      err instanceof Error ? err.message : err
    );
  }
}
