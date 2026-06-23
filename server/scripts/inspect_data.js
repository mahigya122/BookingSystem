import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: "./server/.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspect() {
  const { data: b } = await supabase.from("bookings").select("*").limit(1);
  const { data: r } = await supabase.from("reviews").select("*").limit(1);
  const { data: g } = await supabase.from("guests").select("*").limit(1);
  
  console.log("Booking:", b);
  console.log("Review:", r);
  console.log("Guest:", g);
}

inspect();
