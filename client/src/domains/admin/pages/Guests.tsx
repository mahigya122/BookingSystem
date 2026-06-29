/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, Suspense } from "react";

import { useGuests, useDeleteGuest } from "@shared/hooks";

import GuestSubnav from "../components/guest/GuestSubnav";
import GuestTable from "../components/guest/GuestTable";
import AdminPagination from "../components/AdminPagination";
import { EditGuestModal } from "@shared/modals/lazyModals";
import ModalSpinner from "@shared/components/ui/ModalSpinner";

import type { Guest, GuestSortType } from "@shared/types/guest";

const Guests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<GuestSortType>("recent");

  const { guests, totalCount = 0, isLoading } = useGuests(currentPage, 15, search, sort);
  const safeGuests = Array.isArray(guests) ? guests : [];
  const { removeGuest } = useDeleteGuest();

  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const totalPages = Math.ceil(totalCount / 15);

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
          guests={safeGuests}
          onDelete={handleDelete}
          onEdit={setEditingGuest}
          isLoading={isLoading}
        />

        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
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
