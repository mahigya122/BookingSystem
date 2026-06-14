import { useReviews } from "@shared/hooks/useReviews";
import { Loader2 } from "lucide-react";

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

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
            </div>
        );
    }

    if (reviews.length === 0) return null;

    // Only show latest 3 for the landing page
    const displayReviews = reviews.slice(0, 3);

    return (
        <section className="space-y-10">
            <div className="text-center space-y-2">
                <p className="text-sky-400 text-xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    Guest Reviews
                </p>
                <h2 className="text-4xl font-black text-slate-900">Loved by Travellers</h2>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                    Don't just take our word for it — hear from guests who've already made memories.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {displayReviews.map((review) => {
                    const guestName = review.guest?.full_name || "Guest";
                    const { initials, color } = getAvatarData(guestName);
                    
                    return (
                        <div
                            key={review.id}
                            className="group relative bg-white rounded-3xl border-2 border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                        >
                            {/* Sky-blue top stripe accent */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-sky-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-3xl" />

                            {/* Big quote mark decoration */}
                            <div className="absolute top-4 right-4 text-7xl font-black text-slate-50 leading-none select-none">"</div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${color} text-sm font-black text-white shadow`}>
                                    {initials}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{guestName}</p>
                                    <p className="text-xs text-slate-400">{review.guest?.location || "Recent Traveller"}</p>
                                </div>
                            </div>

                            <Stars n={review.rating} />

                            <p className="mt-3 text-sm text-slate-600 leading-relaxed italic">"{review.comment}"</p>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                                <span className="text-xs text-slate-400">Stayed at</span>
                                <span className="text-xs font-bold text-sky-500">{review.cabin?.name || "Premium Cabin"}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default TestimonialsSection;