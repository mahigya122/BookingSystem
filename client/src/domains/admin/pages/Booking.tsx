import { useEffect, useState } from "react";

import BookingSubnav from "../components/booking/BookingSubnav";
import BookingTable from "../components/booking/BookingTable";
import BookingPagination from "../components/booking/BookingPagination";
import EditBookingModal from "../components/booking/EditBookingModal";
import BookingDetailModal from "../components/booking/BookingDetailModal";

import { useBookings } from "@shared/hooks/booking/useBookings";
import { useDeleteBooking } from "@shared/hooks/booking/useDeleteBooking";

import { useFilteredBookings } from "@shared/hooks/booking/useFilteredBookings";
import { usePagination } from "@shared/hooks/usePagination";

import type {
  Booking,
  BookingStatus,
  SortType,
} from "@shared/types/booking";

const BookingPage = () => {
  const { bookings = [], isLoading } =
    useBookings();

  const { removeBooking } =
    useDeleteBooking();

  const [filter, setFilter] =
    useState<BookingStatus>("all");

  const [sort, setSort] =
    useState<SortType>("recent");

  const [search, setSearch] = useState("");

  const [editingBooking, setEditingBooking] =
    useState<Booking | null>(null);

  const [detailBooking, setDetailBooking] =
    useState<Booking | null>(null);

  const filteredBookings =
    useFilteredBookings({
      bookings,
      filter,
      sort,
      search,
    });

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(filteredBookings);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredBookings, setCurrentPage]);

  const handleDelete = (id: string) => {
    const confirmed = confirm(
      "Delete booking?"
    );

    if (!confirmed) return;

    removeBooking(id);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-6 animate-slide-up">
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
          bookings={paginatedData}
          onDelete={handleDelete}
          onEdit={setEditingBooking}
          onDetails={setDetailBooking}
        />

        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <BookingPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {editingBooking && (
        <EditBookingModal
          key={editingBooking.id}
          booking={editingBooking}
          onClose={() =>
            setEditingBooking(null)
          }
        />
      )}

      {detailBooking && (
        <BookingDetailModal
          booking={detailBooking}
          onClose={() => setDetailBooking(null)}
        />
      )}
    </div>
  );
};

export default BookingPage;