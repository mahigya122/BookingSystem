import { supabase } from "./supabase";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export interface CreateBookingRequest {
  guest_id?: string;
  guest_full_name?: string;
  guest_email?: string;
  guest_phone?: string;
  cabin_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  has_breakfast: boolean;
  extra_activities?: any[];
  extra_offers?: any[];
  payment_status?: string;
  payment_method?: string;
  paid_at?: string;
  transaction_id?: string;
  is_admin_booking?: boolean;
}

export async function createBooking(bookingData: CreateBookingRequest) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Authentication required");

  const isAdmin = !!bookingData.is_admin_booking;
  const guestId = isAdmin ? bookingData.guest_id : user.id;

  if (!guestId) throw new Error("Guest ID is required");

  // Gather guest metadata to prevent NOT NULL constraint violations on upsert
  let fullName = bookingData.guest_full_name;
  let email = bookingData.guest_email;
  let phone = bookingData.guest_phone;

  if (!isAdmin) {
    // For normal users, try to use current user data
    fullName = fullName || user.user_metadata?.full_name;
    email = email || user.email;
    phone = phone || user.user_metadata?.phone;

    // Fallback to profile table if metadata is incomplete
    if (!fullName || !phone) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone_no")
        .eq("id", user.id)
        .single();
      
      if (profile) {
        fullName = fullName || profile.full_name;
        phone = phone || profile.phone_no;
      }
    }
  } else if (!fullName) {
    // For admin bookings, if details aren't passed, check if guest already exists
    const { data: existingGuest } = await supabase
      .from("guests")
      .select("full_name, email, phone")
      .eq("id", guestId)
      .maybeSingle();
    
    if (existingGuest) {
      fullName = existingGuest.full_name;
      email = email || existingGuest.email;
      phone = phone || existingGuest.phone;
    }
  }

  if (!fullName) {
    throw new Error("Guest full name is required to complete the booking");
  }

  // Rule 4: Ensure guest exists in guests table using upsert
  const { error: guestError } = await supabase
    .from("guests")
    .upsert({ 
      id: guestId,
      full_name: fullName,
      email: email || "",
      phone: phone || ""
    });

  if (guestError) throw new Error(`Guest preparation failed: ${guestError.message}`);

  // Rule 5 & 6: Payment status logic
  let paymentStatus = bookingData.payment_status || "pending";
  if (bookingData.payment_method === "arrival") {
    paymentStatus = "pending";
  } else if (bookingData.transaction_id) {
    paymentStatus = "paid";
  }

  // Rule 1, 2, 3: Insert booking
  const { data, error } = await supabase
    .from("bookings")
    .insert([{
      guest_id: guestId,
      created_by: user.id,
      is_admin_booking: isAdmin,
      cabin_id: bookingData.cabin_id,
      start_date: bookingData.start_date,
      end_date: bookingData.end_date,
      total_price: bookingData.total_price,
      has_breakfast: bookingData.has_breakfast,
      extra_activities: bookingData.extra_activities || [],
      extra_offers: bookingData.extra_offers || [],
      payment_status: paymentStatus,
      payment_method: bookingData.payment_method,
      paid_at: paymentStatus === "paid" ? (bookingData.paid_at || new Date().toISOString()) : null,
      transaction_id: paymentStatus === "paid" ? bookingData.transaction_id : null,
      status: "booked"
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// CANCEL BOOKING
export async function cancelBooking(id: string) {
  const response = await fetch(`${API_BASE}/bookings/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "cancelled" }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Failed to cancel booking");
  }

  return payload.booking;
}

export async function deleteBooking(id: string) {
  const response = await fetch(`${API_BASE}/bookings/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Failed to delete booking");
  }

  return payload;
}

// UPDATE BOOKING
export interface UpdateBookingData {
  id: string;
  guest_id?: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  has_breakfast: boolean;
  payment_status?: string;
  payment_method?: string;
  paid_at?: string;
  transaction_id?: string;
}

export async function updateBooking(
  bookingData: UpdateBookingData
) {
  const response = await fetch(`${API_BASE}/bookings/${encodeURIComponent(bookingData.id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Failed to update booking");
  }

  return payload.booking;
}