import { supabase } from "./supabase";
import type { UserProfile } from "../types/profile";
import type { AuthRole } from "../types/auth";

type ProfileRow = UserProfile & {
  email: string;
  role: AuthRole;
};

export async function getProfile(id: string): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone_no, role, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (
    data ?? {
      id,
      email: "",
      full_name: "",
      phone_no: "",
      role: "guest",
    }
  );
}

export async function saveProfile(profile: ProfileRow) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      ...profile,
    })
    .select("id, email, full_name, phone_no, role, created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ProfileRow;
}
