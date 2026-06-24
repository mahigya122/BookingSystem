import type { Activity, Cabin, Location, Offer, Review, Booking } from "@shared/types";
import { fetchJson } from "@shared/services/http";

export type CabinWithBookings = Cabin & {
  bookings: Booking[];
  location?: Location;
  offers?: Offer[];
  activities?: Activity[];
  reviews?: Review[];
};

export interface ExploreFilters {
  price?: [number, number];
  capacity?: number | null;
  location_id?: string | null;
  activity_id?: string | null;
  offer_id?: string | null;
  dateRange?: {
    startDate: Date | string | null;
    endDate: Date | string | null;
  } | null;
}

export interface PaginatedCabins {
  data: CabinWithBookings[];
  count: number;
}

export const getCabinsWithBookings = async (
  filters?: ExploreFilters,
  page?: number,
  pageSize?: number
): Promise<CabinWithBookings[] | PaginatedCabins> => {
  let url = "/cabins";
  const params = new URLSearchParams();
  
  if (filters) {
    if (filters.price) {
      params.append("minPrice", filters.price[0].toString());
      params.append("maxPrice", filters.price[1].toString());
    }
    if (filters.capacity) {
      params.append("capacity", filters.capacity.toString());
    }
    if (filters.location_id) {
      params.append("locationId", filters.location_id);
    }
    if (filters.activity_id) {
      params.append("activityId", filters.activity_id);
    }
    if (filters.offer_id) {
      params.append("offerId", filters.offer_id);
    }
    if (filters.dateRange?.startDate) {
      const startStr = new Date(filters.dateRange.startDate).toISOString().split("T")[0];
      params.append("startDate", startStr);
    }
    if (filters.dateRange?.endDate) {
      const endStr = new Date(filters.dateRange.endDate).toISOString().split("T")[0];
      params.append("endDate", endStr);
    }
  }

  if (page !== undefined && pageSize !== undefined) {
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());
  }

  const queryStr = params.toString();
  if (queryStr) {
    url += `?${queryStr}`;
  }

  const response = await fetchJson<any>(url);
  const list = Array.isArray(response) ? response : (response?.data ?? []);

  if (page !== undefined && pageSize !== undefined) {
    const count = response?.count ?? list.length;
    const mapped = list.map((cabin: Cabin) => ({
      ...cabin,
      bookings: [],
    }));
    return { data: mapped, count };
  }

  return list.map((cabin: Cabin) => ({
    ...cabin,
    bookings: [],
  }));
};
