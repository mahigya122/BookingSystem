import { supabase } from "../lib/supabase.js";

export async function getAllLocations(page, pageSize, search = "", sort = "name-az") {
  let query = supabase
    .from("locations")
    .select("id, name, city, country, description, image_url", { count: "exact" });

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`name.ilike.${term},city.ilike.${term},country.ilike.${term}`);
  }

  // Sorting logic
  if (sort === "name-za") {
    query = query.order("name", { ascending: false });
  } else if (sort === "recent") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("name", { ascending: true });
  }

  if (page !== undefined && pageSize !== undefined) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error(error.message || "Failed to fetch locations from Supabase");
  }

  if (page !== undefined && pageSize !== undefined) {
    return { data, count };
  }
  return data;
}

export async function createLocation(locationData) {
  const { data, error } = await supabase
    .from("locations")
    .insert([locationData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to create location in Supabase");
  }
  return data;
}

export async function updateLocation(id, locationData) {
  const { data, error } = await supabase
    .from("locations")
    .update(locationData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to update location in Supabase");
  }
  return data;
}

export async function deleteLocation(id) {
  const { error } = await supabase
    .from("locations")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message || "Failed to delete location in Supabase");
  }
  return { success: true };
}
