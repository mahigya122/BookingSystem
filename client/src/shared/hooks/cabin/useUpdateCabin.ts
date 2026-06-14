import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCabin, type UpdateCabinData } from "../../services/apiCabins";
import type { Cabin } from "../../types/cabin";

export function useUpdateCabin() {
  const queryClient = useQueryClient(); 

  const { mutate: editCabin, isPending } = useMutation<Cabin, Error, UpdateCabinData>({
    mutationFn: (cabinData: UpdateCabinData) => updateCabin(cabinData),
    onSuccess: () => {
        toast.success("Cabin updated");

        queryClient.invalidateQueries({
          queryKey: ["cabins"],
        });
      },

      onError: (err: Error) => {
        toast.error(err.message);
      },
    });

  return {
    editCabin,
    isPending,
  };
}
  
