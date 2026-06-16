export interface Review {
  id: string;
  cabin_id: string;
  cabin_name?: string;
  guest_id: string;
  rating: number;
  comment?: string;
  is_moderated?: boolean;
  is_approved?: boolean;
  created_at?: string;

  guest?: {
    full_name: string;
    avatar_url?: string;
    location?: string;
  };
  cabin?: {
    name: string;
  };
}
