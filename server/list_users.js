import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: "./server/.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listUsers() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.log("Auth Error:", error.message);
  } else {
    console.log("Users count:", data.users.length);
    console.log("Sample User IDs:", data.users.slice(0, 5).map(u => u.id));
  }
}

listUsers();
