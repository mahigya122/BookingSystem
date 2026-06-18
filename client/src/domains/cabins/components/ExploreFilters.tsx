import { useMemo } from "react";
import { Range, getTrackBackground } from "react-range";
import { useFilterActions } from "../../../hooks/useFilterActions";
import { useLocations } from "@shared/hooks/useLocations";
import { useActivities } from "@shared/hooks/useActivities";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DollarSign, RotateCcw, MapPin, Star, Users } from "lucide-react";

const STEP = 10;
const MIN = 50;
const MAX = 1000;

const ExploreFilters = () => {
    const {
        filters,
        handlePriceChange,
        handleCapacityChange,
        handleLocationChange,
        handleActivityChange,
        handleReset,
        applyFilters,
        isSearching
    } = useFilterActions();

    const { locations: rawLocations = [] } = useLocations();
    const { activities: rawActivities = [] } = useActivities();

    // Dedupe Locations by Name
    const locations = useMemo(() => {
        const seen = new Set();
        return rawLocations.filter(loc => {
            const name = loc.name.trim().toLowerCase();
            if (seen.has(name)) return false;
            seen.add(name);
            return true;
        });
    }, [rawLocations]);

    // Dedupe Activities by Name
    const activities = useMemo(() => {
        const seen = new Set();
        return rawActivities.filter(act => {
            const name = act.name.trim().toLowerCase();
            if (seen.has(name)) return false;
            seen.add(name);
            return true;
        });
    }, [rawActivities]);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between px-1">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 mb-1">Filter Your Stay</span>
                </div>
                <button
                    onClick={handleReset}
                    className="group flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-sky-600 transition-all duration-300"
                >
                    <RotateCcw size={14} className="group-hover:-rotate-180 transition-transform duration-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Reset</span>
                </button>
            </div>

            {/* LOCATION FILTER */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sky-600 dark:text-sky-400">
                        <MapPin size={16} />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">Location</h3>
                </div>
                <div className="relative">
                    <select
                        value={filters.location_id || ""}
                        onChange={(e) => handleLocationChange(e.target.value || null)}
                        className="w-full p-3 pr-10 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-sky-500 transition-colors appearance-none cursor-pointer"
                    >
                        <option value="">All Locations</option>
                        {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                </div>
            </div>

            {/* ACTIVITY FILTER */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sky-600 dark:text-sky-400">
                        <Star size={16} />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">Preferred Activity</h3>
                </div>
                <div className="relative">
                    <select
                        value={filters.activity_id || ""}
                        onChange={(e) => handleActivityChange(e.target.value || null)}
                        className="w-full p-3 pr-10 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:border-sky-500 transition-colors appearance-none cursor-pointer"
                    >
                        <option value="">All Activities</option>
                        {activities.map((act) => (
                            <option key={act.id} value={act.id}>{act.name}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                </div>
            </div>

            {/* CAPACITY (GUESTS) */}
            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sky-600 dark:text-sky-400">
                        <Users size={16} />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">Number of Guests</h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 4, 6, 8, 10].map((guest) => {
                        const active = filters.capacity === guest;
                        return (
                            <button
                                key={guest}
                                onClick={() => handleCapacityChange(guest)}
                                className={`
                                    h-11 rounded-lg border font-black text-sm transition-all duration-300
                                    flex items-center justify-center relative overflow-hidden
                                    ${active
                                        ? "bg-sky-600 border-sky-600 text-white"
                                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-sky-300 hover:text-sky-600"
                                    }
                                `}
                            >
                                {guest}
                                {active && (
                                    <div className="absolute top-0 right-0 w-3 h-3 bg-white/20 rounded-bl-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* PRICE RANGE */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-sky-600 dark:text-sky-400">
                        <DollarSign size={16} />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">Price Range</h3>
                </div>

                <div className="flex justify-between items-end mb-2 px-1">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Min</span>
                        <span className="text-base font-black text-slate-900 dark:text-white">${filters?.price?.[0] ?? 0}</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Max</span>
                        <span className="text-base font-black text-slate-900 dark:text-white">${filters?.price?.[1] ?? 1000}</span>
                    </div>
                </div>

                <div className="px-2">
                    <Range
                        step={STEP}
                        min={MIN}
                        max={MAX}
                        values={filters?.price || [MIN, MAX]}
                        onChange={handlePriceChange}
                        renderTrack={({ props, children }) => (
                            <div
                                onMouseDown={props.onMouseDown}
                                onTouchStart={props.onTouchStart}
                                className="h-7 flex w-full"
                            >
                                <div
                                    ref={props.ref}
                                    className="h-1.5 w-full rounded-full self-center"
                                    style={{
                                        background: getTrackBackground({
                                            values: filters?.price || [MIN, MAX],
                                            colors: ["#e2e8f0", "#0284c7", "#e2e8f0"],
                                            min: MIN,
                                            max: MAX,
                                        }),
                                    }}
                                >
                                    {children}
                                </div>
                            </div>
                        )}

                        renderThumb={({ props, isDragged }) => {
                            return (
                                <div
                                    {...props}
                                    className={`
                                        h-5 w-5 rounded-full bg-white border-2 border-sky-600 shadow-sm
                                        flex items-center justify-center outline-none transition-transform
                                        ${isDragged ? "scale-110" : "hover:scale-105"}
                                    `}
                                />
                            );
                        }}
                    />
                </div>
            </div>

            <button
                onClick={() => applyFilters()}
                className="
                    w-full rounded-lg bg-slate-900 dark:bg-sky-600 py-4 text-white font-black text-[10px] uppercase tracking-[0.2em]
                    hover:bg-sky-500 transition-all duration-300
                    flex items-center justify-center gap-2
                "
            >
                {isSearching ? "Update Results" : "Search Cabins"}
            </button>
        </div >
    );
};

export default ExploreFilters;
