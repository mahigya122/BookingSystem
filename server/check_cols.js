import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: "./server/.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkCols() {
  const { data, error } = await supabase.from("cabins").select("*").limit(1);
  if (data && data.length > 0) {
    console.log("Cabin cols:", Object.keys(data[0]));
  }
}

checkCols();
