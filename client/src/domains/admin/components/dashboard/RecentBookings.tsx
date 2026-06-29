import type { Booking } from "@shared/types/booking";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface Props {
  bookings: Booking[];
}

const RecentBookings = ({ bookings }: Props) => {
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  // Show only top 5 recent bookings
  const recentItems = safeBookings.slice(0, 5);

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Latest Reservations
        </h2>
        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
          Recently Created
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {recentItems.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-bold text-sm">
            No reservations found
          </div>
        ) : (
          recentItems.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between gap-4 px-8 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                  {booking.status === "booked" ? <Clock size={18} /> :
                    booking.status === "cancelled" ? <XCircle size={18} className="text-rose-500" /> :
                      <CheckCircle2 size={18} className="text-emerald-500" />}
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {booking.guests?.full_name || `Guest (ID: ${booking.guest_id?.slice(0, 8)}...)`}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {booking.cabins?.name} • {new Date(booking.created_at || "").toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  ${booking.total_price}
                </p>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${booking.payment_status === "paid" ? "text-emerald-500" : "text-amber-500"
                  }`}>
                  {booking.payment_status}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentBookings;
