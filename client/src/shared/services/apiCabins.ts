import type { Cabin } from "@shared/types/cabin";
import { fetchJson } from "./http";

export interface CabinData {
  name: string;
  capacity: number;
  price_per_night: number;
  discount: number;
  image_url: string;
  description?: string;
  location_id?: string;
  offer_ids?: string[];
  activity_ids?: string[];
}

export async function getCabins(): Promise<Cabin[]> {
  return fetchJson<Cabin[]>("/cabins");
}

export async function createCabin(cabinData: CabinData) {
  return fetchJson<Cabin>("/cabins", {
    method: "POST",
    body: JSON.stringify(cabinData),
  });
}

export async function deleteCabin(id: string) {
  return fetchJson<{ success: boolean }>(`/cabins/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export interface UpdateCabinData {
  id: string;
  data: Partial<CabinData>;
}

export async function updateCabin({ id, data }: UpdateCabinData) {
  return fetchJson<Cabin>(`/cabins/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
