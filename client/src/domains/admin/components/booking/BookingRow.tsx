import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Booking } from "@shared/types/booking";
import PaymentStatusBadge from "../../../payments/PaymentStatusBadge";

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
  const badgeClass =
    booking.status === "checked-out"
      ? "badge-info"
      : booking.status === "checked-in"
        ? "badge-success"
        : booking.status === "cancelled"
          ? "badge-danger"
          : "badge-warning";

  const statusLabel = booking.status.replace("-", " ");

  return (
    <tr className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      {/* Guest */}
      <td className="px-8 py-5 text-left">
        <span className="font-bold text-slate-900 dark:text-slate-100">
          {booking.guests?.full_name}
        </span>
      </td>

      {/* Cabin */}
      <td className="px-8 py-5 text-left">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
          {booking.cabins?.name}
        </span>
      </td>

      {/* Start Date */}
      <td className="px-8 py-5 text-left text-sm font-medium">
        {new Date(booking.start_date).toLocaleDateString()}
      </td>

      {/* End Date */}
      <td className="px-8 py-5 text-left text-sm font-medium text-slate-500">
        {new Date(booking.end_date).toLocaleDateString()}
      </td>

      {/* Booking Status */}
      <td className="px-8 py-5 text-left">
        <span className={`badge ${badgeClass}`}>{statusLabel}</span>
      </td>

      {/* PRICE */}
      <td className="px-8 py-5 text-left font-black text-slate-900 dark:text-white">
        ${booking.total_price.toLocaleString()}
      </td>

      {/* PAYMENT */}
      <td className="px-8 py-5 text-left">
        <PaymentStatusBadge status={booking.payment_status || 'pending'} />
      </td>

      {/* ACTIONS */}
      <td className="px-8 py-5 text-right w-44">
        <div className="flex items-center justify-end gap-2 transition-all duration-300">
          <button
            onClick={() => onDetails(booking)}
            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-sky-500 hover:border-sky-200 dark:hover:border-sky-900 shadow-sm transition-all"
            title="View Details"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => onEdit(booking)}
            disabled={booking.status === "checked-out"}
            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-200 dark:hover:border-amber-900 shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Edit Booking"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(booking.id)}
            disabled={booking.status === "checked-out"}
            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-900 shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Delete Booking"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BookingRow;
