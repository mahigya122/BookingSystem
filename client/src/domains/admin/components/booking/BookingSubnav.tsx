import { useState } from "react";
import type { BookingStatus, SortType } from "@shared/types/booking";

interface Props {
  onFilterChange?: (status: BookingStatus) => void;
  onSortChange?: (sort: SortType) => void;
  onSearchChange?: (search: string) => void;
  currentSort?: SortType;
}

const BookingSubnav = ({ onFilterChange, onSortChange, onSearchChange, currentSort }: Props) => {
  const [activeFilter, setActiveFilter] = useState<BookingStatus>("all");
  const [sortOpen, setSortOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleFilter = (value: BookingStatus) => {
    setActiveFilter(value);
    onFilterChange?.(value);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearchChange?.(value);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">

      {/* LEFT: FILTERS */}
      <div className="flex items-center gap-1 p-1 surface-panel-strong rounded-2xl shadow-sm">
        {[
          { label: "All Bookings", value: "all" },
          { label: "Checked Out", value: "checked-out" },
          { label: "Checked In", value: "checked-in" },
          { label: "Booked", value: "booked" },
          { label: "Cancelled", value: "cancelled" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => handleFilter(item.value as BookingStatus)}
            className={`px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${activeFilter === item.value
                ? "text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/5"
              }`}
            style={
              activeFilter === item.value
                ? {
                  backgroundImage:
                    "linear-gradient(90deg, var(--app-primary), var(--app-secondary))",
                }
                : undefined
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3 w-full md:w-auto">

        {/* SEARCH */}
        <div className="relative flex-1 md:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Find guest by name..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></span>
        </div>

        {/* SORT DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setSortOpen((prev) => !prev)}
            className="btn btn-secondary flex items-center gap-2 px-4 py-2 rounded-2xl text-sm shadow-sm transition-all active:scale-95"
          >
            <span className="capitalize">{currentSort?.replace('-', ' ')}</span>
            <span className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}>▾</span>
          </button>

          {sortOpen && (
            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-[color-mix(in_srgb,var(--app-surface-elevated)_95%,black)] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              {["recent", "earlier", "price-high", "price-low"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => {
                      onSortChange?.(item as SortType);
                      setSortOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors border-b last:border-0 border-slate-100/80 dark:border-slate-800/50 capitalize"
                  >
                    {item.replace('-', ' ')}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSubnav;
