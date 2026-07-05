import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import type { GuestSortType } from "@shared/types/guest";

interface Props {
  onSearchChange: (val: string) => void;
  onSortChange: (val: GuestSortType) => void;
  currentSort: GuestSortType;
}

export default function GuestSubnav({
  onSearchChange,
  onSortChange,
  currentSort,
}: Props) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, onSearchChange]);

  const sortLabel = (s: GuestSortType) => {
    switch (s) {
      case "recent":
        return "Recently Added";
      case "earlier":
        return "Earlier";
      case "name-az":
        return "Name A-Z";
      case "name-za":
        return "Name Z-A";
      default:
        return "Sort";
    }
  };

  const handleSort = (value: GuestSortType) => {
    onSortChange(value);
    setOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      {/* LEFT: TITLE CONTAINER */}
      <div className="flex items-center gap-1.5 p-1 bg-white/80 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 rounded-xl shadow-sm">
        <button
          className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white shadow-sm cursor-default"
          style={{ background: "linear-gradient(135deg, var(--app-primary), var(--app-secondary))" }}
        >
            All Guest Records
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* SEARCH */}
        <div className="relative flex-1 md:w-64">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search directory..."
            className="w-full h-8 px-3 border border-emerald-250 dark:border-emerald-800 rounded-xl text-xs bg-emerald-50 dark:bg-emerald-950/20 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold placeholder-slate-400 text-slate-900 dark:text-white"
          />
        </div>

        {/* SORT DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setOpen((p) => !p)}
            className="h-8 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-800 flex items-center justify-between gap-2 px-3.5 rounded-xl text-xs font-bold text-slate-900 dark:text-white hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors shadow-sm active:scale-95 min-w-[130px]"
          >
            <span>{sortLabel(currentSort)}</span>
            <span className={`text-[9px] text-slate-500 transition-transform duration-250 ${open ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {open && (
            <div className="absolute right-0 z-50 mt-1.5 w-48 overflow-hidden rounded-xl border border-emerald-250 dark:border-emerald-800 bg-white dark:bg-slate-950 shadow-xl animate-in fade-in zoom-in-95 duration-150">
              {["recent", "earlier", "name-az", "name-za"].map((s) => {
                const isSelected = currentSort === s;
                return (
                  <button
                    key={s}
                    onClick={() => handleSort(s as GuestSortType)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-xs font-bold transition-colors border-b last:border-0 border-slate-100 dark:border-slate-850 capitalize ${
                      isSelected
                        ? "text-emerald-700 dark:text-emerald-300 bg-emerald-100/50 dark:bg-emerald-900/30"
                        : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <span>{sortLabel(s as GuestSortType)}</span>
                    {isSelected && <Check size={12} className="text-emerald-600 dark:text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
