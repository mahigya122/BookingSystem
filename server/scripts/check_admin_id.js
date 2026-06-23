import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: "./server/.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  const { data } = await supabase.auth.admin.listUsers();
  const authUsers = data?.users || [];
  
  console.log("All Auth User Emails:", authUsers.map(u => u.email));

  const adminUser = authUsers.find(u => u.email.toLowerCase() === "admin@g.com");
  console.log("Auth User 'admin@g.com':", adminUser ? { id: adminUser.id, email: adminUser.email } : "Not found in auth.users");

  const userUser = authUsers.find(u => u.email.toLowerCase() === "user@g.com");
  console.log("Auth User 'user@g.com':", userUser ? { id: userUser.id, email: userUser.email } : "Not found in auth.users");


  const { data: guests } = await supabase.from("guests").select("id, email, full_name").eq("email", "admin@g.com");
  console.log("Guests with email 'admin@g.com':", guests);
}

check();
