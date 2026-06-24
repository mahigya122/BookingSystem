import { MapPin, Globe } from "lucide-react";
import type { Location } from "@shared/types";
import { getOptimizedImageUrl } from "@shared/utils/imageUtils";

interface CabinLocationProps {
    cabinName: string;
    location?: Location;
}

const CabinLocation = ({ cabinName, location }: CabinLocationProps) => {
    const nearbySpots = [
        { label: "🌲 Local Forest Hikes", distance: "5 min walk" },
        { label: "🥖 Neighborhood Bakery", distance: "10 min walk" },
        { label: "🚌 Transit Station", distance: "15 min drive" },
    ];

    return (
        <div className="space-y-6 border-t border-slate-150 dark:border-slate-800/80 pt-8 md:pt-12">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-450 dark:text-slate-500">
                Location
            </h2>

            <div className="flex flex-col gap-8 items-start">
                {/* Simulated Map */}
                <div className="space-y-4 w-full">
                    <div className="relative h-72 rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-800 group">
                        {location?.image_url ? (
                             <img 
                                src={getOptimizedImageUrl(location.image_url, 'hero')} 
                                alt={location.name} 
                                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80";
                                }}
                             />
                        ) : (
                            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-900 opacity-60 bg-[radial-gradient(#0ea5e9_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
                        )}

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group-hover:scale-105 transition-transform duration-300">
                            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white shadow-xl animate-bounce">
                                <MapPin className="h-6 w-6" />
                                <span className="absolute inline-flex h-full w-full rounded-full bg-sky-455 opacity-30 animate-ping" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-white px-3 py-1 rounded-full shadow-md">
                                {cabinName}
                            </span>
                        </div>
                    </div>

                    {location && (
                        <div className="flex items-center gap-3 px-2">
                            <div className="h-10 w-10 rounded-2xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                                <Globe className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-extrabold text-slate-900 dark:text-white">{location.name}</h4>
                                <p className="text-xs font-bold text-slate-550">{location.city}, {location.country}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Nearby Attractions */}
                <div className="space-y-6 w-full">
                    <div className="space-y-2">
                        <h3 className="font-extrabold text-xs text-slate-900 dark:text-white">
                            About
                        </h3>
                        <p className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                            {location?.description || "This beautiful area offers a perfect blend of natural serenity and local charm. Explore nearby trails, enjoy local cuisine, and experience the best of the region's hospitality."}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-black text-[10px] uppercase tracking-wider text-slate-400">
                            Nearby
                        </h3>
                        <ul className="space-y-2.5 font-semibold text-xs text-slate-650 dark:text-slate-400">
                            {nearbySpots.map((spot, i) => (
                                <li key={i} className="flex items-center gap-2.5 group cursor-default">
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-sky-600 dark:text-sky-400 text-[9px] font-black">
                                        {i + 1}
                                    </span>
                                    <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{spot.label} ({spot.distance})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CabinLocation;
