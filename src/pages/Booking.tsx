import { useState } from "react";

import BookingSubnav from "../components/booking/BookingSubnav";
import BookingTable from "../components/booking/BookingTable";
import BookingPagination from "../components/booking/BookingPagination";
import EditBookingModal from "../components/booking/EditBookingModal";

import { useBookings } from "../authentication/useBookings";
import { useDeleteBooking } from "../authentication/useDeleteBooking";

import { useFilteredBookings } from "../hooks/useFilteredBookings";
import { usePagination } from "../hooks/usePagination";

import type {
  Booking,
  BookingStatus,
  SortType,
} from "../types/booking";

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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Bookings
      </h1>

      <BookingSubnav
        onFilterChange={setFilter}
        onSortChange={setSort}
        onSearchChange={setSearch}
        currentSort={sort}
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <BookingTable
          bookings={paginatedData}
          onDelete={handleDelete}
          onEdit={setEditingBooking}
        />

        <BookingPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() =>
            setEditingBooking(null)
          }
        />
      )}
    </div>
  );
};

export default BookingPage;