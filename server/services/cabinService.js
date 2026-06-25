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

export async function getAllCabins(options = {}) {
  let page, pageSize, filter, sort, locationId, activityId, offerId, minPrice, maxPrice, capacity, startDate, endDate;
  if (typeof options === "object" && !Array.isArray(options)) {
    ({
      page,
      pageSize,
      filter = "all",
      sort = "recent",
      locationId,
      activityId,
      offerId,
      minPrice,
      maxPrice,
      capacity,
      startDate,
      endDate
    } = options);
  } else {
    page = arguments[0];
    pageSize = arguments[1];
    filter = arguments[2] || "all";
    sort = arguments[3] || "recent";
  }

  let query = supabase
    .from("cabins")
    .select(`
      id,
      name,
      capacity,
      price_per_night,
      discount,
      image_url,
      location_id,
      description,
      location:locations!cabins_location_id_fkey (id, name, city, country, image_url),
      offers:cabin_offers(offer:offers(id, title, badge, discount_percent)),
      activities:cabin_activities(activity:activities(id, name, image_url)),
      reviews:reviews(id)
    `,
      { count: "exact" }
    );

  // 1. Availability checking (filter out cabins overlapping with check-in/out dates)
  if (startDate && endDate) {
    const { data: bookedCabins, error: bookingsErr } = await supabase
      .from("bookings")
      .select("cabin_id")
      .in("status", ["booked", "checked-in"])
      .lt("start_date", endDate)
      .gt("end_date", startDate);

    if (bookingsErr) {
      throw new Error("Failed to filter by availability: " + bookingsErr.message);
    }

    if (bookedCabins && bookedCabins.length > 0) {
      const bookedIds = bookedCabins.map(b => b.cabin_id).filter(Boolean);
      if (bookedIds.length > 0) {
        query = query.not("id", "in", `(${bookedIds.join(",")})`);
      }
    }
  }

  // 2. Capacity filter
  if (capacity) {
    query = query.gte("capacity", capacity);
  }

  // 3. Price range filters
  if (minPrice !== undefined) {
    query = query.gte("price_per_night", minPrice);
  }
  if (maxPrice !== undefined) {
    query = query.lte("price_per_night", maxPrice);
  }

  // 4. Location filter
  if (locationId) {
    query = query.eq("location_id", locationId);
  }

  // 5. Activity filter
  if (activityId) {
    const { data: actCabins, error: actErr } = await supabase
      .from("cabin_activities")
      .select("cabin_id")
      .eq("activity_id", activityId);

    if (actErr) {
      throw new Error("Failed to filter by activity: " + actErr.message);
    }

    const actCabinIds = actCabins?.map(c => c.cabin_id).filter(Boolean) || [];
    if (actCabinIds.length > 0) {
      query = query.in("id", actCabinIds);
    } else {
      query = query.eq("id", "00000000-0000-0000-0000-000000000000"); // Return no results
    }
  }

  // 6. Offer filter
  if (offerId) {
    const { data: offerCabins, error: offErr } = await supabase
      .from("cabin_offers")
      .select("cabin_id")
      .eq("offer_id", offerId);

    if (offErr) {
      throw new Error("Failed to filter by offer: " + offErr.message);
    }

    const offerCabinIds = offerCabins?.map(c => c.cabin_id).filter(Boolean) || [];
    if (offerCabinIds.length > 0) {
      query = query.in("id", offerCabinIds);
    } else {
      query = query.eq("id", "00000000-0000-0000-0000-000000000000"); // Return no results
    }
  }

  // Apply generic discount filters
  if (filter === "with-discount") {
    query = query.gt("discount", 0);
  } else if (filter === "no-discount") {
    query = query.eq("discount", 0);
  }

  // Apply sorting
  if (sort === "recent") {
    query = query.order("created_at", { ascending: false });
  } else if (sort === "price-high") {
    query = query.order("price_per_night", { ascending: false });
  } else if (sort === "price-low") {
    query = query.order("price_per_night", { ascending: true });
  } else if (sort === "capacity-high") {
    query = query.order("capacity", { ascending: false });
  } else if (sort === "capacity-low") {
    query = query.order("capacity", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  // Optional Pagination
  if (page !== undefined && pageSize !== undefined) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error(error.message || "Failed to fetch cabins from Supabase");
  }

  const normalizedData = data.map(normalizeCabin);

  if (page !== undefined && pageSize !== undefined) {
    return { data: normalizedData, count };
  }
  return normalizedData;
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

