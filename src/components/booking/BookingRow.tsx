import type { Booking } from "../../types/booking";

interface Props {
  booking: Booking;
  onDelete: (id: string) => void;
  onEdit: (booking: Booking) => void;
  onDetails: (booking: Booking) => void;
}

const BookingRow = ({
  booking,
  onDelete,
  onEdit,
  onDetails,
}: Props) => {
  const statusLabel = booking.status === "checked-out"
    ? "Checked out"
    : booking.status === "checked-in"
      ? "Checked in"
      : "Booked";

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        {booking.guests?.full_name}
      </td>

      <td className="px-6 py-4">
        {booking.cabins?.name}
      </td>

      <td className="px-6 py-4">
        {new Date(
          booking.start_date
        ).toLocaleDateString()}
      </td>

      <td className="px-6 py-4">
        {new Date(
          booking.end_date
        ).toLocaleDateString()}
      </td>

      <td className="px-6 py-4">
        {statusLabel}
      </td>

      <td className="px-6 py-4">
        ${booking.total_price}
      </td>

      <td className="px-6 py-4">
        <div className="flex gap-2">

          <button
            onClick={() => onEdit(booking)}
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
            onClick={() => onDelete(booking.id)}
            disabled={booking.status === "checked-out"}
            className={`px-3 py-1 rounded-lg ${
              booking.status === "checked-out"
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            Delete
          </button>

          <button
            onClick={() => onDetails(booking)}
            className="px-3 py-1 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
          >
            Details
          </button>

        </div>
      </td>
    </tr>
  );
};

export default BookingRow;