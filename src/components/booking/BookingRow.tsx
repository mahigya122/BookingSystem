import type { Booking } from "../../../shared/types/booking";

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
  const badgeClass = booking.status === "checked-out"
    ? "badge-info"
    : booking.status === "checked-in"
      ? "badge-success"
      : "badge-warning";

  const statusLabel = booking.status.replace('-', ' ');

  return (
    <tr className="group">
      <td className="px-6 py-4">
        <span className="font-bold text-slate-900 dark:text-slate-100">{booking.guests?.full_name}</span>
      </td>

      <td className="px-6 py-4">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
            {booking.cabins?.name}
        </span>
      </td>

      <td className="px-6 py-4 text-sm font-medium">
        {new Date(booking.start_date).toLocaleDateString()}
      </td>

      <td className="px-6 py-4 text-sm font-medium text-slate-500">
        {new Date(booking.end_date).toLocaleDateString()}
      </td>

      <td className="px-6 py-4">
        <span className={`badge ${badgeClass}`}>
            {statusLabel}
        </span>
      </td>

      <td className="px-6 py-4 font-black text-slate-900 dark:text-white">
        ${booking.total_price.toLocaleString()}
      </td>

      <td className="px-6 py-4">
        <div className="flex justify-end gap-2 opacity-100 transition-opacity">
          <button
            onClick={() => onDetails(booking)}
            className="btn-action btn-action-secondary"
          >
            Details
          </button>
          
          <button
            onClick={() => onEdit(booking)}
            disabled={booking.status === "checked-out"}
            className="btn-action btn-action-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(booking.id)}
            disabled={booking.status === "checked-out"}
            className="btn-action btn-action-danger disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BookingRow;
