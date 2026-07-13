import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: "./server/.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function changeAdminPassword() {
  const adminEmail = "admin@g.com";
  const newPassword = "123456";
  const knownAdminId = "50ff6f1e-c902-4554-85ee-ea4eb9fd936c";

  console.log(`Checking admin user by ID: ${knownAdminId}...`);
  let adminUser = null;
  
  const { data: userById, error: errorById } = await supabase.auth.admin.getUserById(knownAdminId);
  if (!errorById && userById?.user) {
    adminUser = userById.user;
    console.log(`Found admin user by ID: ${adminUser.email}`);
  } else {
    console.log("Could not find admin user by ID, checking all users...");
    // Retrieve users page by page
    let page = 1;
    const perPage = 50;
    let hasMore = true;
    
    while (hasMore) {
      const { data, error } = await supabase.auth.admin.listUsers({
        page,
        perPage
      });
      
      if (error) {
        console.error("Error listing users:", error.message);
        break;
      }
      
      const found = data.users.find(u => u.email.toLowerCase() === adminEmail.toLowerCase());
      if (found) {
        adminUser = found;
        break;
      }
      
      if (data.users.length < perPage) {
        hasMore = false;
      } else {
        page++;
      }
    }
  }

  if (!adminUser) {
    console.error(`Admin user ${adminEmail} not found in Supabase Auth.`);
    process.exit(1);
  }

  console.log(`Updating password for user ${adminUser.email} (ID: ${adminUser.id})...`);

  const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
    adminUser.id,
    { password: newPassword }
  );

  if (updateError) {
    console.error("Error updating password:", updateError.message);
    process.exit(1);
  }

  console.log(`Successfully changed password for ${adminUser.email} to ${newPassword}!`);
  console.log("Updated user details:", {
    id: updatedUser.user.id,
    email: updatedUser.user.email,
    updated_at: updatedUser.user.updated_at
  });
}

changeAdminPassword();
