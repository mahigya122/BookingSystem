import { Star, User } from "lucide-react";
import type { Review } from "@shared/types";
import { useState, useMemo } from "react";
import { getOptimizedImageUrl } from "@shared/utils/imageUtils";

interface CabinReviewsProps {
    reviews?: Review[];
}

const ratingCategories = [
    { name: "Cleanliness", rating: 4.9, width: "98%" },
    { name: "Communication", rating: 4.8, width: "95%" },
    { name: "Check-in", rating: 5.0, width: "100%" },
    { name: "Accuracy", rating: 4.9, width: "98%" },
    { name: "Location", rating: 4.7, width: "92%" },
    { name: "Value", rating: 4.8, width: "96%" },
];

const CabinReviews = ({ reviews = [] }: CabinReviewsProps) => {
    if (!reviews || reviews.length === 0) {
        return null;
    }

    const [showAll, setShowAll] = useState(false);

    // Sort by latest first
    const sortedReviews = useMemo(() => {
        return [...reviews].sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
        });
    }, [reviews]);

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "N/A";

    const visibleReviews = showAll ? sortedReviews : sortedReviews.slice(0, 4);

    return (
        <div className="space-y-6 border-t border-slate-100 dark:border-slate-800/80 pt-6">
            <div>
                <h2 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Reviews & Feedback
                </h2>
            </div>

            {/* Ratings Overview Box */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch lg:items-center bg-slate-50/40 dark:bg-slate-900/10 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800/80">
                {/* Overall Rating Box */}
                <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-sky-100/50 dark:border-sky-955/50 w-full lg:w-44 text-center shrink-0 shadow-sm">
                    <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-none">
                        {avgRating}
                    </span>
                    <div className="flex items-center gap-0.5 mt-2.5">
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                    avgRating !== "N/A" && i < Math.round(Number(avgRating))
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-slate-200 dark:text-slate-800"
                                }`} 
                            />
                        ))}
                    </div>
                    <span className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-wider mt-3 block">
                        {avgRating === "N/A"
                            ? "No Ratings"
                            : Number(avgRating) >= 4.8
                            ? "Exceptional"
                            : Number(avgRating) >= 4.5
                            ? "Excellent"
                            : "Very Good"}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 mt-1 block">
                        {reviews.length} guest review{reviews.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Rating Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 w-full text-xs font-bold text-slate-700 dark:text-slate-350">
                    {ratingCategories.map((category) => (
                        <div key={category.name} className="space-y-1.5 p-0.5">
                            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider">
                                <span className="text-slate-500 dark:text-slate-400 font-semibold">{category.name}</span>
                                <span className="font-extrabold text-slate-850 dark:text-white">{category.rating}</span>
                            </div>
                            <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden w-full">
                                <div
                                    className="h-full bg-sky-500 rounded-full"
                                    style={{ width: category.width }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reviews List Grid */}
            <div className="space-y-6 pt-2">
                {sortedReviews.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {visibleReviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="p-5 md:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 space-y-4 hover:border-sky-400/80 hover:shadow-[0_4px_20px_rgba(56,189,248,0.08)] dark:hover:shadow-[0_4px_20px_rgba(56,189,248,0.05)] transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {review.guest?.avatar_url ? (
                                                    <img
                                                        src={getOptimizedImageUrl(review.guest.avatar_url, "avatar")}
                                                        alt={review.guest.full_name}
                                                        className="h-10 w-10 rounded-full object-cover shadow-sm border border-slate-100 dark:border-slate-800"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white font-black shadow-sm text-xs uppercase">
                                                        {review.guest?.full_name?.charAt(0) || <User className="h-4.5 w-4.5" />}
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                                                        {review.guest?.full_name || "Anonymous"}
                                                    </h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mt-1">
                                                        {review.created_at 
                                                            ? new Date(review.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" }) 
                                                            : "Recently"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3.5 w-3.5 ${
                                                            i < review.rating 
                                                                ? "fill-amber-400 text-amber-400" 
                                                                : "text-slate-200 dark:text-slate-800"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-slate-655 dark:text-slate-355 leading-relaxed font-medium text-xs pt-1">
                                            "{review.comment}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Expansion Button */}
                        {sortedReviews.length > 4 && (
                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={() => setShowAll((prev) => !prev)}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-extrabold text-xs uppercase tracking-wider hover:border-sky-500 dark:hover:border-sky-500 hover:text-sky-500 dark:hover:text-sky-400 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer shadow-sm"
                                >
                                    <span>{showAll ? "Show Less Reviews" : `Show All ${sortedReviews.length} Reviews`}</span>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 bg-slate-55/30 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80">
                        <p className="text-slate-500 dark:text-slate-400 font-bold">No reviews yet for this cabin.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CabinReviews;
