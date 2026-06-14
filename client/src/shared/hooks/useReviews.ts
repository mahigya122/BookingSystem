import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviews, deleteReview, updateReviewStatus, createReview } from "../services/reviewsApi";
import toast from "react-hot-toast";

export function useReviews(approved?: boolean) {
  const queryClient = useQueryClient();

  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ["reviews", { approved }],
    queryFn: () => getReviews(approved),
  });

  const { mutate: removeReview, isPending: isDeleting } = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const { mutate: moderateReview, isPending: isModerating } = useMutation({
    mutationFn: ({ id, is_moderated, is_approved }: { id: string; is_moderated: boolean; is_approved: boolean }) => 
      updateReviewStatus(id, { is_moderated, is_approved }),
    onSuccess: () => {
      toast.success("Review status updated");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const { mutate: addReview, isPending: isCreating } = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      toast.success("Thank you for your review!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      // Also invalidate cabin details to update the star rating
      queryClient.invalidateQueries({ queryKey: ["cabin"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { reviews, isLoading, error, removeReview, isDeleting, moderateReview, isModerating, addReview, isCreating };
}
