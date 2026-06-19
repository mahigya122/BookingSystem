/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, Suspense } from "react";

import BookingSubnav from "../components/booking/BookingSubnav";
import BookingTable from "../components/booking/BookingTable";
import BookingPagination from "../components/booking/BookingPagination";
import { EditBookingModal, BookingDetailModal } from "@shared/modals/lazyModals";
import ModalSpinner from "@shared/components/ui/ModalSpinner";

import { useBookings, useDeleteBooking } from "@shared/hooks";

import type {
  Booking,
  BookingStatus,
  SortType,
} from "@shared/types/booking";

const BookingPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<BookingStatus>("all");
  const [sort, setSort] = useState<SortType>("recent");
  const [search, setSearch] = useState("");

  const {
    bookings = [],
    totalCount = 0,
    isLoading,
  } = useBookings(currentPage, 10, filter, sort, search);

  const totalPages = Math.ceil(totalCount / 10);

  const { removeBooking } = useDeleteBooking();

  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sort, search]);

  const handleDelete = (id: string) => {
    const confirmed = confirm("Delete booking?");
    if (!confirmed) return;
    removeBooking(id);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="px-6 md:px-0 space-y-6 animate-slide-up">
      <div className="flex flex-col">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Bookings
        </h1>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-2">Manage and view all reservation details</span>
      </div>

      <BookingSubnav
        onFilterChange={setFilter}
        onSortChange={setSort}
        onSearchChange={setSearch}
        currentSort={sort}
      />

      <div className="card overflow-hidden">
        <BookingTable
          bookings={bookings}
          onDelete={handleDelete}
          onEdit={setEditingBooking}
          onDetails={setDetailBooking}
        />

        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <BookingPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {editingBooking && (
        <Suspense fallback={<ModalSpinner />}>
          <EditBookingModal
            key={editingBooking.id}
            booking={editingBooking}
            onClose={() => setEditingBooking(null)}
          />
        </Suspense>
      )}

      {detailBooking && (
        <Suspense fallback={<ModalSpinner />}>
          <BookingDetailModal
            booking={detailBooking}
            onClose={() => setDetailBooking(null)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default BookingPage;
