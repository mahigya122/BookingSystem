import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCabin } from "../../../src/services/apiCabins";

export function useDeleteCabin() {
    const queryClient = useQueryClient();

    const { mutate: removeCabin, isPending } = useMutation({
        mutationFn: deleteCabin,

    onSuccess: () => {
        toast.success("Cabin deleted successfully");

        queryClient.invalidateQueries({
            queryKey: ["cabins"],
        });   
    },
    
    onError: (err: unknown) => {
        toast.error(err instanceof Error ? err.message : "Failed to delete cabin");
    },
    });

    return { removeCabin, isPending };
}