import { useState } from "react";
import { useMemo } from "react";

import { useCabins, useDeleteCabin } from "@shared/hooks/cabin";
import { useBookings } from "@shared/hooks/booking/useBookings";

import CabinSubnav from "../components/cabin/CabinSubnav";
import CabinTable from "../components/cabin/CabinTable";
import CabinPagination from "../components/cabin/CabinPagination";
import CreateCabinModal from "../components/cabin/CreateCabinModal";
import EditCabinModal from "../components/cabin/EditCabinModal";
import CabinDetailModal from "../components/cabin/CabinDetailModal";
import type { CabinDetailSection } from "../components/cabin/CabinRow";

import { useFilteredCabins } from "@shared/hooks/cabin/useFilteredCabins";
import { usePagination } from "@shared/hooks/usePagination";
import type { Cabin as CabinType } from "@shared/types/cabin";
import type { Booking } from "@shared/types/booking";

const Cabins = () => {
  const { cabins = [], isLoading } = useCabins();
  const { bookings = [], isLoading: isBookingsLoading } = useBookings();

  const { removeCabin } = useDeleteCabin();

  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");

  const [showCreate, setShowCreate] = useState(false);

  const [editingCabin, setEditingCabin] = useState<CabinType | null>(null);
  const [selectedCabin, setSelectedCabin] = useState<CabinType | null>(null);
  const [selectedSection, setSelectedSection] = useState<CabinDetailSection>("overview");

  const filteredCabins = useFilteredCabins(
    cabins,
    filter,
    sort
  );

  const activeBookingByCabinId = useMemo(() => {
    const active = bookings.filter(
      (booking) => booking.status === "booked" || booking.status === "checked-in"
    );

    return active.reduce<Record<string, Booking>>((acc, booking) => {
      const existing = acc[booking.cabin_id];

      if (!existing) {
        acc[booking.cabin_id] = booking;
        return acc;
      }

      const existingTime = new Date(existing.created_at ?? existing.start_date).getTime();
      const currentTime = new Date(booking.created_at ?? booking.start_date).getTime();

      if (currentTime > existingTime) {
        acc[booking.cabin_id] = booking;
      }

      return acc;
    }, {});
  }, [bookings]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(filteredCabins);

  const handleDelete = (id: string) => {
    const conformDelete = confirm(
      "Delete this cabin?"
    );

    if (!conformDelete) return;
    removeCabin(id);
  };

  if (isLoading || isBookingsLoading) {
    return <p>Loading Cabins.....</p>
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Units & Cabins</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your property inventory and pricing.</p>
        </div>
      </div>

      <CabinSubnav
        onFilterChange={setFilter}
        onSortChange={setSort}
        currentSort={sort}
        onAddCabin={() => setShowCreate(true)}
      />

      <div className="card overflow-hidden">
        <CabinTable
          cabins={paginatedData}
          onDelete={handleDelete}
          onEdit={setEditingCabin}
          onView={(cabin, section = "overview") => {
            setSelectedCabin(cabin);
            setSelectedSection(section);
          }}
          activeBookingByCabinId={activeBookingByCabinId}
        />

        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <CabinPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {showCreate && (
        <CreateCabinModal
          onClose={() => setShowCreate(false)}
        />
      )}
      {editingCabin && (
        <EditCabinModal
          cabin={editingCabin}
          onClose={() => setEditingCabin(null)}
        />
      )}
      {selectedCabin && (
        <CabinDetailModal
          cabin={selectedCabin}
          activeBooking={activeBookingByCabinId[selectedCabin.id] ?? null}
          initialSection={selectedSection}
          onClose={() => {
            setSelectedCabin(null);
            setSelectedSection("overview");
          }}
        />
      )}
    </div>
  );
};
export default Cabins;
