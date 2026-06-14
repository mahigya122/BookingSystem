import type { Location } from "./location";
import type { Offer } from "./offer";
import type { Activity } from "./activity";
import type { Review } from "./review";

export interface Cabin {
  id: string;
  name: string;
  capacity: number;
  price_per_night: number;
  discount: number;
  image_url: string;
  description?: string;
  location_id?: string;
  
  // Optional nested objects from Supabase
  location?: Location;
  offers?: Offer[];
  activities?: Activity[];
  reviews?: Review[];
}


