import { supabase } from "../lib/supabase.js";

/**
 * Fetches the user's role from the 'profiles' table.
 * @param {string} userId - The unique ID of the user.
 * @returns {Promise<string|null>} - The user's role or null if not found.
 */
export async function getUserRole(userId) {
  if (!userId || userId === "anonymous") return "guest";

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user role:", error.message);
    return "guest";
  }

  return data?.role || "guest";
}
