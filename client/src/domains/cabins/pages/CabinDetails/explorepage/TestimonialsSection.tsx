import { useReviews } from "@shared/hooks/useReviews";
import { Loader2, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { layoutConfig } from "@shared/utils/spacing";
import SectionHeader from "@shared/components/ui/SectionHeader";

const Colors = ["text-sky-400", "text-emerald-400", "text-blue-500", "text-indigo-400", "text-cyan-500"];

const Airplane = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 80 80" fill="none">
        <path d="M10 40 L70 15 L60 40 L70 65 Z" fill="currentColor" opacity="0.12" />
        <path d="M60 40 L30 50 L35 40 L30 30 Z" fill="currentColor" opacity="0.18" />
    </svg>
);

const Palm = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 140" fill="none">
        <rect x="46" y="60" width="8" height="80" rx="4" fill="currentColor" opacity="0.2" />
        <ellipse cx="50" cy="55" rx="30" ry="18" fill="currentColor" opacity="0.15" transform="rotate(-20 50 55)" />
        <ellipse cx="50" cy="50" rx="26" ry="14" fill="currentColor" opacity="0.15" transform="rotate(15 50 50)" />
        <ellipse cx="50" cy="45" rx="22" ry="12" fill="currentColor" opacity="0.2" transform="rotate(-35 50 45)" />
    </svg>
);

const DashedCircle = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="8 6" opacity="0.1" />
    </svg>
);
const TestimonialsSection = () => {
    const { reviews = [], isLoading } = useReviews(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Sort by latest first
    const sortedReviews = useMemo(() => {
        return [...reviews].sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
        });
    }, [reviews]);

    const maxIndex = Math.max(0, Math.ceil(sortedReviews.length / 3) - 1);

    const handleNext = () => {
        if (sortedReviews.length <= 3) return;
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const handlePrev = () => {
        if (sortedReviews.length <= 3) return;
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
            </div>
        );
    }

    if (sortedReviews.length === 0) return null;

    return (
        <section className={`relative py-[52px] md:py-[56px] lg:py-[60px] overflow-hidden bg-white dark:bg-slate-950`}>
            {/* DECORATIVE ELEMENTS */}
            <DashedCircle className="absolute top-0 -left-20 w-96 h-96 text-sky-400 pointer-events-none" />
            <DashedCircle className="absolute bottom-0 -right-20 w-[500px] h-[500px] text-emerald-400 pointer-events-none" />


            <Airplane className="absolute top-40 right-[15%] w-16 h-16 text-sky-400 -rotate-12 pointer-events-none opacity-40" />
            <Airplane className="absolute bottom-40 left-[10%] w-12 h-12 text-sky-300 rotate-45 pointer-events-none opacity-30" />

            <Palm className="absolute top-20 left-[5%] w-32 h-44 text-emerald-400 pointer-events-none rotate-12" />
            <Palm className="absolute bottom-20 right-[5%] w-40 h-56 text-sky-400 pointer-events-none -rotate-12 opacity-60" />

            <div className={`relative z-10 ${layoutConfig.container}`}>
                {/* HEADER */}
                <div className={`flex flex-col md:flex-row md:items-end justify-between gap-8 ${layoutConfig.headerMargin}`}>
                    <SectionHeader
                        label="Guest Experiences"
                        title="Real Stories from Our Guests"
                        subtitle="Real testimonials from our community of happy explorers."
                        center={false}
                        highlightIndex={3}
                        className="max-w-2xl"
                    />

                    {/* NAV BUTTONS */}
                    <div className="flex gap-1 self-start md:self-end">
                        <button
                            onClick={handlePrev}
                            className="p-1.5 text-slate-400 hover:text-sky-500 dark:text-slate-600 dark:hover:text-sky-400 transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none active:scale-90"
                            disabled={currentIndex === 0 || sortedReviews.length <= 3}
                            title="Previous"
                        >
                            <ChevronLeft size={32} strokeWidth={2.5} className="drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="p-1.5 text-slate-400 hover:text-sky-500 dark:text-slate-600 dark:hover:text-sky-400 transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none active:scale-90"
                            disabled={currentIndex >= maxIndex || sortedReviews.length <= 3}
                            title="Next"
                        >
                            <ChevronRight size={32} strokeWidth={2.5} className="drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                        </button>
                    </div>
                </div>

                {/* TESTIMONIALS SLIDER */}
                <div className="relative overflow-hidden -mx-4 px-4">
                    <motion.div
                        className="flex transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                        style={{ transform: `translateX(calc(-${currentIndex} * 100%))` }}
                    >
                        {sortedReviews.map((review, idx) => {
                            const guestName = review.guest?.full_name || "Guest";
                            const colorClass = Colors[idx % Colors.length];

                            return (
                                <div
                                    key={review.id}
                                    className="w-full md:w-[33.333%] px-4 shrink-0"
                                >
                                    <div className="relative p-6 md:p-8 rounded-[2rem] bg-slate-100/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-sky-900/20 transition-all duration-500 h-[300px] flex flex-col group">

                                        {/* Quote Icon */}
                                        <div className={`mb-4 ${colorClass} opacity-60 transition-all duration-500 group-hover:opacity-100 group-hover:text-sky-400 group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]`}>
                                            <Quote size={32} fill="currentColor" />
                                        </div>

                                        <div className="relative z-10 flex-1">
                                            <p className="text-[13px] md:text-[14px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                                                {review.comment}
                                            </p>
                                        </div>

                                        <div className="relative z-10 pt-5 mt-auto flex flex-col gap-0.5">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
                                                {guestName}
                                            </h4>
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
                                                {review.cabin?.name || "Premium Guest"}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                                                    {review.rating ? review.rating.toFixed(1) : "5.0"}
                                                </span>
                                                <span className="text-amber-400 text-[13px] -mt-[1px]">★</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
