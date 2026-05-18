import { supabase } from "../services/supabase";
import {
  generateGuests,
  generateCabins,
  generateBookings,
} from "./generators";

export async function seedAll() {
  console.log("🌱 Seeding...");

  // ⚠️ BETTER CLEAN METHOD (SAFE)
  await supabase.from("bookings").delete().gt("created_at", "1970-01-01");
  await supabase.from("guests").delete().gt("created_at", "1970-01-01");
  await supabase.from("cabins").delete().gt("created_at", "1970-01-01");

  // 1. INSERT GUESTS
  const guests = generateGuests();
  const { data: guestData, error: gErr } = await supabase
    .from("guests")
    .insert(guests)
    .select();

  if (gErr) throw gErr;

  // 2. INSERT CABINS
  const cabins = generateCabins();
  const { data: cabinData, error: cErr } = await supabase
    .from("cabins")
    .insert(cabins)
    .select();

  if (cErr) throw cErr;

  // 3. INSERT BOOKINGS
  const bookings = generateBookings(guestData!, cabinData!);
  const { error: bErr } = await supabase.from("bookings").insert(bookings);

  if (bErr) throw bErr;

  console.log("✅ DONE SEEDING");
}