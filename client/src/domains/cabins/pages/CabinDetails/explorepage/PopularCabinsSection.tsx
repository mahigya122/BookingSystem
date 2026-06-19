import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import type { Cabin } from "@shared/types/cabin";
import { layoutConfig } from "@shared/utils/spacing";
import SectionHeader from "@shared/components/ui/SectionHeader";

interface PopularCabinsSectionProps {
    cabins: Cabin[];
    filteredCount: number;
}

const PopularCabinsSection = ({ cabins, filteredCount }: PopularCabinsSectionProps) => {
    const displayed = cabins.slice(0, 6);

    return (
        <section id="popular-cabins" className="py-[52px] md:py-[56px] lg:py-[60px] relative w-full">
            <div className={layoutConfig.container}>
                {/* Airplane deco */}
                <svg className="absolute top-0 left-0 w-10 h-10 text-slate-300 pointer-events-none" viewBox="0 0 80 80" fill="currentColor">
                    <path d="M8 40 L72 12 L62 40 L72 68 Z" opacity="0.3" />
                    <path d="M62 40 L28 52 L34 40 L28 28 Z" opacity="0.4" />
                </svg>

                <SectionHeader
                    label="Featured Cabins"
                    title="Discover Your Perfect Stay"
                    subtitle={`Showing ${filteredCount} available cabins hand picked for your perfect getaway.`}
                    highlightIndex={2}
                    className={layoutConfig.headerMargin}
                />

                {displayed.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-4 md:h-[400px]">
                        {/* Tall card */}
                        {displayed[0] && (
                            <Link
                                to={`/cabin/${displayed[0].id}`}
                                className="row-span-2 group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-400 aspect-[4/5] md:aspect-auto"
                            >
                                <img
                                    src={displayed[0].image_url}
                                    alt={displayed[0].name}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                {/* Price tag */}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg z-10">
                                    <span className="text-slate-900 font-black text-xs md:text-sm">${displayed[0].price_per_night}</span>
                                    <span className="text-slate-500 text-[10px] ml-0.5">/nt</span>
                                </div>

                                <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                                    <h3 className="text-white font-black text-base md:text-lg leading-tight group-hover:text-sky-400 transition-colors">
                                        {displayed[0].name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <MapPin size={12} className="text-sky-400" />
                                        <p className="text-white/70 text-[10px] md:text-xs font-medium truncate">
                                            {displayed[0].location?.name || "Private Location"}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Other cards */}
                        {displayed.slice(1, 5).map((cabin, idx) => (
                            <Link
                                key={cabin.id}
                                to={`/cabin/${cabin.id}`}
                                className={`group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-400 ${idx >= 2 ? "hidden md:block" : ""}`}
                            >
                                <img
                                    src={cabin.image_url}
                                    alt={cabin.name}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                                {/* Price tag */}
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-lg z-10">
                                    <span className="text-slate-900 font-black text-[10px] md:text-xs">${cabin.price_per_night}</span>
                                </div>

                                <div className="absolute bottom-0 left-0 p-3 md:p-4 w-full">
                                    <h3 className="text-white font-black text-[10px] md:text-xs leading-tight group-hover:text-sky-400 transition-colors">
                                        {cabin.name}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <MapPin size={10} className="text-sky-400" />
                                        <p className="text-white/70 text-[9px] md:text-[10px] font-medium truncate">
                                            {cabin.location?.name || "Private Location"}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl bg-sky-50 border-2 border-sky-100 p-12 text-center">
                        <p className="text-slate-400">No cabins match your current filters.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PopularCabinsSection;

