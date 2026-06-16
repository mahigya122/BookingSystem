import { useReviews } from "@shared/hooks/useReviews";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const colors = ["bg-sky-400", "bg-orange-400", "bg-violet-500", "bg-emerald-500", "bg-rose-500"];

const getAvatarData = (name: string) => {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    
    // Simple hash for consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = colors[Math.abs(hash) % colors.length];
    
    return { initials, color };
};

const Stars = ({ n }: { n: number }) => (
    <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-sm ${i < n ? "text-amber-400" : "text-slate-200"}`}>★</span>
        ))}
    </div>
);

const TestimonialsSection = () => {
    const { reviews = [], isLoading } = useReviews(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (reviews.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    };

    const handlePrev = () => {
        if (reviews.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
            </div>
        );
    }

    if (reviews.length === 0) return null;

    return (
        <section className="pt-2 pb-6 md:pt-8 md:pb-12 lg:pt-12 lg:pb-16 w-full">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <p className="text-sky-500 text-xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
                        Guest Reviews
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        Loved by <span className="text-sky-500">Travellers</span>
                    </h2>
                    <div className="h-1 w-16 bg-sky-500 mr-auto rounded-full mt-1 hidden md:block" />
                    <p className="text-slate-500 dark:text-slate-400 text-base max-w-md font-medium leading-relaxed">
                        Real testimonials from our community.
                    </p>
                </div>

                <div className="flex gap-3 self-center md:self-end pb-1">
                    <button
                        onClick={handlePrev}
                        className="h-12 w-12 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 shadow-lg flex items-center justify-center text-slate-900 dark:text-white hover:bg-sky-500 hover:text-white transition-all duration-300 group"
                    >
                        <ChevronLeft size={24} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="h-12 w-12 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 shadow-lg flex items-center justify-center text-slate-900 dark:text-white hover:bg-sky-500 hover:text-white transition-all duration-300 group"
                    >
                        <ChevronRight size={24} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            <div className="relative overflow-hidden -mx-4 px-4">
                <div 
                    className="flex gap-6 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{ transform: `translateX(calc(-${currentIndex} * (100% / 3 + 1.5rem)))` }}
                >
                    {/* Multiplied list for infinite feel */}
                    {[...reviews, ...reviews, ...reviews].map((review, idx) => {
                        const guestName = review.guest?.full_name || "Guest";
                        const { initials, color } = getAvatarData(guestName);
                        
                        return (
                            <div
                                key={`${review.id}-${idx}`}
                                className="w-[85vw] md:w-[calc(33.333%-1rem)] shrink-0"
                            >
                                <div className="group relative bg-white dark:bg-slate-900/40 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800/60 p-6 h-full transition-all duration-500 hover:border-sky-400 overflow-hidden flex flex-col justify-between min-h-[300px] shadow-sm hover:shadow-xl">
                                    
                                    {/* Quote mark */}
                                    <div className="absolute top-4 right-6 text-6xl font-black text-slate-50 dark:text-slate-800/20 leading-none select-none opacity-50">"</div>

                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center gap-4">
                                            {review.guest?.avatar_url ? (
                                                <img 
                                                    src={review.guest.avatar_url} 
                                                    alt={guestName}
                                                    className="h-12 w-12 rounded-xl object-cover shadow-lg border-2 border-white dark:border-slate-800"
                                                />
                                            ) : (
                                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color} text-xs font-black text-white shadow-lg`}>
                                                    {initials}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{guestName}</p>
                                                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                                                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                                                    {review.guest?.location || "Verified Guest"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Stars n={review.rating} />
                                            <p className="text-base font-medium text-slate-650 dark:text-slate-350 leading-relaxed italic line-clamp-3">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative z-10 mt-6 pt-6 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stayed at</span>
                                            <span className="text-[10px] font-black text-sky-500">{review.cabin?.name || "Premium Cabin"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;