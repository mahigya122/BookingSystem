import dotenv from "dotenv";
import { createBookingReservation, deleteBookingReservation } from "../services/bookingService.js";
import { getPool } from "../services/dbPool.js";
import { faker } from "@faker-js/faker";
import { supabase } from "../lib/supabase.js";

dotenv.config({ path: "./server/.env" });

async function test() {
  const pool = getPool();
  try {
    // Get all auth users
    const { data: authData } = await supabase.auth.admin.listUsers();
    const authUsers = authData?.users || [];
    
    // Get all guest IDs
    const { rows: existingGuests } = await pool.query("SELECT id FROM guests");
    const guestIds = new Set(existingGuests.map(g => g.id));
    
    // Find an auth user that is not in the guests table
    const targetUser = authUsers.find(u => !guestIds.has(u.id));
    if (!targetUser) {
      console.log("No auth users available without a guest profile.");
      return;
    }
    
    const testGuestId = targetUser.id;
    const testEmail = targetUser.email;
    const testName = targetUser.user_metadata?.full_name || "Test Guest User";
    const testPhone = "555-0199";

    // Get a valid cabin ID from database
    const { rows: cabins } = await pool.query("SELECT id FROM cabins LIMIT 1");
    if (cabins.length === 0) {
      console.log("No cabins in database to book.");
      return;
    }
    const cabinId = cabins[0].id;

    console.log(`Creating test booking for existing auth user: ${testEmail} (ID: ${testGuestId})`);
    
    const booking = await createBookingReservation({
      guest_id: testGuestId,
      guest_full_name: testName,
      guest_email: testEmail,
      guest_phone: testPhone,
      cabin_id: cabinId,
      start_date: "2026-07-01",
      end_date: "2026-07-05",
      total_price: 500,
      has_breakfast: true,
      payment_status: "pending",
      payment_method: "arrival"
    });

    console.log("✅ Booking created successfully:", booking);

    // Verify guest record exists in database
    const { rows: guests } = await pool.query("SELECT * FROM guests WHERE id = $1", [testGuestId]);
    console.log("Guest record in DB:", guests[0]);

    // Clean up
    console.log("Cleaning up test booking...");
    await deleteBookingReservation(booking.id);
    await pool.query("DELETE FROM guests WHERE id = $1", [testGuestId]);
    console.log("✅ Cleanup successful.");

  } catch (err) {
    console.error("❌ Test failed:", err);
  } finally {
    await pool.end();
  }
}

test();
