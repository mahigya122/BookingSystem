import { supabase } from "./supabase";

export async function getSettings() {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export interface UpdateSettingData {
  min_booking_length: number;
  max_booking_length: number;
  max_guests_per_booking: number;
  breakfast_price: number;
}

export async function updateSettings(setting: UpdateSettingData) {
  const { data: currentSetting, error: fetchError } =
    await supabase
    .from("settings")
    .select("*")
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const { error } = await supabase
    .from("settings")
    .update({
      ...setting,
      updated_at: new Date().toISOString(),
    })
    .eq("id", currentSetting?.id);

  if (error) {
    throw new Error(error.message);
  }

  return setting;
}


