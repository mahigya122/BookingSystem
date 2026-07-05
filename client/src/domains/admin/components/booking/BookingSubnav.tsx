import { useState, useEffect } from "react";
import type { BookingStatus, SortType } from "@shared/types/booking";

interface Props {
  onFilterChange?: (status: BookingStatus) => void;
  onSortChange?: (sort: SortType) => void;
  onSearchChange?: (search: string) => void;
  currentSort?: SortType;
}

const BookingSubnav = ({ onFilterChange, onSortChange, onSearchChange, currentSort }: Props) => {
  const [activeFilter, setActiveFilter] = useState<BookingStatus>("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

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
            className="w-full outline-none transition-all text-xs font-bold focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 placeholder-slate-500"
            style={{
              backgroundColor: "#F4F0FF",
              color: "#374151",
              borderColor: "#E4D9FF",
              borderWidth: "1px",
              borderStyle: "solid",
              height: "32px",
              borderRadius: "9999px",
              paddingTop: "0px",
              paddingBottom: "0px",
              paddingLeft: "16px",
              paddingRight: "16px",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.02)"
            }}
          />
        </div>

        {/* SORT DROPDOWN */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setOpen(!open)}
            className="font-bold text-xs outline-none transition-all cursor-pointer min-w-[120px] w-full sm:w-auto flex items-center justify-between gap-2 px-3.5 h-8 bg-[#E2F8E9] text-[#374151] border border-[#C2F0CD] hover:bg-[#D4F6DF] rounded-full active:scale-95 shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
          >
            <span className="capitalize">{currentSort?.replace('-', ' ')}</span>
            <span className={`text-[9px] text-[#4B5563] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div 
                className="absolute right-0 z-50 mt-1.5 w-full sm:w-48 overflow-hidden rounded-2xl border border-[#C2F0CD] bg-[#E2F8E9] shadow-xl animate-in fade-in zoom-in-95 duration-150"
              >
                {["recent", "earlier", "price-high", "price-low"].map((item) => {
                  const isSelected = currentSort === item;
                  return (
                    <button
                      key={item}
                      onClick={() => {
                        onSortChange?.(item as SortType);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all border-b last:border-0 border-[#C2F0CD]/40 flex items-center justify-between ${
                        isSelected 
                          ? "bg-[#C6F0D1] text-[#166534]" 
                          : "text-[#374151] hover:bg-[#D4F6DF]"
                      }`}
                    >
                      <span className="capitalize">{item.replace("-", " ")}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSubnav;
