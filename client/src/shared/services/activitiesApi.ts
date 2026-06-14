import type { Activity } from "../types/activity";
import { fetchJson } from "./http";

export async function getActivities(): Promise<Activity[]> {
  return fetchJson<Activity[]>("/activities");
}

export async function createActivity(activity: Omit<Activity, "id" | "created_at">) {
  return fetchJson<Activity>("/activities", {
    method: "POST",
    body: JSON.stringify(activity),
  });
}

export async function updateActivity(id: string, data: Partial<Activity>) {
  return fetchJson<Activity>(`/activities/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteActivity(id: string) {
  return fetchJson<{ success: boolean }>(`/activities/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
