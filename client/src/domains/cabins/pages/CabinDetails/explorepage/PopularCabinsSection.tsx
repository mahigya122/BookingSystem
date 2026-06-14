import type { Cabin } from "@shared/types/cabin";
import CabinCard from "../../../components/CabinCard";

interface PopularCabinsSectionProps {
    cabins: Cabin[];
    filteredCount: number;
}

const PopularCabinsSection = ({ cabins, filteredCount }: PopularCabinsSectionProps) => {
    const displayed = cabins.slice(0, 6);

    return (
        <section id="popular-cabins" className="space-y-8 relative">
            {/* Airplane deco (like ref image 3) */}
            <svg className="absolute -top-4 left-0 w-12 h-12 text-slate-300 pointer-events-none" viewBox="0 0 80 80" fill="currentColor">
                <path d="M8 40 L72 12 L62 40 L72 68 Z" opacity="0.4" />
                <path d="M62 40 L28 52 L34 40 L28 28 Z" opacity="0.5" />
            </svg>
            {/* Dashed arc (like ref image 3 top-left quarter circle) */}
            <svg className="absolute top-0 left-8 w-32 h-32 pointer-events-none" viewBox="0 0 200 200" fill="none">
                <path d="M200 200 Q0 200 0 0" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 6" opacity="0.3" fill="none" />
            </svg>

            <div className="text-center space-y-2 relative z-10">
                <p className="text-sky-400 text-xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    Featured Cabins
                </p>
                <h2 className="text-4xl font-black text-slate-900">Hand-Picked Stays</h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                    Showing {filteredCount} available cabins — hand-picked for your perfect getaway.
                </p>
            </div>

            {displayed.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {displayed.map((cabin) => (
                        <CabinCard key={cabin.id} cabin={cabin} />
                    ))}
                </div>
            ) : (
                <div className="rounded-3xl bg-sky-50 border-2 border-sky-100 p-12 text-center">
                    <p className="text-slate-400">No cabins match your current filters. Try adjusting your price or guest count.</p>
                </div>
            )}
        </section>
    );
};

export default PopularCabinsSection;