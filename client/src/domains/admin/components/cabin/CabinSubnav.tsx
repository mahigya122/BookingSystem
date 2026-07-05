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
  const [open, setOpen] = useState(false);

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
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setOpen(!open)}
            className="font-bold text-xs outline-none transition-all cursor-pointer min-w-[150px] w-full sm:w-auto flex items-center justify-between gap-2 px-3.5 h-8 bg-[#E2F8E9] text-[#374151] border border-[#C2F0CD] hover:bg-[#D4F6DF] rounded-full active:scale-95 shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
          >
            <span>{sortLabelMap[currentSort] || "Sort"}</span>
            <span className={`text-[9px] text-[#4B5563] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div 
                className="absolute right-0 z-50 mt-1.5 w-full sm:w-52 overflow-hidden rounded-2xl border border-[#C2F0CD] bg-[#E2F8E9] shadow-xl animate-in fade-in zoom-in-95 duration-150"
              >
                {Object.entries(sortLabelMap).map(([key, label]) => {
                  const isSelected = currentSort === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        onSortChange(key);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all border-b last:border-0 border-[#C2F0CD]/40 flex items-center justify-between ${
                        isSelected 
                          ? "bg-[#C6F0D1] text-[#166534]" 
                          : "text-[#374151] hover:bg-[#D4F6DF]"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </>
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
