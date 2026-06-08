import { supabase } from "../lib/supabase.js";

export async function getCabinById(cabinId) {
  const { data, error } = await supabase
    .from("cabins")
    .select(`
      *,
      location:locations (*),
      offers:cabin_offers (
        offer:offers (*)
      ),
      activities:cabin_activities (
        activity:activities (*)
      ),
      reviews:reviews (*)
    `)
    .eq("id", cabinId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw new Error(error.message || "Failed to fetch cabin from Supabase");
  }

  // Flatten junction tables
  if (data.offers) {
    data.offers = data.offers.map((o) => o.offer).filter(Boolean);
  }
  if (data.activities) {
    data.activities = data.activities.map((a) => a.activity).filter(Boolean);
  }

  return data;
}

export async function getAllCabins() {
  const { data, error } = await supabase
    .from("cabins")
    .select(`
      *,
      location:locations (*),
      offers:cabin_offers (
        offer:offers (*)
      ),
      activities:cabin_activities (
        activity:activities (*)
      ),
      reviews:reviews (*)
    `)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message || "Failed to fetch cabins from Supabase");
  }

  // Flatten junction tables for each cabin
  return data.map((cabin) => ({
    ...cabin,
    offers: cabin.offers ? cabin.offers.map((o) => o.offer).filter(Boolean) : [],
    activities: cabin.activities ? cabin.activities.map((a) => a.activity).filter(Boolean) : [],
  }));
}
