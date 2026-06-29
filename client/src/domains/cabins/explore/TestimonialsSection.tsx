import React, { useState, useMemo, useRef, useEffect } from "react";
import { useReviews } from "@shared/hooks/useReviews";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { layoutConfig, pageSpacing } from "@shared/utils/spacing";
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
    const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);

    // Drag / swipe state
    const dragStartX = useRef<number | null>(null);
    const isDragging = useRef(false);
    const controls = useAnimation();
    const hintPlayed = useRef(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const sortedReviews = useMemo(() => {
        return [...reviews].sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
        });
    }, [reviews]);

    const columnsPerPage = windowWidth < 768 ? 2 : 3;
    const maxIndex = Math.max(0, Math.ceil(sortedReviews.length / columnsPerPage) - 1);

    // Swipe hint on first render (mobile-ish: nudge right then back)
    useEffect(() => {
        if (hintPlayed.current || sortedReviews.length <= 1) return;
        const timer = setTimeout(async () => {
            hintPlayed.current = true;
            await controls.start({ x: -28, transition: { duration: 0.35, ease: "easeOut" } });
            await controls.start({ x: 0, transition: { duration: 0.45, ease: "easeInOut" } });
        }, 900);
        return () => clearTimeout(timer);
    }, [sortedReviews.length, controls]);

    const goTo = (index: number) => {
        let targetIndex = index;
        if (index > maxIndex) {
            targetIndex = 0;
        } else if (index < 0) {
            targetIndex = maxIndex;
        }
        setCurrentIndex(targetIndex);
        controls.set({ x: 0 });
    };

    const handleNext = () => {
        if (currentIndex >= maxIndex) {
            goTo(0);
        } else {
            goTo(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex === 0) {
            goTo(maxIndex);
        } else {
            goTo(currentIndex - 1);
        }
    };

    // ── Pointer events (works for both mouse & touch) ──
    const SWIPE_THRESHOLD = 50;

    const onPointerDown = (e: React.PointerEvent) => {
        dragStartX.current = e.clientX;
        isDragging.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current || dragStartX.current === null) return;
        const delta = e.clientX - dragStartX.current;
        // Live visual drag feedback
        controls.set({ x: delta * 0.35 }); // damped follow
    };

    const onPointerUp = (e: React.PointerEvent) => {
        if (!isDragging.current || dragStartX.current === null) return;
        const delta = e.clientX - dragStartX.current;
        isDragging.current = false;
        controls.start({ x: 0, transition: { duration: 0.3, ease: "easeOut" } });

        if (delta < -SWIPE_THRESHOLD) handleNext();
        else if (delta > SWIPE_THRESHOLD) handlePrev();

        dragStartX.current = null;
    };

    if (isLoading) {
        return (
            <section className={`relative ${pageSpacing.section} overflow-hidden bg-slate-50/50 dark:bg-slate-900/30`}>
                <div className={`relative z-10 ${layoutConfig.container}`}>
                    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-8 ${layoutConfig.headerMargin}`}>
                        <SectionHeader
                            label="Guest Experiences"
                            title="Real Stories from Our Guests"
                            subtitle="Real testimonials from our community of happy explorers."
                            center={false}
                            highlightIndex={3}
                            className="max-w-2xl"
                        />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {[0, 1, 2].map((idx) => (
                            <div
                                key={idx}
                                className={`rounded-[2rem] bg-slate-200 dark:bg-slate-800 animate-pulse h-[300px] ${idx >= 2 ? "hidden md:block" : ""}`}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!isLoading && sortedReviews.length === 0) return null;

    return (
        <section className={`relative ${pageSpacing.section} overflow-hidden bg-slate-50/50 dark:bg-slate-900/30`}>
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

                    {/* NAV BUTTONS — hidden on mobile */}
                    <div className="hidden md:flex gap-1 self-end">
                        <button
                            onClick={handlePrev}
                            className="p-1.5 text-slate-400 hover:text-sky-500 dark:text-slate-600 dark:hover:text-sky-400 transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none active:scale-90"
                            disabled={maxIndex <= 0}
                            title="Previous"
                        >
                            <ChevronLeft size={32} strokeWidth={2.5} className="drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="p-1.5 text-slate-400 hover:text-sky-500 dark:text-slate-600 dark:hover:text-sky-400 transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none active:scale-90"
                            disabled={maxIndex <= 0}
                            title="Next"
                        >
                            <ChevronRight size={32} strokeWidth={2.5} className="drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                        </button>
                    </div>
                </div>

                {/* TESTIMONIALS SLIDER */}
                <div
                    className="relative overflow-hidden -mx-4 px-4 cursor-grab active:cursor-grabbing select-none"
                    style={{ touchAction: "pan-y" }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                >
                    <motion.div
                        animate={controls}
                        style={{ x: 0 }}
                        className="flex"
                    >
                        {/* Inner wrapper handles page translation */}
                        <motion.div
                            className="flex w-full"
                            animate={{ x: `calc(-${currentIndex} * 100%)` }}
                            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                        >
                            {sortedReviews.map((review, idx) => {
                                const guestName = review.guest?.full_name || "Guest";
                                const colorClass = Colors[idx % Colors.length];

                                return (
                                    <div
                                        key={review.id}
                                        className="w-1/2 md:w-[33.333%] px-2 md:px-4 shrink-0"
                                    >
                                        <div className="relative p-3 md:p-8 rounded-2xl md:rounded-[2rem] bg-slate-100/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-sky-900/20 transition-all duration-500 h-[200px] sm:h-[250px] md:h-[300px] flex flex-col group">
                                            <div className={`mb-1.5 md:mb-4 ${colorClass} opacity-60 transition-all duration-500 group-hover:opacity-100 group-hover:text-sky-400 group-hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]`}>
                                                <Quote className="h-4 w-4 md:h-8 md:w-8" fill="currentColor" />
                                            </div>
                                            <div className="relative z-10 flex-1">
                                                <p className="text-[10px] sm:text-[12px] md:text-[14px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-4 md:line-clamp-4">
                                                    {review.comment}
                                                </p>
                                            </div>
                                            <div className="relative z-10 pt-2 md:pt-5 mt-auto flex flex-col gap-0.5">
                                                <h4 className="font-bold text-slate-900 dark:text-white text-[11px] md:text-sm tracking-tight truncate">
                                                    {guestName}
                                                </h4>
                                                <p className="text-[9px] md:text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide truncate">
                                                    {review.cabin?.name || "Premium Guest"}
                                                </p>
                                                <div className="flex items-center gap-1 mt-0.5 md:mt-1">
                                                    <span className="text-[10px] md:text-sm font-black text-slate-700 dark:text-slate-200">
                                                        {review.rating ? review.rating.toFixed(1) : "5.0"}
                                                    </span>
                                                    <span className="text-amber-400 text-[9px] md:text-[13px] -mt-[1px]">★</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </motion.div>
                </div>

                {/* DOT INDICATORS — mobile only */}
                {maxIndex > 0 && (
                    <div className="flex md:hidden justify-center gap-1.5 mt-5">
                        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goTo(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? "w-5 bg-sky-400"
                                    : "w-1.5 bg-slate-300 dark:bg-slate-600"
                                    }`}
                                aria-label={`Go to page ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default React.memo(TestimonialsSection);