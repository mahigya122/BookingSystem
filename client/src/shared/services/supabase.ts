import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const isAdminApp = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(isAdminApp ? { storageKey: "sb-admin-auth-token" } : {}),
    persistSession: true,
    detectSessionInUrl: true,
  },
});