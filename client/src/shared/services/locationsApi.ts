import type { Location } from "../types/location";
import { fetchJson } from "./http";

export async function getLocations(): Promise<Location[]> {
  return fetchJson<Location[]>("/locations");
}

export async function createLocation(location: Omit<Location, "id" | "created_at">) {
  return fetchJson<Location>("/locations", {
    method: "POST",
    body: JSON.stringify(location),
  });
}

export async function updateLocation(id: string, data: Partial<Location>) {
  return fetchJson<Location>(`/locations/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteLocation(id: string) {
  return fetchJson<{ success: boolean }>(`/locations/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
