import { useMemo } from "react";
import { useLocations } from "@shared/hooks/useLocations";
import type { Cabin } from "@shared/types/cabin";
import { useCabinFiltersContext } from "../../../contexts/CabinFiltersContext";
import { motion } from "framer-motion";
import { layoutConfig } from "@shared/utils/spacing";
import SectionHeader from "@shared/components/ui/SectionHeader";

interface ExploreLocationsProps {
    cabins: Cabin[];
}

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const ExploreLocations = ({ cabins }: ExploreLocationsProps) => {
    const { locations = [], isLoading } = useLocations();
    const { filters, setFilters, applyFilters } = useCabinFiltersContext();

    // Deduplicate locations by name
    const uniqueLocations = useMemo(() => {
        const seen = new Set();
        return locations.filter(loc => {
            if (seen.has(loc.name)) return false;
            seen.add(loc.name);
            return true;
        });
    }, [locations]);

    if (isLoading) return null;

    // Filter locations that have at least one cabin or just show top 6
    const displayedLocations = uniqueLocations.slice(0, 6).map(loc => ({
        ...loc,
        cabinCount: cabins.filter(c => c.location_id === loc.id).length
    }));

    if (displayedLocations.length === 0) return null;

    const handleLocationClick = (locId: string) => {
        const newFilters = {
            ...filters,
            location_id: filters.location_id === locId ? null : locId
        };
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    return (
        <section id="explore-locations" className="pt-16 pb-16 relative w-full">
            <div className={layoutConfig.container}>
                <div className="absolute right-4 top-16 flex flex-col gap-2 pointer-events-none hidden lg:flex">
                    {displayedLocations.slice(0, 2).map((loc, i) => (
                        <motion.div
                            key={loc.id}
                            initial={{ opacity: 0, x: 20, rotate: i % 2 === 0 ? 0 : 0 }}
                            whileInView={{ opacity: 1, x: 0, rotate: i % 2 === 0 ? 6 : -4 }}
                            transition={{ duration: 0.8, delay: 0.5 + i * 0.2, ease: EASE }}
                            viewport={{ once: true }}
                            className={`w-12 h-14 bg-white rounded-lg shadow-lg border-2 border-white overflow-hidden`}
                        >
                            <img src={loc.image_url} alt="" className="w-full h-full object-cover" />
                        </motion.div>
                    ))}
                </div>

                <SectionHeader
                    label="Explore Destinations"
                    title="Browse by Location"
                    subtitle="From snowy peaks to forest hideaways, find the landscape that calls to you."
                    highlightIndex={2}
                    className={`relative z-10 ${layoutConfig.headerMargin}`}
                />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:h-[400px]">
                {/* Tall card */}
                {displayedLocations[0] && (() => {
                    const isSelected = filters.location_id === displayedLocations[0].id;
                    return (
                        <motion.div
                            onClick={() => handleLocationClick(displayedLocations[0].id)}
                            className={`row-span-2 group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-400 aspect-[4/5] md:aspect-auto ${isSelected ? "ring-4 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900" : ""
                                }`}
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.7,
                                ease: EASE,
                            }}
                            viewport={{ once: true }}
                        >
                            <img src={displayedLocations[0].image_url} alt={displayedLocations[0].name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 p-4 md:p-5 w-full flex items-end justify-between">
                                <div>
                                    <p className="text-white font-black text-sm md:text-base">{displayedLocations[0].name}</p>
                                    <p className="text-white/60 text-[10px] md:text-xs">{displayedLocations[0].cabinCount} Cabins</p>
                                </div>
                                {isSelected && (
                                    <span className="bg-sky-500 text-white font-black text-[8px] md:text-[9px] uppercase tracking-widest px-2 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-lg">Active</span>
                                )}
                            </div>
                        </motion.div>
                    );
                })()}

                {/* Other cards */}
                {displayedLocations.slice(1, 5).map((loc, idx) => {
                    const isSelected = filters.location_id === loc.id;
                    return (
                        <motion.div
                            key={loc.id}
                            onClick={() => handleLocationClick(loc.id)}
                            className={`group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-400 ${isSelected ? "ring-4 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900" : ""
                                } ${idx >= 2 ? "hidden md:block" : ""}`}
                            initial={{
                                opacity: 0,
                                y: 25,
                                scale: 0.98,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            transition={{
                                duration: 0.65,
                                delay: idx * 0.08,
                                ease: EASE,
                            }}
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <img src={loc.image_url} alt={loc.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 p-3 md:p-4 w-full flex items-end justify-between">
                                <div>
                                    <p className="text-white font-black text-xs md:text-sm leading-tight">{loc.name}</p>
                                    <p className="text-white/60 text-[9px] md:text-xs">{loc.cabinCount} Cabins</p>
                                </div>
                                {isSelected && (
                                    <span className="bg-sky-500 text-white font-black text-[7px] md:text-[8px] uppercase tracking-widest px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full shadow-lg">Active</span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            </div>
        </section>
    );
};

export default ExploreLocations;
