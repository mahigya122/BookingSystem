import { supabase } from "../lib/supabase.js";

function normalizeCabin(cabin) {
  return {
    ...cabin,
    location: cabin.location || null,
    offers: cabin.offers?.map((row) => row.offer || row).filter(Boolean) || [],
    activities: cabin.activities?.map((row) => row.activity || row).filter(Boolean) || [],
    reviews: cabin.reviews?.filter((r) => r.is_approved !== false) || [],
  };
}

export async function getCabinById(cabinId) {
  const { data, error } = await supabase
    .from("cabins")
    .select(`
      *,
      location:locations!cabins_location_id_fkey (*),
      offers:cabin_offers(offer:offers(*)),
      activities:cabin_activities(activity:activities(*)),
      reviews:reviews (*, guest:guests (full_name))
    `)
    .eq("id", cabinId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw new Error(error.message || "Failed to fetch cabin from Supabase");
  }

  return normalizeCabin(data);
}

export async function getAllCabins() {
  const { data, error } = await supabase
    .from("cabins")
    .select(`
      *,
      location:locations!cabins_location_id_fkey (*),
      offers:cabin_offers(offer:offers(*)),
      activities:cabin_activities(activity:activities(*)),
      reviews:reviews (*, guest:guests (full_name))
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch cabins from Supabase");
  }

  return data.map(normalizeCabin);
}

export async function createCabin(cabinData) {
  const { offer_ids, activity_ids, ...cabin } = cabinData;
  if (cabin.location_id === "") {
    cabin.location_id = null;
  }

  const { data, error } = await supabase
    .from("cabins")
    .insert([cabin])
    .select()
    .single();

  if (error) throw new Error(error.message || "Failed to create cabin");

  const cabinId = data.id;

  if (offer_ids?.length > 0) {
    const links = offer_ids.map(id => ({ cabin_id: cabinId, offer_id: id }));
    await supabase.from("cabin_offers").insert(links);
  }

  if (activity_ids?.length > 0) {
    const links = activity_ids.map(id => ({ cabin_id: cabinId, activity_id: id }));
    await supabase.from("cabin_activities").insert(links);
  }

  return getCabinById(cabinId);
}

export async function updateCabin(cabinId, updateData) {
  const { offer_ids, activity_ids, ...data } = updateData;
  if (data.location_id === "") {
    data.location_id = null;
  }

  const { data: updated, error } = await supabase
    .from("cabins")
    .update(data)
    .eq("id", cabinId)
    .select()
    .single();

  if (error) throw new Error(error.message || "Failed to update cabin");

  // Sync Offers
  if (offer_ids !== undefined) {
    await supabase.from("cabin_offers").delete().eq("cabin_id", cabinId);
    if (offer_ids.length > 0) {
        const links = offer_ids.map(id => ({ cabin_id: cabinId, offer_id: id }));
        await supabase.from("cabin_offers").insert(links);
    }
  }

  // Sync Activities
  if (activity_ids !== undefined) {
    await supabase.from("cabin_activities").delete().eq("cabin_id", cabinId);
    if (activity_ids.length > 0) {
        const links = activity_ids.map(id => ({ cabin_id: cabinId, activity_id: id }));
        await supabase.from("cabin_activities").insert(links);
    }
  }

  return getCabinById(updated.id);
}

export async function deleteCabin(id) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) throw new Error(error.message || "Failed to delete cabin");
}

