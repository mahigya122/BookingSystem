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
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">

      <div className="flex items-center gap-1 p-1 surface-panel-strong rounded-2xl shadow-sm">
        {[
          { label: "Show All", value: "all" },
          { label: "Promotional", value: "with-discount" },
          { label: "Standard", value: "no-discount" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => handleFilter(item.value)}
            className={`px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${
              active === item.value
                ? "text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/5"
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

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setSortOpen((p) => !p)}
            className="btn btn-secondary flex items-center gap-2 px-4 py-2 rounded-2xl text-sm shadow-sm transition-all active:scale-95"
          >
            <span className="text-xs">{activeSortLabel}</span>
            <span className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}>▾</span>
          </button>

          {sortOpen && (
            <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-[color-mix(in_srgb,var(--app-surface-elevated)_95%,black)] shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                {Object.entries(sortLabelMap).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => handleSort(key)}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors border-b last:border-0 border-slate-100/80 dark:border-slate-800/50"
                    >
                        {label}
                    </button>
                ))}
            </div>
          )}
        </div>

        <button
          onClick={onAddCabin}
          className="btn btn-primary"
        >
          Add New Unit
        </button>
      </div>
    </div>
  );
};

export default CabinSubnav;