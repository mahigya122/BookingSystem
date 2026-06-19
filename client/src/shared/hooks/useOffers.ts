import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOffers, createOffer, updateOffer, deleteOffer } from "../services/offersApi";
import type { Offer } from "../types/offer";
import toast from "react-hot-toast";

export function useOffers(
  page?: number,
  pageSize?: number,
  search = ""
): {
  offers: Offer[];
  totalCount: number;
  isLoading: boolean;
  error: any;
  addOffer: any;
  isCreating: boolean;
  editOffer: any;
  isUpdating: boolean;
  removeOffer: any;
  isDeleting: boolean;
} {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["offers", page, pageSize, search],
    queryFn: () => {
      let url = "/offers";
      if (page !== undefined && pageSize !== undefined) {
        url += `?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`;
      } else if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }
      return getOffers(url);
    },
  });

  const { mutate: addOffer, isPending: isCreating } = useMutation({
    mutationFn: createOffer,
    onSuccess: () => {
      toast.success("Offer created successfully");
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const { mutate: editOffer, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateOffer(id, data),
    onSuccess: () => {
      toast.success("Offer updated successfully");
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const { mutate: removeOffer, isPending: isDeleting } = useMutation({
    mutationFn: deleteOffer,
    onSuccess: () => {
      toast.success("Offer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const isPaginated = page !== undefined && pageSize !== undefined;
  const offersList = isPaginated ? (data as any)?.data ?? [] : (data as any) ?? [];
  const total = isPaginated ? (data as any)?.count ?? 0 : offersList.length;

  return {
    offers: offersList as Offer[],
    totalCount: total,
    isLoading,
    error,
    addOffer,
    isCreating,
    editOffer,
    isUpdating,
    removeOffer,
    isDeleting,
  };
}
