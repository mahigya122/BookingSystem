import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import fs from "fs";

dotenv.config({ path: "./server/.env" });
if (!process.env.SUPABASE_URL) {
  dotenv.config({ path: "./.env" });
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  const tables = ["locations", "offers", "cabin_offers", "activities", "cabin_activities", "reviews", "cabins", "bookings", "guests"];
  
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select("*", { count: 'exact', head: true });
    if (error) {
      console.log(`Table [${table}]: ERROR - ${error.message}`);
    } else {
      console.log(`Table [${table}]: OK (${count} rows found)`);
    }
  }
}

checkSchema();
