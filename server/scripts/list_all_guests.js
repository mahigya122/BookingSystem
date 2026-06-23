import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: "./server/.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  const { data: guests, error } = await supabase.from("guests").select("*");
  if (error) {
    console.error(error);
  } else {
    console.log("Guests in Database:");
    console.table(guests);
  }
}

check();
