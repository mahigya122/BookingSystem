import { useBookings } from "../authentication/useBookings";
import { useState } from "react";
import BookingSubnav from "../components/subnav/BookingSubnav";
import { useMemo } from "react";
import { useDeleteBooking } from "../authentication/useDeleteBooking";
import EditBookingModal from "../components/booking/EditBookingModal";

type StatusFilter = "all" | "checked-in" | "checked-out" | "booked";

type SortType =
  | "recent"
  | "earlier"
  | "price-high"
  | "price-low";

const Booking = () => {
  const { bookings, isLoading } = useBookings();

  const [ filter, setFilter] = useState<StatusFilter>("all");
  const [ sort, setSort] = useState<SortType>("recent");
  const [search, setSearch] = useState("");
  const [editingBooking, setEditingBooking] = useState<any | null>(null);

  const { removeBooking } = useDeleteBooking();

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const handleDelete = (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    removeBooking(id);
  };

  const handleEdit = (booking: any) => {
  setEditingBooking(booking);
};

  const filterBookings = useMemo(() => {
    if (!bookings) return [];
    let result = [...bookings];

  //filter
    if ( filter !== "all") {
      result = result.filter((b: any) => b.status === filter);
    }

    //search
    if (search.trim()) {
    result = result.filter((b: any) =>
    b.guests?.full_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
    );
   }

    //sort
    result.sort ((a: any, b: any) => {
      switch (sort) {

        case "recent":
        return(
          new Date (b.start_date).getTime() - 
          new Date(a.start_date).getTime() 
        );

        case "earlier":
        return(
          new Date (a.start_date).getTime() - 
          new Date(b.start_date).getTime() 
        );

        case "price-high":
        return b.total_price - a.total_price;

        case "price-low":
        return a.total_price - b.total_price;

        default:
          return 0;
      }
    });

    return result;
  }, [bookings, filter, sort, search]);

  return(
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Bookings
      </h1>

      {/* SUB NAV */}
      <BookingSubnav
        onFilterChange={setFilter}
        onSortChange={setSort}
        onSearchChange={setSearch}
        currentSort={sort}
      />

      {/* TABLE */}
      {isLoading ? (
        <p className="text-gray-500">Loading bookings...</p>
      ) : bookings && bookings.length > 0 ? (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Guest
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Cabin
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Start Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  End Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Total Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filterBookings.map((booking: any) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {booking.guests?.full_name || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {booking.cabins?.name || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(booking.start_date).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(booking.end_date).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "checked-in"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "checked-out"
                          ? "bg-gray-200 text-gray-800"
                          : booking.status === "booked"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${booking.total_price}
                  </td>

                  <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
    
                  <button
                   onClick={() => handleEdit(booking)}
                   disabled={booking.status === "checked-out"}
                   className={`px-3 py-1 rounded-lg ${
                     booking.status === "checked-out"
                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                       : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                   }`}
                  >
                  Edit
                  </button>

                  <button
                   onClick={() => handleDelete(booking.id)}
                   className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                   Delete
                  </button>

                </div>
              </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No bookings available.</p>
      )}
      {/* EDIT MODAL */}
    {editingBooking && (
      <EditBookingModal
        booking={editingBooking}
        onClose={() => setEditingBooking(null)}
      />
    )}

    </div>
  );
};

export default Booking;