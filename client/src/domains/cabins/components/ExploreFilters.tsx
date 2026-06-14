import { Range, getTrackBackground } from "react-range";
import { useFilterActions } from "../../../hooks/useFilterActions";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Users, DollarSign, RotateCcw } from "lucide-react";

const STEP = 10;
const MIN = 50;
const MAX = 1000;

const ExploreFilters = () => {
    const {
        filters,
        handlePriceChange,
        handleCapacityChange,
        clearFilters,
        applyFilters
    } = useFilterActions();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between px-1">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500 mb-1">Filter by</span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Your Stay</h2>
                </div>
                <button
                    onClick={clearFilters}
                    className="group flex items-center gap-1.5 p-2 rounded-xl hover:bg-sky-50 dark:hover:bg-sky-900/20 text-slate-400 hover:text-sky-600 transition-all duration-300"
                >
                    <RotateCcw size={14} className="group-hover:-rotate-180 transition-transform duration-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Reset</span>
                </button>
            </div>

            {/* PRICE RANGE */}
            <div className="group rounded-[2rem] border border-sky-50 dark:border-sky-900/10 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl p-7 shadow-xl shadow-sky-900/5 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-900/30 text-sky-500">
                        <DollarSign size={16} />
                    </div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">Price Nightly</h3>
                </div>

                <div className="flex justify-between items-end mb-6">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Min</span>
                        <span className="text-lg font-black text-sky-600 dark:text-sky-400">${filters?.price?.[0] ?? 0}</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Max</span>
                        <span className="text-lg font-black text-sky-600 dark:text-sky-400">${filters?.price?.[1] ?? 1000}</span>
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
                                            colors: ["#f1f5f9", "#0ea5e9", "#f1f5f9"],
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
                                        h-6 w-6 rounded-xl bg-white border border-sky-500 shadow-xl 
                                        flex items-center justify-center outline-none transition-transform
                                        ${isDragged ? "scale-125 border-sky-600" : "hover:scale-110"}
                                    `}
                                >
                                    <div className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                                </div>
                            );
                        }}
                    />
                </div>
                <p className="mt-4 text-[10px] font-bold text-slate-400 text-center italic">
                    Average price is $180/night
                </p>
            </div>

            {/* CAPACITY BUTTONS */}
            <div className="group rounded-[2rem] border border-sky-50 dark:border-sky-900/10 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl p-7 shadow-xl shadow-sky-900/5 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500">
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
                                    h-12 rounded-2xl border font-black text-sm transition-all duration-300
                                    flex items-center justify-center relative overflow-hidden group/btn
                                    ${active
                                        ? "bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/20 scale-105"
                                        : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-sky-300 hover:text-sky-600"
                                    }
                                `}
                            >
                                {guest}
                                {active && (
                                    <div className="absolute top-0 right-0 w-4 h-4 bg-white/20 rounded-bl-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
                <p className="mt-6 text-[10px] font-black text-slate-400 text-center uppercase tracking-widest">
                    Select group size
                </p>
            </div>

            <button
                onClick={() => applyFilters()}
                className="
                    w-full rounded-[1.5rem] bg-slate-900 dark:bg-sky-600 py-4 text-white font-black text-xs uppercase tracking-[0.2em]
                    hover:bg-sky-500 hover:shadow-2xl hover:shadow-sky-500/30 hover:-translate-y-1 active:scale-95 transition-all duration-500
                    flex items-center justify-center gap-2
                "
            >
                Search Cabins
            </button>
        </div >
    );
};

export default ExploreFilters;
