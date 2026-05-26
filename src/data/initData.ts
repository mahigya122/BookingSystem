import { supabase } from "../services/supabase";
import {
  generateGuests,
  generateCabins,
  generateBookings,
} from "./generators";

let hasSeed = false;

const TARGET_GUESTS = 100;
const TARGET_CABINS = 10;
const TARGET_BOOKINGS = 100;

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

    const guestsToAdd = Math.max(TARGET_GUESTS - (guestCount ?? 0), 0);
    const cabinsToAdd = Math.max(TARGET_CABINS - (cabinCount ?? 0), 0);
    const bookingsToAdd = Math.max(TARGET_BOOKINGS - (bookingCount ?? 0), 0);

    let guestRows: Array<{ id: string }> = [];
    let cabinRows: Array<{ id: string }> = [];

    if (guestsToAdd > 0) {
      const guests = generateGuests(guestsToAdd);
      const { data: guestData, error: gErr } = await supabase
        .from("guests")
        .insert(guests)
        .select("id");

      if (gErr) throw gErr;
      guestRows = guestData ?? [];
      console.log(`Guests seeded: ${guestsToAdd}`);
    }

    if (cabinsToAdd > 0) {
      const cabins = generateCabins(cabinsToAdd);
      const { data: cabinData, error: cErr } = await supabase
        .from("cabins")
        .insert(cabins)
        .select("id");

      if (cErr) throw cErr;
      cabinRows = cabinData ?? [];
      console.log(`Cabins seeded: ${cabinsToAdd}`);
    }

    if (bookingsToAdd > 0) {
      const { data: existingGuests, error: existingGuestErr } = await supabase
        .from("guests")
        .select("id");
      if (existingGuestErr) throw existingGuestErr;

      const { data: existingCabins, error: existingCabinErr } = await supabase
        .from("cabins")
        .select("id");
      if (existingCabinErr) throw existingCabinErr;

      const bookings = generateBookings(
        existingGuests ?? guestRows,
        existingCabins ?? cabinRows,
        bookingsToAdd
      );

      const { error: bErr } = await supabase.from("bookings").insert(bookings);

      if (bErr) throw bErr;
      console.log(`Bookings seeded: ${bookingsToAdd}`);
    }

    console.log("Data initialization complete");
  } catch (err: unknown) {
    console.error(
      "Data initialization failed:",
      err instanceof Error ? err.message : err
    );
  }
}
