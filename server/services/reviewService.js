import { supabase } from "../lib/supabase.js";

export async function getAllReviews(page, pageSize, approved) {
  let query = supabase
    .from("reviews")
    .select(`
      id,
      rating,
      comment,
      is_approved,
      is_moderated,
      created_at,
      cabin_id,
      guest_id,
      guest:guests (full_name),
      cabin:cabins (name)
    `, { count: "exact" })
    .order("created_at", { ascending: false });

  if (approved === "true" || approved === true) {
    query = query.eq("is_approved", true);
  } else if (approved === "false" || approved === false) {
    query = query.eq("is_approved", false);
  }

  if (page !== undefined && pageSize !== undefined) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error(error.message || "Failed to fetch reviews from Supabase");
  }

  if (page !== undefined && pageSize !== undefined) {
    return { data, count };
  }
  return data;
}

export async function createReview(reviewData) {
  const { cabin_id, guest_id, rating, comment } = reviewData;
  const { data, error } = await supabase
    .from("reviews")
    .insert([
      { 
        cabin_id, 
        guest_id, 
        rating, 
        comment,
        is_moderated: false,
        is_approved: false
      }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to create review in Supabase");
  }
  return data;
}

export async function updateReview(id, reviewData) {
  const { data, error } = await supabase
    .from("reviews")
    .update(reviewData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to update review in Supabase");
  }
  return data;
}

export async function deleteReview(id) {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message || "Failed to delete review in Supabase");
  }
  return { success: true };
}
