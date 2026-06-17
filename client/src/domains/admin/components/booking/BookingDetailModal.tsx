import type { Booking } from "@shared/types/booking";
import { 
  X, 
  User, 
  Home, 
  CreditCard, 
  Info, 
  Coffee,
  Clock,
  MapPin
} from "lucide-react";

interface Props {
  booking: Booking;
  onClose: () => void;
}

const BookingDetailModal = ({
  booking,
  onClose,
}: Props) => {
  const nights = Math.ceil(
    (new Date(booking.end_date).getTime() -
      new Date(booking.start_date).getTime()) /
      (1000 * 60 * 60 * 24)
    );

  const statusColors = {
    "booked": "badge-warning",
    "checked-in": "badge-success",
    "checked-out": "badge-info",
    "cancelled": "badge-danger"
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* HEADER */}
        <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-500">
              <Info size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Reservation Details</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Booking ID:</p>
                <span className="text-xs font-mono font-black text-sky-500">#{booking.id.slice(0, 8).toUpperCase()}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30 dark:bg-slate-950/30 space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* GUEST & CABIN INFO */}
            <div className="space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-sky-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Guest Information</h3>
                </div>
                <div className="surface-panel p-6 rounded-3xl space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-slate-400">
                      {booking.guests?.full_name?.charAt(0) || "G"}
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-900 dark:text-white">{booking.guests?.full_name}</p>
                      <p className="text-sm font-bold text-slate-500">{booking.guests?.email}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                      <span>CONTACT</span>
                      <span className="text-slate-900 dark:text-slate-200">Verified Direct Booking</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <Home size={18} className="text-emerald-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Unit Details</h3>
                </div>
                <div className="surface-panel p-6 rounded-3xl group">
                  <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
                    <img src={booking.cabins?.image_url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-lg font-black text-white">{booking.cabins?.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-400 uppercase tracking-widest">Base Rate</span>
                      <span className="text-slate-900 dark:text-white">${booking.cabins?.price_per_night} / night</span>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="text-slate-400 uppercase tracking-widest">Location</span>
                      <span className="text-slate-900 dark:text-white flex items-center justify-end gap-1">
                        <MapPin size={12} className="text-emerald-500" />
                        Alpine Heights
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* STAY & PAYMENT INFO */}
            <div className="space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-violet-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Stay Overview</h3>
                </div>
                <div className="surface-panel p-8 rounded-[2rem] space-y-8">
                  <div className="flex items-center justify-between relative">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Arrival</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        {new Date(booking.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                       <div className="h-px w-8 bg-slate-200" />
                       <span className="badge badge-primary">{nights} Nights</span>
                       <div className="h-px w-8 bg-slate-200" />
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Departure</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        {new Date(booking.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${booking.has_breakfast ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-slate-300"}`}>
                        <Coffee size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Breakfast</p>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{booking.has_breakfast ? "Included" : "None"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</p>
                        <span className={`badge ${statusColors[booking.status as keyof typeof statusColors] || "badge-primary"} mt-1`}>
                          {booking.status.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <CreditCard size={18} className="text-amber-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Financial Summary</h3>
                </div>
                <div className="surface-panel-strong p-8 rounded-[2rem] border-amber-100/50 dark:border-amber-900/20 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-500">Unit Rate Sum</span>
                      <span className="font-black text-slate-900 dark:text-white">${booking.cabins?.price_per_night} × {nights}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-500">Service Add-ons</span>
                      <span className="font-black text-slate-900 dark:text-white">${booking.has_breakfast ? nights * 12 : 0}</span>
                    </div>
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Net Payable</span>
                      <span className="text-3xl font-black text-sky-500 tracking-tight">${booking.total_price}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard size={16} className="text-slate-400" />
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Payment Method</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase">{booking.payment_method || "arrival"}</p>
                      </div>
                    </div>
                    <span className={`badge ${booking.payment_status === "paid" ? "badge-success" : "badge-warning shadow-none bg-transparent"}`}>
                      {booking.payment_status?.toUpperCase() || "PENDING"}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-10 py-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Created:</span>
            <span className="text-xs font-black text-slate-600 dark:text-slate-300">{new Date(booking.created_at || "").toLocaleString()}</span>
          </div>
          <button onClick={onClose} className="btn btn-primary px-10">
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
