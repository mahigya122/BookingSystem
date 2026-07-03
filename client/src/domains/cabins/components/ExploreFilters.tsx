import { useMemo, useState } from "react";
import { Range, getTrackBackground } from "react-range";
import { useFilterActions } from "../../../hooks/useFilterActions";
import { useLocations } from "@shared/hooks/useLocations";
import { useActivities } from "@shared/hooks/useActivities";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  RotateCcw,
  Check,
} from "lucide-react";

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
    isSearching,
  } = useFilterActions();

  const [localPrice, setLocalPrice] = useState<[number, number]>(
    filters?.price || [MIN, MAX],
  );
  const [prevPrice, setPrevPrice] = useState<[number, number] | null>(null);

  // Synchronize localPrice with external filters.price (e.g. on reset) without useEffect to avoid cascading renders.
  if (
    filters?.price &&
    (prevPrice === null ||
      prevPrice[0] !== filters.price[0] ||
      prevPrice[1] !== filters.price[1])
  ) {
    setPrevPrice(filters.price);
    setLocalPrice(filters.price);
  }

  const { locations: rawLocations = [] } = useLocations();
  const { activities: rawActivities = [] } = useActivities();

  // Dedupe Locations by Name
  const locations = useMemo(() => {
    const seen = new Set();
    return rawLocations.filter((loc) => {
      const name = loc.name.trim().toLowerCase();
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });
  }, [rawLocations]);

  // Dedupe Activities by Name
  const activities = useMemo(() => {
    const seen = new Set();
    return rawActivities.filter((act) => {
      const name = act.name.trim().toLowerCase();
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });
  }, [rawActivities]);

  const hasLocation = Boolean(filters.location_id);
  const hasActivity = Boolean(filters.activity_id);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
          Filter Your Stay
        </span>
        <button
          onClick={handleReset}
          className="text-[10px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors flex items-center gap-1"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* LOCATION FILTER */}
      <div className="space-y-2">
        <div className="flex items-center">
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">
            Location
          </h3>
        </div>
        <div
          className={`relative rounded-2xl border-2 transition-colors duration-200 ${hasLocation ? "border-sky-500" : "border-slate-200 dark:border-slate-800"}`}
        >
          <select
            value={filters.location_id || ""}
            onChange={(e) => handleLocationChange(e.target.value || null)}
            className={`w-full p-3 pr-10 rounded-2xl bg-transparent text-sm font-bold outline-none appearance-none cursor-pointer ${hasLocation ? "text-sky-700 dark:text-sky-300" : "text-slate-700 dark:text-slate-300"}`}
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          <div
            className={`absolute inset-y-0 right-3 flex items-center pointer-events-none ${hasLocation ? "text-sky-500" : "text-slate-400"}`}
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* ACTIVITY FILTER */}
      <div className="space-y-2">
        <div className="flex items-center">
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">
            Preferred Activity
          </h3>
        </div>
        <div
          className={`relative rounded-2xl border-2 transition-colors duration-200 ${hasActivity ? "border-sky-500" : "border-slate-200 dark:border-slate-800"}`}
        >
          <select
            value={filters.activity_id || ""}
            onChange={(e) => handleActivityChange(e.target.value || null)}
            className={`w-full p-3 pr-10 rounded-2xl bg-transparent text-sm font-bold outline-none appearance-none cursor-pointer ${hasActivity ? "text-sky-700 dark:text-sky-300" : "text-slate-700 dark:text-slate-300"}`}
          >
            <option value="">All Activities</option>
            {activities.map((act) => (
              <option key={act.id} value={act.id}>
                {act.name}
              </option>
            ))}
          </select>
          <div
            className={`absolute inset-y-0 right-3 flex items-center pointer-events-none ${hasActivity ? "text-sky-500" : "text-slate-400"}`}
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* CAPACITY (GUESTS) */}
      <div className="space-y-3">
        <div className="flex items-center">
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">
            Number of Guests
          </h3>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((guest) => {
            const active = filters.capacity === guest;
            return (
              <button
                key={guest}
                onClick={() => handleCapacityChange(guest)}
                className={`
                                    h-10 px-4 rounded-full border-2 font-bold text-sm
                                    transition-all duration-200 ease-out
                                    flex items-center gap-1.5
                                    active:scale-[0.95]
                                    ${
                                      active
                                        ? "bg-sky-50 dark:bg-sky-950/40 border-sky-500 text-sky-700 dark:text-sky-300"
                                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                                    }
                                `}
              >
                {active && <Check size={13} strokeWidth={3} />}
                {guest}
              </button>
            );
          })}
        </div>
      </div>

      {/* PRICE RANGE */}
      <div className="space-y-3">
        <div className="flex items-center">
          <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">
            Price Range
          </h3>
        </div>

        <div className="flex justify-between items-end px-1">
          <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
            ${localPrice[0]}
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
            ${localPrice[1]}
          </span>
        </div>

        <div className="px-2">
          <Range
            step={STEP}
            min={MIN}
            max={MAX}
            values={localPrice}
            onChange={(values) => setLocalPrice([values[0], values[1]])}
            onFinalChange={(values) =>
              handlePriceChange([values[0], values[1]])
            }
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
                      values: localPrice,
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
                                        h-5 w-5 rounded-full bg-white border-2 border-sky-600
                                        flex items-center justify-center outline-none
                                        transition-transform duration-150 ease-out
                                        ${isDragged ? "scale-125" : "hover:scale-110"}
                                    `}
                />
              );
            }}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => applyFilters()}
          className="
                        w-full rounded-2xl py-4 text-white font-black text-[10px] uppercase tracking-[0.2em]
                        bg-sky-600 hover:bg-sky-700
                        active:scale-[0.98]
                        transition-all duration-200 ease-out
                        flex items-center justify-center gap-2 cursor-pointer
                    "
        >
          {isSearching ? "Update Results" : "Search Cabins"}
        </button>
      </div>
    </div>
  );
};

export default ExploreFilters;
