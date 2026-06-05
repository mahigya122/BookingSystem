import type { PaymentMethod, PaymentStatus } from "../../domains/payments/types/payment.types";

export type BookingStatus =
  | "all"
  | "checked-in"
  | "checked-out"
  | "booked"
  | "cancelled";

export type SortType =
  | "recent"
  | "earlier"
  | "price-high"
  | "price-low";

export interface Booking {
  id: string;
  created_at?: string;
  guest_id?: string;
  cabin_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: BookingStatus;   //string
  has_breakfast: boolean;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  transaction_id?: string;
  paid_at?: string;

  guests?: {
    id?: string;
    full_name: string;
    email?: string;
  };

  cabins?: {
    name: string;
    price_per_night: number;
  };
}