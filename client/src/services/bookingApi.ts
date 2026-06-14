import type { Booking } from "@shared/types";
import { fetchJson } from "@shared/services/http";

export const getBookings = async (): Promise<Booking[]> => {
  return fetchJson<Booking[]>("/bookings");
};
