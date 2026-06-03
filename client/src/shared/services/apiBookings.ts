const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export interface CreateBookingRequest {
  guest_full_name: string;
  guest_email: string;
  guest_phone: string;
  cabin_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  has_breakfast: boolean;
}

export async function createBooking(bookingData: CreateBookingRequest) {
  const response = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Failed to create booking");
  }

  return payload.booking;
}

// DELETE BOOKING
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
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  has_breakfast: boolean;
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