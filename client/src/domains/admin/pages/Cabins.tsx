/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useMemo, useEffect, Suspense } from "react";

import { useCabins, useDeleteCabin, useBookings } from "@shared/hooks";
import type { Cabin as CabinType } from "@shared/types/cabin";
import type { Booking } from "@shared/types/booking";
import { useScrollToTop } from "@shared/hooks/useScrollToTop";
import CabinSubnav from "../components/cabin/CabinSubnav";
import CabinTable from "../components/cabin/CabinTable";
import AdminPagination from "../components/AdminPagination";
import { CreateCabinModal, EditCabinModal, CabinDetailModal } from "@shared/modals/lazyModals";
import ModalSpinner from "@shared/components/ui/ModalSpinner";
import type { CabinDetailSection } from "../components/cabin/CabinRow";

const Cabins = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");

  const { cabins = [], totalCount = 0, isLoading } = useCabins(currentPage, 10, filter, sort);
  const { bookings = [] } = useBookings(undefined, undefined, "upcoming");

  const totalPages = Math.ceil(totalCount / 10);

  const { removeCabin } = useDeleteCabin();

  const [showCreate, setShowCreate] = useState(false);

  const [editingCabin, setEditingCabin] = useState<CabinType | null>(null);
  const [selectedCabin, setSelectedCabin] = useState<CabinType | null>(null);
  const [selectedSection, setSelectedSection] = useState<CabinDetailSection>("overview");

  // Reset to page 1 when filter/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sort]);

  const activeBookingByCabinId = useMemo(() => {
    const active = bookings.filter(
      (booking: Booking) => booking.status === "booked" || booking.status === "checked-in"
    );

    return active.reduce((acc: Record<string, Booking>, booking: Booking) => {
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
    }, {} as Record<string, Booking>);
  }, [bookings]);

  // Use the hook to handle local filter/sort/pagination changes
  useScrollToTop([filter, sort, currentPage]);

  const handleDelete = (id: string) => {
    const conformDelete = confirm(
      "Delete this cabin?"
    );

    if (!conformDelete) return;
    removeCabin(id);
  };

  return (
    <div className="space-y-6 animate-slide-up pb-6 pt-2 px-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
           <p
        className="text-sky-500 text-sm font-bold block"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Inventory Management
      </p>
          <h1 className=" text-2xl
          md:text-3xl
          font-black
          text-slate-900
          dark:text-white
          tracking-tighter 
          mt-0">
            Units & Cabins
            </h1>
          <p className="text-xs
          md:text-sm
          text-slate-500
          dark:text-slate-400
          max-w-lg
          leading-relaxed

          mt-0 ">Manage your property inventory and pricing.</p>
        </div>
      </div>
<div className="mt-6">
      <CabinSubnav
        onFilterChange={setFilter}
        onSortChange={setSort}
        currentSort={sort}
        onAddCabin={() => setShowCreate(true)}
      />
     </div>

      <div className="-mt-3 card overflow-hidden">
        <CabinTable
          cabins={cabins}
          onDelete={handleDelete}
          onEdit={setEditingCabin}
          onView={(cabin, section = "overview") => {
            setSelectedCabin(cabin);
            setSelectedSection(section);
          }}
          activeBookingByCabinId={activeBookingByCabinId}
          isLoading={isLoading}
        />

        <div className="px-2 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {showCreate && (
        <Suspense fallback={<ModalSpinner />}>
          <CreateCabinModal
            onClose={() => setShowCreate(false)}
          />
        </Suspense>
      )}
      {editingCabin && (
        <Suspense fallback={<ModalSpinner />}>
          <EditCabinModal
            cabin={editingCabin}
            onClose={() => setEditingCabin(null)}
          />
        </Suspense>
      )}
      {selectedCabin && (
        <Suspense fallback={<ModalSpinner />}>
          <CabinDetailModal
            cabin={selectedCabin}
            activeBooking={activeBookingByCabinId[selectedCabin.id] ?? null}
            initialSection={selectedSection}
            onClose={() => {
              setSelectedCabin(null);
              setSelectedSection("overview");
            }}
          />
        </Suspense>
      )}
    </div>
  );
};
export default Cabins;
