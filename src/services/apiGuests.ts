import { supabase } from "./supabase";

export interface GuestData {
  full_name: string;
  email: string;
  phone: string;
}

// CREATE
export async function createGuest(data: GuestData) {
  const { error, data: createdGuest } = await supabase
    .from("guests")
    .insert([data])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return createdGuest;
}

// UPDATE
export async function updateGuest(data: { id: string } & GuestData) {
  const { error, data: updatedGuest } = await supabase
    .from("guests")
    .update({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
    })
    .eq("id", data.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return updatedGuest;
}

// DELETE
export async function deleteGuest(id: string) {
  const { error } = await supabase.from("guests").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

