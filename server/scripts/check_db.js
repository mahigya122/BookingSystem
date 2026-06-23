import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: "./server/.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  const tables = ["locations", "offers", "cabin_offers", "activities", "cabin_activities", "reviews", "cabins", "bookings", "guests"];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("*").limit(1);
    if (error) {
      console.log(`Table [${table}]: ERROR - ${error.message}`);
    } else {
      console.log(`Table [${table}]: OK (${data.length} rows found)`);
    }
  }
}

checkSchema();
