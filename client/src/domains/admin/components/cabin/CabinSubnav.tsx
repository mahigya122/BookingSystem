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

  const sortLabelMap: Record<string, string> = {
    recent: "Recently Added",
    "price-high": "Price High -> Low",
    "price-low": "Price Low -> High",
    "capacity-high": "Capacity High -> Low",
    "capacity-low": "Capacity Low -> High",
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
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="font-bold text-xs outline-none transition-all cursor-pointer min-w-[150px] w-full sm:w-auto focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
          style={{
            backgroundColor: "#E2F8E9",
            color: "#374151",
            borderColor: "#C2F0CD",
            borderWidth: "1px",
            borderStyle: "solid",
            height: "32px",
            borderRadius: "9999px",
            paddingTop: "0px",
            paddingBottom: "0px",
            paddingLeft: "14px",
            paddingRight: "28px",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234B5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            backgroundSize: "12px",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.02)"
          }}
        >
          {Object.entries(sortLabelMap).map(([key, label]) => (
            <option key={key} value={key} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100" style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>
              {label}
            </option>
          ))}
        </select>

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
