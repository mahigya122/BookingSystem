import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: "./server/.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkCols() {
  const tables = ["cabins", "offers", "activities", "locations", "reviews", "bookings", "guests", "profiles"];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("*").limit(1);
    if (error) {
      console.log(`Table [${table}]: ERROR - ${error.message}`);
    } else if (data && data.length > 0) {
      console.log(`Table [${table}] cols:`, Object.keys(data[0]));
    } else {
      console.log(`Table [${table}] has no rows to inspect columns`);
    }
  }
}

checkCols();

