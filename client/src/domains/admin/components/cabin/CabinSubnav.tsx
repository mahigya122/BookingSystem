import { useState } from "react";
import { Check } from "lucide-react";

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
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">

      {/* LEFT: FILTERS */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/80 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 rounded-xl shadow-sm">
        {[
          { label: "Show All", value: "all" },
          { label: "Promotional", value: "with-discount" },
          { label: "Standard", value: "no-discount" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => handleFilter(item.value)}
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
              active === item.value
                ? "text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            style={
              active === item.value
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
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        {/* SORT DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setSortOpen((p) => !p)}
            className="h-8 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-800 flex items-center justify-between gap-2 px-3.5 rounded-xl text-xs font-bold text-slate-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors shadow-sm active:scale-95 min-w-[150px]"
          >
            <span className="text-xs">{activeSortLabel}</span>
            <span className={`text-[9px] text-slate-500 transition-transform duration-250 ${sortOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {sortOpen && (
            <div className="absolute right-0 mt-1.5 w-52 overflow-hidden rounded-xl border border-emerald-250 dark:border-emerald-800 bg-white dark:bg-slate-950 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              {Object.entries(sortLabelMap).map(([key, label]) => {
                const isSelected = currentSort === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSort(key)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-xs font-bold transition-colors border-b last:border-0 border-slate-100 dark:border-slate-850 capitalize ${
                      isSelected
                        ? "text-emerald-700 dark:text-emerald-300 bg-emerald-100/50 dark:bg-emerald-900/30"
                        : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <span>{label}</span>
                    {isSelected && <Check size={12} className="text-emerald-600 dark:text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ADD CABIN BUTTON */}
        <button
          onClick={onAddCabin}
          className="h-8 flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-sky-600 dark:hover:bg-sky-400 dark:hover:text-white rounded-xl px-4 text-[10px] font-black uppercase tracking-widest transition-all duration-200 active:scale-95 shadow-sm"
        >
          Add New Unit
        </button>
      </div>
    </div>
  );
};

export default CabinSubnav;
