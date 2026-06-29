import { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useReviews } from "@shared/hooks/useReviews";

interface ReviewFormProps {
    cabinId: string;
    guestId: string;
    onSuccess?: () => void;
    isEmbedded?: boolean;
}

const ReviewForm = ({ cabinId, guestId, onSuccess, isEmbedded = false }: ReviewFormProps) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const { addReview, isCreating } = useReviews();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.error("Please provide a comment.");
            return;
        }

        addReview(
            { cabin_id: cabinId, guest_id: guestId, rating, comment },
            {
                onSuccess: () => {
                    setComment("");
                    setRating(5);
                    if (onSuccess) onSuccess();
                },
            }
        );
    };

    const formContent = (
        <div className="space-y-6 animate-fade-in">
            <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Share Your Experience</h3>
                <p className="text-sm font-bold text-slate-500">How was your stay at this sanctuary?</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/50">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Rating</span>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="transition-transform active:scale-90"
                            >
                                <Star
                                    className={`h-6 w-6 transition-colors ${star <= (hoveredRating || rating)
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-200 dark:text-slate-700"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Your Comment</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write something about the location, amenities, or host..."
                        className="w-full h-32 p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none resize-none font-medium text-slate-700 dark:text-slate-200"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-sky-500 hover:to-sky-600 text-white py-4 font-black shadow-xl shadow-sky-200/50 dark:shadow-none transition-all cursor-pointer disabled:opacity-70"
                >
                    {isCreating ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            <Send className="h-5 w-5" />
                            SUBMIT REVIEW
                        </>
                    )}
                </button>
            </form>
        </div>
    );

    if (isEmbedded) {
        return formContent;
    }

    return (
        <div className="p-8 rounded-[2.5rem] border border-sky-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6 animate-fade-in">
            {formContent}
        </div>
    );
};

export default ReviewForm;
