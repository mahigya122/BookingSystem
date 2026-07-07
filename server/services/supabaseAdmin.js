import { createClient } from "@supabase/supabase-js";

// SERVICE ROLE KEY — server-side only. Never expose this to the client bundle.
// Bypasses RLS entirely, so every use of this client must be behind admin auth.
export const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);