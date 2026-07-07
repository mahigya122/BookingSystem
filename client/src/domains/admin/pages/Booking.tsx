import { useEffect, useState, Suspense } from "react";

import BookingSubnav from "../components/booking/BookingSubnav";
import BookingTable from "../components/booking/BookingTable";
import AdminPagination from "../components/AdminPagination";
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

  return (
    <div className="space-y-6 animate-slide-up pb-2 pt-2 px-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
        <div>
          <p
            className="text-sky-500 text-sm font-bold block"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Booking Management
          </p>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter mt-0">
            Booking <span className="text-sky-500">Overview</span>
          </h1>

          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed mt-0">
            Manage, monitor, and organize all cabin reservations with real-time insights.
          </p>
        </div>
      </div>

<div className="mt-6">
      <BookingSubnav
        onFilterChange={setFilter}
        onSortChange={setSort}
        onSearchChange={setSearch}
        currentSort={sort}
      />
      </div>

      <div className="-mt-3 card overflow-hidden">
        <BookingTable
          bookings={bookings}
          onDelete={handleDelete}
          onEdit={setEditingBooking}
          onDetails={setDetailBooking}
          isLoading={isLoading}
        />

        <div className="px-2 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            label="Displaying Page"
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
