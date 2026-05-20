export type BookingStatus =
  | "all"
  | "checked-in"
  | "checked-out"
  | "booked";

export type SortType =
  | "recent"
  | "earlier"
  | "price-high"
  | "price-low";

export interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: BookingStatus;   //string

  guests?: {
    full_name: string;
    email?: string;
  };

  cabins?: {
    name: string;
    price_per_night: number;
  };
}