import { useState } from "react";

import { useGuests, useDeleteGuest } from "@shared/hooks";

import GuestSubnav from "../components/guest/GuestSubnav";
import GuestTable from "../components/guest/GuestTable";
import GuestPagination from "../components/guest/GuestPagination";
import EditGuestModal from "../components/guest/EditGuestModal";

import { useFilteredGuests } from "@shared/hooks/guests/useFilteredGuests";
import { usePagination } from "@shared/hooks/usePagination";
import type { Guest, GuestSortType } from "@shared/types/guest";

const Guests = () => {
  const { guests = [], isLoading } = useGuests();
  const { removeGuest } = useDeleteGuest();

  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<GuestSortType>("recent");

  const filteredGuests = useFilteredGuests({
    guests,
    search,
    sort,
  });

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination<Guest>(filteredGuests);

  const handleDelete = (id: string) => {
    const confirmed = confirm("Delete this guest?");

    if (!confirmed) return;

    removeGuest(id);
  };

  if (isLoading) {
    return <p>Loading guests.....</p>;
  }

  return (
    <div className="px-6 md:px-0 space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Guest Directory</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage guest records and communication details.</p>
      </div>

      <GuestSubnav
        onSearchChange={setSearch}
        onSortChange={setSort}
        currentSort={sort}
      />

      <div className="card overflow-hidden">
        <GuestTable
          guests={paginatedData}
          onDelete={handleDelete}
          onEdit={setEditingGuest}
        />

        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <GuestPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {editingGuest && (
        <EditGuestModal
          key={editingGuest.id}
          guest={editingGuest}
          onClose={() => setEditingGuest(null)}
        />
      )}
    </div>
  );
};

export default Guests;
