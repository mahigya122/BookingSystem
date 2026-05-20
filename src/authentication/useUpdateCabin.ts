import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCabin } from "../services/apiCabins";

export function useUpdateCabin() {
  const queryClient = useQueryClient(); 

  const { mutate: editCabin, isPending } = useMutation({
    mutationFn: updateCabin,
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
  