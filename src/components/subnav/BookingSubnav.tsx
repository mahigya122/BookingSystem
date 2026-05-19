import { useState } from "react";

type StatusFilter = "all" | "checked-out" | "checked-in" | "booked";
type SortBy = "recent" | "earlier" | "price-high" | "price-low";

interface props {
  onFilterChange?: (status: StatusFilter) => void;
  onSortChange?: (sort: SortBy) => void;
  onSearchChange?: (search: string) => void;
  currentSort?: SortBy;
}

const BookingSubnav= ({ onFilterChange , onSortChange, onSearchChange, currentSort }: props) => {
    const [ activeFilter, setActiveFilter ] = useState<StatusFilter>("all");
    const [ sortOpen, setSortOpen ] = useState(false);
    const [ search, setSearch] = useState("");

    const handleFilter = (value: StatusFilter) => {
        setActiveFilter(value);
        onFilterChange?.(value);
    };

    const handleSort = (value: SortBy) => {
      onSortChange?.(value);
      setSortOpen(false);
    };

    const handleSearch = (value: string) => {
      setSearch(value);
      onSearchChange?.(value);
    };

    const sortLabel = (s?: SortBy) => {
      switch (s) {
        case "recent":
          return "Recent first";
        case "earlier":
          return "Earlier first";
        case "price-high":
          return "Price high → low";
        case "price-low":
          return "Price low → high";
        default:
          return "Sort";
      }
    };

    return (
    <div className="flex items-center justify-between bg-white border-b px-6 py-3">
      
      {/* LEFT: FILTERS */}
      <div className="flex items-center gap-2">
        {[
          { label: "All", value: "all" },
          { label: "checked-out", value: "checked-out"},
          { label: "checked_in", value: "checked-in"},
          { label: "booked", value: "booked"},
        ].map((item)=>(
          <button
            key={item.value}
            onClick= {() => handleFilter(item.value as StatusFilter)}
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
          {sortLabel(currentSort)} ▾
        </button>

    {sortOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => handleSort("recent")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Recent first
            </button>

            <button
              onClick={() => handleSort("earlier")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Earlier first
            </button>

            <button
              onClick={() => handleSort("price-high")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Price high → low
            </button>

            <button
              onClick={() => handleSort("price-low")}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Price low → high
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};
export default BookingSubnav;

