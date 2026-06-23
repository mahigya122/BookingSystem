import dotenv from "dotenv";
import { supabase } from "../lib/supabase.js";

dotenv.config();

async function check() {
  const search = "yahoo.com";
  
  let query = supabase
    .from("bookings")
    .select(`
      id,
      guests!inner (full_name, email)
    `);
    
  query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`, { referencedTable: "guests" });
  const { data, error } = await query;
  console.log("Error:", error);
  console.log(`Results for ${search} using referencedTable or:`, data?.length);
}

check();
