import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOffers, createOffer, updateOffer, deleteOffer } from "../services/offersApi";
import toast from "react-hot-toast";

export function useOffers() {
  const queryClient = useQueryClient();

  const { data: offers, isLoading, error } = useQuery({
    queryKey: ["offers"],
    queryFn: getOffers,
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

  return { offers, isLoading, error, addOffer, isCreating, editOffer, isUpdating, removeOffer, isDeleting };
}
