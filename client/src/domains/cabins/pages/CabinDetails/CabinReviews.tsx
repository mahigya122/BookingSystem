import { Star, User, ChevronLeft, ChevronRight } from "lucide-react";
import type { Review } from "@shared/types";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";

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
    const [currentIndex, setCurrentIndex] = useState(0);

    // Sort by latest first like in TestimonialsSection
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

    // Block-based sliding like TestimonialsSection (3 items per block on desktop)
    // For CabinReviews, we'll use 2 items per block on md and 1 on mobile to keep it focused
    const maxIndex = Math.max(0, Math.ceil(sortedReviews.length / 2) - 1);

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

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
                        <span className="hidden small:inline font-bold text-slate-500 text-sm">{reviews.length} reviews</span>
                    </div>
                </div>
            </div>

            {/* Rating bars */}
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

            {/* Review Slider */}
            <div className="relative space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                        Guest Experiences
                    </h3>
                    
                    {/* NAV BUTTONS like TestimonialsSection */}
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0 || sortedReviews.length <= 2}
                            className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center text-slate-900 dark:text-white hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentIndex >= maxIndex || sortedReviews.length <= 2}
                            className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center text-slate-900 dark:text-white hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div className="relative overflow-hidden -mx-4 px-4">
                    {sortedReviews.length > 0 ? (
                        <motion.div
                            className="flex transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                            style={{ transform: `translateX(calc(-${currentIndex} * 100%))` }}
                        >
                            {sortedReviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="w-full md:w-1/2 px-4 shrink-0"
                                >
                                    <div className="p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20 space-y-4 transition-all duration-500 hover:border-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] h-full">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {review.guest?.avatar_url ? (
                                                    <img
                                                        src={review.guest.avatar_url}
                                                        alt={review.guest.full_name}
                                                        className="h-12 w-12 rounded-full object-cover shadow-md border-2 border-white dark:border-slate-800"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white font-extrabold shadow-md shadow-sky-400/10">
                                                        {review.guest?.full_name?.charAt(0) || <User className="h-6 w-6" />}
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="font-extrabold text-slate-900 dark:text-white">
                                                        {review.guest?.full_name || "Anonymous"}
                                                    </h4>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                        {review.created_at ? new Date(review.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : "Recently"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-800"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-[15px]">
                                            "{review.comment}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-900/40 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                            <p className="text-slate-500 font-bold">No reviews yet for this cabin.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CabinReviews;
