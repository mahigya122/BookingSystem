import BookingRow from "./BookingRow";
import { Eye, Pencil, Trash2 } from "lucide-react";
import PaymentStatusBadge from "../../../payments/PaymentStatusBadge";
import type { Booking } from "@shared/types/booking";

interface Props {
  bookings: Booking[];
  onDelete: (id: string) => void;
  onEdit: (booking: Booking) => void;
  onDetails: (booking: Booking) => void;
  isLoading?: boolean;
}

const BookingTable = ({
  bookings,
  onDelete,
  onEdit,
  onDetails,
  isLoading,
}: Props) => {
  return (
    <div>
      {/* MOBILE CARD VIEW */}
      <div className="block sm:hidden space-y-3 p-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-3 animate-pulse space-y-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))
        ) : bookings.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 font-bold">No reservations found.</div>
        ) : (
          bookings.map((booking) => {
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
              <div key={booking.id} className="group card p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-xl shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Booking ID: {booking.id.substring(0, 8)}</span>
                  <div className="flex gap-2">
                    <button onClick={() => onDetails(booking)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-sky-500 transition-colors">
                      <Eye size={12} />
                    </button>
                    <button 
                      onClick={() => onEdit(booking)} 
                      disabled={booking.status === "checked-out"}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Pencil size={12} />
                    </button>
                    <button 
                      onClick={() => onDelete(booking.id)} 
                      disabled={booking.status === "checked-out"}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="border-t border-slate-50 dark:border-slate-800/60 my-1" />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{booking.guests?.full_name}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-bold mt-0.5">{booking.cabins?.name}</span>
                  </div>
                  <span className={`badge text-[9px] ${badgeClass}`}>{statusLabel}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase">Check-in</span>
                    <span className="text-slate-600 dark:text-slate-300 font-bold block">{new Date(booking.start_date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase">Check-out</span>
                    <span className="text-slate-600 dark:text-slate-300 font-bold block">{new Date(booking.end_date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase">Revenue</span>
                    <span className="text-slate-900 dark:text-white font-black block">${booking.total_price.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase">Payment</span>
                    <div className="mt-0.5 scale-90 origin-left">
                      <PaymentStatusBadge status={booking.payment_status || 'pending'} paymentMethod={booking.payment_method} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-50/50 dark:bg-blue-950/30 border-b border-blue-100/50 dark:border-blue-900/20">
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Guest Name</th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Unit / Cabin</th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Check-in</th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Check-out</th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Revenue</th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Payment</th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 w-44">Manage</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-8 py-5 text-left"><div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                    <td className="px-8 py-5 text-left"><div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                    <td className="px-8 py-5 text-left"><div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                    <td className="px-8 py-5 text-left"><div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                    <td className="px-8 py-5 text-left"><div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                    <td className="px-8 py-5 text-left"><div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                    <td className="px-8 py-5 text-left"><div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                    <td className="px-8 py-5 text-right w-44"><div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-pulse ml-auto" /></td>
                  </tr>
                ))
              : bookings.map((booking) => (
                  <BookingRow
                    key={booking.id}
                    booking={booking}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onDetails={onDetails}
                  />
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
