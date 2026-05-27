export interface Settings {
  id: string;
  min_booking_length: number;
  max_booking_length: number;
  max_guests_per_booking: number;
  breakfast_price: number;
  updated_at?: string;
}