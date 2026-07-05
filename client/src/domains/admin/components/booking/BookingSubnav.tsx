import { useState, useEffect } from "react";
import { Check } from "lucide-react";
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

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange?.(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, onSearchChange]);

  const handleFilter = (value: BookingStatus) => {
    setActiveFilter(value);
    onFilterChange?.(value);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">

      {/* LEFT: FILTERS */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/80 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 rounded-xl shadow-sm">
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
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${activeFilter === item.value
                ? "text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
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
            className="w-full h-8 px-3 border border-emerald-250 dark:border-emerald-800 rounded-xl text-xs bg-emerald-50 dark:bg-emerald-950/20 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold placeholder-slate-400 text-slate-900 dark:text-white"
          />
        </div>

        {/* SORT DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setSortOpen((prev) => !prev)}
            className="h-8 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-800 flex items-center justify-between gap-2 px-3.5 rounded-xl text-xs font-bold text-slate-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors shadow-sm active:scale-95 min-w-[120px]"
          >
            <span className="capitalize">{currentSort?.replace('-', ' ')}</span>
            <span className={`text-[9px] text-slate-500 transition-transform duration-250 ${sortOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {sortOpen && (
            <div className="absolute right-0 mt-1.5 w-48 overflow-hidden rounded-xl border border-emerald-250 dark:border-emerald-800 bg-white dark:bg-slate-950 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              {["recent", "earlier", "price-high", "price-low"].map(
                (item) => {
                  const isSelected = currentSort === item;
                  return (
                    <button
                      key={item}
                      onClick={() => {
                        onSortChange?.(item as SortType);
                        setSortOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-xs font-bold transition-colors border-b last:border-0 border-slate-100 dark:border-slate-850 capitalize ${
                        isSelected
                          ? "text-emerald-700 dark:text-emerald-300 bg-emerald-100/50 dark:bg-emerald-900/30"
                          : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span>{item.replace('-', ' ')}</span>
                      {isSelected && <Check size={12} className="text-emerald-600 dark:text-emerald-400" />}
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSubnav;
