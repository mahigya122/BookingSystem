import type { Review } from "../types/review";
import { fetchJson } from "./http";

export async function getReviews(approved?: boolean, page?: number, pageSize?: number): Promise<any> {
  let url = "/reviews";
  const params = new URLSearchParams();
  if (approved !== undefined) params.append("approved", approved ? "true" : "false");
  if (page !== undefined) params.append("page", page.toString());
  if (pageSize !== undefined) params.append("pageSize", pageSize.toString());

  const queryStr = params.toString();
  if (queryStr) url += `?${queryStr}`;

  return fetchJson<any>(url);
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
