const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export interface CabinAvailabilityBooking {
  id: string;
  guest_id?: string | null;
  cabin_id: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface CabinAvailabilityResponse {
  cabin_id: string;
  booked_dates: string[];
  bookings: CabinAvailabilityBooking[];
}

export async function getCabinAvailability(cabinId: string): Promise<CabinAvailabilityResponse> {
  const response = await fetch(`${API_BASE}/cabins/${encodeURIComponent(cabinId)}/availability`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Failed to load cabin availability");
  }

  return payload as CabinAvailabilityResponse;
}