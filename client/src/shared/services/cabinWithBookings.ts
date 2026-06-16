import type { Activity, Cabin, Location, Offer, Review, Booking } from "@shared/types";
import { fetchJson } from "@shared/services/http";

export type CabinWithBookings = Cabin & {
  bookings: Booking[];
  location?: Location;
  offers?: Offer[];
  activities?: Activity[];
  reviews?: Review[];
};

export const getCabinsWithBookings = async (): Promise<CabinWithBookings[]> => {
  const [cabins, bookings] = await Promise.all([
    fetchJson<Cabin[]>("/cabins"),
    fetchJson<Booking[]>("/bookings"),
  ]);

  return cabins.map((cabin) => ({
    ...cabin,
    bookings: bookings.filter((booking) => booking.cabin_id === cabin.id),
  }));
};
