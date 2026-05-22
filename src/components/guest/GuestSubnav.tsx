import { useState } from "react";
import type { GuestSortType } from "../../types/guest";

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
    <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.45)] backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-indigo-500">
          Overview
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          Guests
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-500">
          Search, sort, and manage guest records.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearchChange(e.target.value);
          }}
          placeholder="Search guests..."
          className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 md:w-64"
        />

        <div className="relative">
          <button
            onClick={() => setOpen((p) => !p)}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            {sortLabel(currentSort)}
            <span className="text-xs text-gray-500">▾</span>
          </button>

          {open && (
            <div className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
              <button
                onClick={() => handleSort("recent")}
                className="block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100"
              >
                Recent
              </button>

              <button
                onClick={() => handleSort("earlier")}
                className="block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100"
              >
                Earlier
              </button>

              <button
                onClick={() => handleSort("name-az")}
                className="block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100"
              >
                Name A-Z
              </button>

              <button
                onClick={() => handleSort("name-za")}
                className="block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100"
              >
                Name Z-A
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}