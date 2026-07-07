/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, Suspense } from "react";

import { useGuests, useDeleteGuest } from "@shared/hooks";
import GuestTable from "../components/guest/GuestTable";
import AdminPagination from "../components/AdminPagination";
import { EditGuestModal } from "@shared/modals/lazyModals";
import ModalSpinner from "@shared/components/ui/ModalSpinner";

import type { Guest, GuestSortType } from "@shared/types/guest";

const Guests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<GuestSortType>("recent");
  const [sortOpen, setSortOpen] = useState(false);

  const { guests = [], totalCount = 0, isLoading } = useGuests(currentPage, 15, search, sort);
  const { removeGuest } = useDeleteGuest();

  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const totalPages = Math.ceil(totalCount / 15);

  const sortLabelMap: Record<GuestSortType, string> = {
    recent: "Recently Added",
    earlier: "Earlier",
    "name-az": "Name A-Z",
    "name-za": "Name Z-A",
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sort]);

  const handleDelete = (id: string) => {
    const confirmed = confirm("Delete this guest?");
    if (!confirmed) return;
    removeGuest(id);
  };

  return (
    <div className="space-y-6 animate-slide-up pb-2 px-2 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
         <p
        className="text-sky-500 text-sm font-bold block"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Guest Directory
      </p>
        <h1 className="text-2xl
          md:text-3xl
          font-black
          text-slate-900
          dark:text-white
          tracking-tighter

          mt-0">Guest Directory</h1>
        <p className="text-xs
          md:text-sm
          text-slate-500
          dark:text-slate-400
          max-w-lg
          leading-relaxed

          mt-0">Manage guest records and communication details.</p>
      </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* SEARCH */}
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Search directory..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full sm:w-64 outline-none transition-all text-xs font-bold focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 placeholder-slate-500"
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
              onClick={() => setSortOpen(!sortOpen)}
              className="font-bold text-xs outline-none transition-all cursor-pointer w-full sm:w-auto flex items-center justify-between gap-2 px-3.5 h-8 bg-[#E2F8E9] text-[#374151] border border-[#C2F0CD] hover:bg-[#D4F6DF] rounded-full active:scale-95 shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
            >
              <span>{sortLabelMap[sort] || "Sort"}</span>
              <span className={`text-[9px] text-[#4B5563] transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {sortOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                <div 
                  className="absolute right-0 z-50 mt-1.5 w-full sm:w-48 overflow-hidden rounded-2xl border border-[#C2F0CD] bg-[#E2F8E9] shadow-xl animate-in fade-in zoom-in-95 duration-150"
                >
                  {(Object.keys(sortLabelMap) as GuestSortType[]).map((key) => {
                    const isSelected = sort === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setSort(key);
                          setSortOpen(false);
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

      <div className="mt-6 card overflow-hidden">
        <GuestTable
          guests={guests}
          onDelete={handleDelete}
          onEdit={setEditingGuest}
          isLoading={isLoading}
        />

        <div className="px-2 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            label="Record Page"
          />
        </div>
      </div>

      {editingGuest && (
        <Suspense fallback={<ModalSpinner />}>
          <EditGuestModal
            key={editingGuest.id}
            guest={editingGuest}
            onClose={() => setEditingGuest(null)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Guests;
