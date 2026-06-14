import { useMemo } from "react";
import { useLocations } from "@shared/hooks/useLocations";
import type { Cabin } from "@shared/types/cabin";
import { useCabinFiltersContext } from "../../../contexts/CabinFiltersContext";

interface ExploreLocationsProps {
    cabins: Cabin[];
}

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
        <section className="space-y-10 relative">
            <div className="absolute -right-6 top-20 flex flex-col gap-3 pointer-events-none hidden lg:flex">
                {displayedLocations.slice(0, 2).map((loc, i) => (
                    <div
                        key={loc.id}
                        className={`w-14 h-16 bg-white rounded-lg shadow-lg border-2 border-white overflow-hidden ${i % 2 === 0 ? "rotate-6" : "-rotate-4"}`}
                    >
                        <img src={loc.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>

            <div className="text-center space-y-2">
                <p className="text-sky-400 text-xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    Explore Destinations
                </p>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white">Browse by Location</h2>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                    From snowy peaks to forest hideaways — find the landscape that calls to you.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[500px]">
                {/* Tall left card */}
                {displayedLocations[0] && (() => {
                    const isSelected = filters.location_id === displayedLocations[0].id;
                    return (
                        <div 
                            onClick={() => handleLocationClick(displayedLocations[0].id)}
                            className={`row-span-2 group relative overflow-hidden rounded-3xl cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-400 ${
                                isSelected ? "ring-4 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900" : ""
                            }`}
                        >
                            <img src={displayedLocations[0].image_url} alt={displayedLocations[0].name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 p-5 w-full flex items-end justify-between">
                                <div>
                                    <p className="text-white font-black text-base">{displayedLocations[0].name}</p>
                                    <p className="text-white/60 text-xs">{displayedLocations[0].cabinCount} Cabins</p>
                                </div>
                                {isSelected && (
                                    <span className="bg-sky-500 text-white font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">Active</span>
                                )}
                            </div>
                        </div>
                    );
                })()}
                
                {/* Other cards */}
                {displayedLocations.slice(1, 5).map((loc) => {
                    const isSelected = filters.location_id === loc.id;
                    return (
                        <div 
                            key={loc.id} 
                            onClick={() => handleLocationClick(loc.id)}
                            className={`group relative overflow-hidden rounded-3xl cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-400 ${
                                isSelected ? "ring-4 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900" : ""
                            }`}
                        >
                            <img src={loc.image_url} alt={loc.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 p-4 w-full flex items-end justify-between">
                                <div>
                                    <p className="text-white font-black text-sm leading-tight">{loc.name}</p>
                                    <p className="text-white/60 text-xs">{loc.cabinCount} Cabins</p>
                                </div>
                                {isSelected && (
                                    <span className="bg-sky-500 text-white font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full shadow-lg">Active</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ExploreLocations;