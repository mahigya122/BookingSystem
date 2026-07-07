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

  const sortLabelMap: Record<GuestSortType, string> = {
    recent: "Recently Added",
    earlier: "Earlier",
    "name-az": "Name A-Z",
    "name-za": "Name Z-A",
  };

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
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setOpen(!open)}
            className="font-bold text-xs outline-none transition-all cursor-pointer w-full sm:w-auto flex items-center justify-between gap-2 px-3.5 h-8 bg-[#E2F8E9] text-[#374151] border border-[#C2F0CD] hover:bg-[#D4F6DF] rounded-full active:scale-95 shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
          >
            <span>{sortLabelMap[currentSort] || "Sort"}</span>
            <span className={`text-[9px] text-[#4B5563] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div 
                className="absolute right-0 z-50 mt-1.5 w-full sm:w-48 overflow-hidden rounded-2xl border border-[#C2F0CD] bg-[#E2F8E9] shadow-xl animate-in fade-in zoom-in-95 duration-150"
              >
                {(Object.keys(sortLabelMap) as GuestSortType[]).map((key) => {
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
                      {sortLabelMap[key]}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
