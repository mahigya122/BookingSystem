import type { Offer } from "../types/offer";
import { fetchJson } from "./http";

export async function getOffers(url = "/offers"): Promise<Offer[]> {
  return fetchJson<Offer[]>(url);
}

export async function createOffer(offer: Omit<Offer, "id" | "created_at">) {
  return fetchJson<Offer>("/offers", {
    method: "POST",
    body: JSON.stringify(offer),
  });
}

export async function updateOffer(id: string, data: Partial<Offer>) {
  return fetchJson<Offer>(`/offers/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteOffer(id: string) {
  return fetchJson<{ success: boolean }>(`/offers/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
