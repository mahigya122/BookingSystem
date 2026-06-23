import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: "./server/.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  // 1. List auth users
  const { data: authData } = await supabase.auth.admin.listUsers();
  const authUsers = authData?.users || [];
  console.log(`Auth Users Count: ${authUsers.length}`);
  const authMap = {};
  authUsers.forEach(u => {
    authMap[u.id] = u.email;
  });

  // 2. List guests
  const { data: guests } = await supabase.from("guests").select("*");
  console.log(`Guests Table Count: ${guests?.length || 0}`);
  const guestMap = {};
  guests?.forEach(g => {
    guestMap[g.id] = g.email;
  });

  // 3. List bookings
  const { data: bookings } = await supabase.from("bookings").select("id, guest_id, created_at").order("created_at", { ascending: false }).limit(10);
  console.log("\nRecent Bookings:");
  for (const b of bookings || []) {
    const authEmail = authMap[b.guest_id] || "NOT IN AUTH";
    const guestEmail = guestMap[b.guest_id] || "NOT IN GUESTS";
    console.log(`Booking ${b.id} -> guest_id: ${b.guest_id} (Auth Email: ${authEmail}, Guests Email: ${guestEmail})`);
  }
}

check();
