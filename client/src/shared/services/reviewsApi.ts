import type { Review } from "../types/review";
import { fetchJson } from "./http";

export async function getReviews(approved?: boolean): Promise<Review[]> {
  const url = approved ? `/reviews?approved=true` : "/reviews";
  return fetchJson<Review[]>(url);
}

export async function deleteReview(id: string) {
  return fetchJson<{ success: boolean }>(`/reviews/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function updateReviewStatus(id: string, data: { is_moderated: boolean; is_approved: boolean }) {
  return fetchJson<Review>(`/reviews/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function createReview(data: { cabin_id: string; guest_id: string; rating: number; comment: string }) {
  return fetchJson<Review>("/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
