import { supabase } from "./supabase";
import type { UserProfile } from "../types/profile";
import type { AuthRole } from "../types/auth";

export type ProfileRow = UserProfile & {
  email: string;
  role: AuthRole;
};

export async function getProfile(id: string): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone_no, role, avatar_url, created_at")
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
      avatar_url: undefined,
    }
  );
}

export async function saveProfile(profile: ProfileRow) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      ...profile,
    })
    .select("id, email, full_name, phone_no, role, avatar_url, created_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ProfileRow;
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return data.publicUrl;
}
