import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking } from "../services/apiBookings";

export function useDeleteBooking() {
    const queryClient = useQueryClient();

    const { mutate: removeBooking, isPending } = useMutation({
        mutationFn: deleteBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: ["bookings"] 
            });
        },
    });

    return{
        removeBooking,
        isPending,
    };
}