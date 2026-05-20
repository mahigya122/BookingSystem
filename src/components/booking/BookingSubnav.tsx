import { useState } from "react";
import type { BookingStatus, SortType } from "../../types/booking";

interface Props {
  onFilterChange?: (status: BookingStatus) => void;
  onSortChange?: (sort: SortType) => void;
  onSearchChange?: (search: string) => void;
  currentSort?: SortType;
}

const BookingSubnav = ({ onFilterChange, onSortChange, onSearchChange, currentSort }: Props) => {
    const [ activeFilter, setActiveFilter ] = useState<BookingStatus>("all");
    const [ sortOpen, setSortOpen ] = useState(false);
    const [ search, setSearch] = useState("");

    const handleFilter = (value: BookingStatus) => {
      setActiveFilter(value);
      onFilterChange?.(value);
    };

    const handleSearch = (value: string) => {
      setSearch(value);
      onSearchChange?.(value);
    };

    return (
    <div className="flex items-center justify-between bg-white border-b px-6 py-3">
      
      {/* LEFT: FILTERS */}
      <div className="flex items-center gap-2">
        {[
          { label: "All", value: "all" },
          { label: "Checked-out", value: "checked-out" },
          { label: "Checked-in", value: "checked-in" },
          { label: "Booked", value: "booked" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => handleFilter(item.value as BookingStatus)}
            className={`px-3 py-1 rounded-full text-sm transition
              ${
                activeFilter === item.value
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>
        
    {/* RIGHT SIDE */}
    <div className="flex items-center gap-3">

    {/* SEARCH */}
    <input
    type="text"
    value={search}
    onChange={(e) => handleSearch(e.target.value)}
    placeholder="Search guest..."
    className="px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
    />

    {/* SORT DROPDOWN */}
    <div className="relative">
        <button
        onClick = {()=> setSortOpen((prev) => !prev)}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
        >
          {currentSort} ▾
        </button>

    {sortOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg overflow-hidden">
            {["recent", "earlier", "price-high", "price-low"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => {
                    onSortChange?.(item as SortType);
                    setSortOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {item}
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