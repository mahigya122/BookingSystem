import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: "./server/.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProfiles() {
    const { data, error } = await supabase.from("profiles").select("*").limit(1);
    if (error) {
        console.log("Error checking profiles:", error.message);
    } else if (data && data.length > 0) {
        console.log("profiles cols:", Object.keys(data[0]));
    } else {
        console.log("profiles has no data or doesn't exist.");
    }
}

checkProfiles();
