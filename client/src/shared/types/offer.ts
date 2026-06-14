export interface Offer {
  id: string;
  cabin_id?: string;
  cabin_name?: string;
  title: string;
  name?: string; // for backward compatibility if needed
  description?: string;
  discount_percent: number;
  discount_pct?: number; // for backward compatibility
  badge?: string;
  spend_threshold?: number;
  image_url?: string;
  is_featured?: boolean;
  created_at?: string;
}
