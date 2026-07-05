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

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, onSearchChange]);

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
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as GuestSortType)}
          className="font-bold text-xs outline-none transition-all cursor-pointer w-full sm:w-auto focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
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
          <option value="recent" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100" style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>Recently Added</option>
          <option value="earlier" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100" style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>Earlier</option>
          <option value="name-az" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100" style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>Name A-Z</option>
          <option value="name-za" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100" style={{ color: "#0f172a", backgroundColor: "#ffffff" }}>Name Z-A</option>
        </select>
      </div>
    </div>
  );
}
