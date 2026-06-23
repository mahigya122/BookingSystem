import { supabase } from "../lib/supabase.js";

export async function getAllActivities(page, pageSize, search = "") {
  let query = supabase
    .from("activities")
    .select("id, name, image_url, description", { count: "exact" })
    .order("name", { ascending: true });

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`name.ilike.${term},description.ilike.${term}`);
  }

  if (page !== undefined && pageSize !== undefined) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error(error.message || "Failed to fetch activities from Supabase");
  }

  if (page !== undefined && pageSize !== undefined) {
    return { data, count };
  }
  return data;
}

export async function createActivity(activityData) {
  const { data, error } = await supabase
    .from("activities")
    .insert([activityData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to create activity in Supabase");
  }
  return data;
}

export async function updateActivity(id, activityData) {
  const { data, error } = await supabase
    .from("activities")
    .update(activityData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to update activity in Supabase");
  }
  return data;
}

export async function deleteActivity(id) {
  const { error } = await supabase
    .from("activities")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message || "Failed to delete activity in Supabase");
  }
  return { success: true };
}
