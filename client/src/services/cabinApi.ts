import type { Cabin } from "@shared/types/cabin";
import { fetchJson } from "@shared/services/http";

export const getCabins = async (): Promise<Cabin[]> => {
  return fetchJson<Cabin[]>("/cabins");
};
