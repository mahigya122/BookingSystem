import { useState } from "react";

import { useGuests } from "../authentication/useGuests";
import { useDeleteGuest } from "../authentication/useDeleteGuest";

import GuestSubnav from "../components/guest/GuestSubnav";
import GuestTable from "../components/guest/GuestTable";
import GuestPagination from "../components/guest/GuestPagination";
import CreateGuestModal from "../components/guest/CreateGuestModal";
import EditGuestModal from "../components/guest/EditGuestModal";

import { useFilteredGuests } from "../hooks/useFilteredGuests";
import { usePagination } from "../hooks/usePagination";
import type { Guest, GuestSortType } from "../types/guest";

const Guests = () => {
  const { guests = [], isLoading } = useGuests();
  const { removeGuest } = useDeleteGuest();

  const [showCreate, setShowCreate] = useState(false);
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Guests</h1>

      <GuestSubnav
        onSearchChange={setSearch}
        onSortChange={setSort}
        currentSort={sort}
        onAddGuest={() => setShowCreate(true)}
      />

      <GuestTable
        guests={paginatedData}
        onDelete={handleDelete}
        onEdit={setEditingGuest}
      />

      <GuestPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {showCreate && (
        <CreateGuestModal onClose={() => setShowCreate(false)} />
      )}

      {editingGuest && (
        <EditGuestModal
          guest={editingGuest}
          onClose={() => setEditingGuest(null)}
        />
      )}
    </div>
  );
};

export default Guests;