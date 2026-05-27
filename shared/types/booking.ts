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
  created_at?: string;
  cabin_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: BookingStatus;   //string
  has_breakfast: boolean;

  guests?: {
    full_name: string;
    email?: string;
  };

  cabins?: {
    name: string;
    price_per_night: number;
  };
}