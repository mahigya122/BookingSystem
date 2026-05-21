import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createCabin } from "../services/apiCabins";
import type { CabinData } from "../services/apiCabins";

export function useCreateCabin() {
    const queryClient = useQueryClient();

    const { mutate: addCabin, isPending } = useMutation({
        mutationFn: (cabin: CabinData) => createCabin(cabin),

        onSuccess: () => {
            toast.success("Cabin created successfully");

        queryClient.invalidateQueries({
            queryKey: ["cabins"],
        });   
 },
    onError: (err: unknown) => {
            toast.error(err instanceof Error ? err.message : "Failed to create cabin");
  },
    });

    return { addCabin, isPending };  
}