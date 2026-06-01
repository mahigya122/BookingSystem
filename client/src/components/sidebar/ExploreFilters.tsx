import { DateRange } from "react-date-range";
import { Range } from "react-range";
import { useFilterActions } from "../../hooks/useFilterActions";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const ExploreFilters = () => {
    const {
        filters,
        handlePriceChange,
        handleCapacityChange,
        handleDateChange,
        clearFilters
    } = useFilterActions();

    const dateRangeForPicker = [
        {
            startDate: filters.dateRange.startDate || new Date(),
            endDate: filters.dateRange.endDate || new Date(),
            key: "selection",
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                    onClick={clearFilters}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                    Clear All
                </button>
            </div>

            {/* PRICE */}
            <div className="rounded-3xl border bg-white dark:bg-slate-900 p-5 shadow-lg">
                <h3 className="font-bold mb-4">Price Range</h3>

                <div className="flex justify-between text-sm font-semibold mb-4">
                    <span>${filters.price[0]}</span>
                    <span>${filters.price[1]}</span>
                </div>

                <Range
                    step={10}
                    min={50}
                    max={500}
                    values={filters.price}
                    onChange={handlePriceChange}
                    renderTrack={({ props, children }) => (
                        <div {...props} className="h-2 bg-slate-200 rounded-full">
                            {children}
                        </div>
                    )}
                    renderThumb={({ props }) => {
                        const { key, ...rest } = props;
                        return <div key={key} {...rest} className="h-5 w-5 rounded-full bg-emerald-600 shadow-lg" />
                    }}
                />
            </div>

            {/* CAPACITY */}
            <div className="rounded-3xl border bg-white dark:bg-slate-900 p-5 shadow-lg">
                <h3 className="font-bold mb-4">Guests</h3>

                <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((guest) => (
                        <button
                            key={guest}
                            onClick={() => handleCapacityChange(guest)}
                            className={`h-11 rounded-xl border font-semibold transition
              ${filters.capacity === guest
                                    ? "bg-emerald-600 text-white"
                                    : "hover:border-emerald-500"
                                }`}
                        >
                            {guest}
                        </button>
                    ))}
                </div>
            </div>

            {/* CALENDAR */}
            <div className="rounded-3xl border bg-white dark:bg-slate-900 p-5 shadow-lg overflow-hidden">
                <h3 className="font-bold mb-4">Stay Dates</h3>

                <div className="flex justify-center">
                    <DateRange
                        editableDateInputs
                        moveRangeOnFirstSelection={false}
                        ranges={dateRangeForPicker}
                        onChange={(item) => handleDateChange(item.selection)}
                        rangeColors={["#059669"]}
                    />
                </div>
            </div>

            <button
                className="w-full rounded-2xl bg-emerald-600 py-4 text-white font-bold hover:bg-emerald-700 shadow-xl shadow-emerald-900/10 transition-all active:scale-[0.98]"
            >
                Apply Filters
            </button>
        </div>
    );
};

export default ExploreFilters;
