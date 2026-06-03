import { useQuery } from "@tanstack/react-query";
import type { Cabin } from "@shared/types/cabin";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export async function getCabin(cabinId: string): Promise<Cabin> {
  const response = await fetch(`${API_BASE}/cabins/${encodeURIComponent(cabinId)}`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Failed to load cabin details");
  }

  return payload;
}

export function useCabin(cabinId?: string) {
  return useQuery<Cabin, Error>({
    queryKey: ["cabin", cabinId],
    queryFn: () => {
      if (!cabinId) {
        throw new Error("Cabin id is required");
      }
      return getCabin(cabinId);
    },
    enabled: Boolean(cabinId),
  });
}
