import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createCabin } from "../services/apiCabins";

export function useCreateCabin() {
    const queryClient = useQueryClient();

    const { mutate: addCabin, isPending } = useMutation({
        mutationFn: createCabin,

        onSuccess: () => {
            toast.success("Cabin created successfully");

        queryClient.invalidateQueries({
            queryKey: ["cabins"],
        });   
 },
  onError: (err: any) => {
      toast.error(err.message);
  },
    });

    return { addCabin, isPending };  
}