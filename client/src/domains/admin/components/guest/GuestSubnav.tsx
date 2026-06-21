import { useState, useEffect } from "react";
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
      <div className="flex items-center gap-1 p-1 surface-panel-strong rounded-2xl shadow-sm">
        <button
          className="px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider text-white shadow-sm"
          style={{ background: "linear-gradient(135deg, var(--app-primary), var(--app-secondary))" }}
        >
            All Guest Records
        </button>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search directory..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-950 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></span>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen((p) => !p)}
            className="btn btn-secondary flex items-center gap-2 px-4 py-2 rounded-2xl text-sm shadow-sm transition-all active:scale-95"
          >
            <span className="text-xs">{sortLabel(currentSort)}</span>
            <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
          </button>

          {open && (
            <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-[color-mix(in_srgb,var(--app-surface-elevated)_95%,black)] shadow-xl animate-in fade-in zoom-in-95 duration-150">
              {["recent", "earlier", "name-az", "name-za"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSort(s as GuestSortType)}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-primary-600 dark:hover:text-primary-400 border-b last:border-0 border-slate-100 dark:border-slate-800/50"
                >
                  {sortLabel(s as GuestSortType)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
