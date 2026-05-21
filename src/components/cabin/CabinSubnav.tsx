import { useState } from "react";

interface Props {
  onFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
  currentSort: string;
  onAddCabin: () => void;
}

const CabinSubnav = ({
  onFilterChange,
  onSortChange,
  currentSort,
  onAddCabin,
}: Props) => {
  const [active, setActive] = useState("all");
  const [sortOpen, setSortOpen] = useState(false);

  const sortLabelMap: Record<string, string> = {
    recent: "Recently Added",
    "price-high": "Price High -> Low",
    "price-low": "Price Low -> High",
    "capacity-high": "Capacity High -> Low",
    "capacity-low": "Capacity Low -> High",
  };

  const activeSortLabel = sortLabelMap[currentSort] || "Recently Added";

  const handleSort = (value: string) => {
    onSortChange(value);
    setSortOpen(false);
  };

  const handleFilter = (value: string) => {
    setActive(value);
    onFilterChange(value);
  };

  return (
    <div className="flex items-center justify-between bg-white border-b px-6 py-3">

      <div className="flex items-center gap-2">
        {[
          { label: "All", value: "all" },
          { label: "With Discount", value: "with-discount" },
          { label: "No Discount", value: "no-discount" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => handleFilter(item.value)}
            className={`px-3 py-1 rounded-full text-sm ${
              active === item.value
                ? "bg-indigo-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">

        <button
          onClick={onAddCabin}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Cabin
        </button>

        <div className="relative">

          <button
            onClick={() => setSortOpen((p) => !p)}
            className="bg-gray-100 px-4 py-2 rounded-lg"
          >
            {activeSortLabel} ▾
          </button>

          {sortOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-52">

              <button
                onClick={() => handleSort("recent")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Recently Added
              </button>

              <button
                onClick={() => handleSort("price-high")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Price High → Low
              </button>

              <button
                onClick={() => handleSort("price-low")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Price Low → High
              </button>

              <button
                onClick={() => handleSort("capacity-high")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Capacity High → Low
              </button>

              <button
                onClick={() => handleSort("capacity-low")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Capacity Low → High
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CabinSubnav;