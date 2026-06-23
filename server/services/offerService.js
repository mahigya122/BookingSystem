import { supabase } from "../lib/supabase.js";

export async function getAllOffers(page, pageSize, search = "") {
  let query = supabase
    .from("offers")
    .select("id, title, description, badge, discount_percent, spend_threshold, image_url, is_featured", { count: "exact" })
    .order("title", { ascending: true });

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`title.ilike.${term},description.ilike.${term}`);
  }

  if (page !== undefined && pageSize !== undefined) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error(error.message || "Failed to fetch offers from Supabase");
  }

  if (page !== undefined && pageSize !== undefined) {
    return { data, count };
  }
  return data;
}

export async function createOffer(offerData) {
  const { data, error } = await supabase
    .from("offers")
    .insert([offerData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to create offer in Supabase");
  }
  return data;
}

export async function updateOffer(id, offerData) {
  const { data, error } = await supabase
    .from("offers")
    .update(offerData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to update offer in Supabase");
  }
  return data;
}

export async function deleteOffer(id) {
  const { error } = await supabase
    .from("offers")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message || "Failed to delete offer in Supabase");
  }
  return { success: true };
}
