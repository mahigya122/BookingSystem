export interface Guest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at?: string;
}

export type GuestSortType = "recent" | "earlier" | "name-az" | "name-za";