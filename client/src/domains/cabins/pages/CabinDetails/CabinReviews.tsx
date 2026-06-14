import { Star, User } from "lucide-react";
import type { Review } from "@shared/types";

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
    const avgRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : "N/A";

    return (
        <div className="space-y-8 border-t border-slate-100 dark:border-slate-800/80 pt-8">
            <div className="space-y-1">
                <p className="text-sky-400 text-lg font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    Guest Love
                </p>
                <div className="flex items-center justify-between mt-1">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        Guest Reviews & Comments
                    </h2>
                    <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="font-extrabold text-slate-950 dark:text-white text-lg">{avgRating}</span>
                        <span className="text-slate-400 dark:text-slate-600 text-lg">·</span>
                        <span className="font-bold text-slate-500 text-sm">{reviews.length} reviews</span>
                    </div>
                </div>
            </div>

            {/* Rating bars - currently static as they need detailed breakdown which we might not have */}
            <div className="grid md:grid-cols-2 gap-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                {ratingCategories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between gap-6 p-1">
                        <span className="w-28 text-slate-600 dark:text-slate-400">{category.name}</span>
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-sky-500 rounded-full"
                                style={{ width: category.width }}
                            />
                        </div>
                        <span className="w-6 text-right font-black">{category.rating}</span>
                    </div>
                ))}
            </div>

            {/* Review cards */}
            <div className="space-y-6">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div
                            key={review.id}
                            className="p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20 space-y-4 hover:scale-[1.01] transition-transform duration-300"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {review.guest?.avatar_url ? (
                                        <img 
                                            src={review.guest.avatar_url} 
                                            alt={review.guest.full_name}
                                            className="h-11 w-11 rounded-full object-cover shadow-md"
                                        />
                                    ) : (
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-white font-extrabold shadow-md shadow-sky-400/10">
                                            {review.guest?.full_name?.charAt(0) || <User className="h-6 w-6" />}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-extrabold text-slate-900 dark:text-white">
                                            {review.guest?.full_name || "Anonymous"}
                                        </h4>
                                        <p className="text-xs font-bold text-slate-400">
                                            {review.created_at ? new Date(review.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : "Recently"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className={`h-4.5 w-4.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"}`} 
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="text-slate-650 dark:text-slate-350 leading-relaxed font-medium text-sm">
                                "{review.comment}"
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-slate-500 font-bold">No reviews yet for this cabin.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CabinReviews;