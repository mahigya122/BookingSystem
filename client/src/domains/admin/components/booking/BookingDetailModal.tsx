import type { Booking } from "@shared/types/booking";
import { useState } from "react";
import { useUpdateBooking } from "@shared/hooks";
import InvoiceModal from "../../../../shared/modals/InvoiceModal";
import toast from "react-hot-toast";
import { getOptimizedImageUrl } from "@shared/utils/imageUtils";
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
  const [settleMethod, setSettleMethod] = useState<"arrival" | "esewa_full">("arrival");
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const { editBooking, isPending: isUpdating } = useUpdateBooking();

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
                    <img
                      src={getOptimizedImageUrl(booking.cabins?.image_url, "preview")}
                      alt={booking.cabins?.name ?? "Cabin"}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
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
                    {booking.payment_method === "esewa_full" && (
                      <div className="flex items-center justify-between text-sm text-emerald-600 dark:text-emerald-450">
                        <span className="font-bold">Early Payment Discount (5%)</span>
                        <span className="font-black">-${(booking.total_price * (5 / 95)).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Net Total Price</span>
                      <span className="text-3xl font-black text-sky-500 tracking-tight">${booking.total_price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Method details */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-left">
                        <CreditCard size={16} className="text-slate-400" />
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Payment Selection</p>
                          <p className="text-xs font-black text-slate-900 dark:text-white uppercase mt-1">
                            {booking.payment_method === "esewa_deposit"
                              ? "20% Downpayment"
                              : booking.payment_method === "esewa_full"
                                ? "Pay in Full (eSewa)"
                                : booking.payment_method || "Pay on Arrival"}
                          </p>
                        </div>
                      </div>
                      <span className={`badge ${
                        booking.payment_status === "fully_paid"
                          ? "badge-success bg-emerald-500/10 text-emerald-500 border border-emerald-300"
                          : booking.payment_status === "paid"
                            ? booking.payment_method === "esewa_deposit"
                              ? "badge-info bg-sky-500/10 text-sky-500 border border-sky-300"
                              : "badge-success bg-emerald-500/10 text-emerald-500 border border-emerald-300"
                            : "badge-warning shadow-none bg-transparent border border-yellow-300"
                      }`}>
                        {booking.payment_status === "fully_paid"
                          ? "Fully Paid"
                          : booking.payment_status === "paid"
                            ? booking.payment_method === "esewa_deposit"
                              ? "Deposit Paid"
                              : "Paid"
                            : booking.payment_status?.toUpperCase() || "PENDING"}
                      </span>
                    </div>

                    {/* If 20% Deposit chosen, show breakdowns */}
                    {booking.payment_method === "esewa_deposit" && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 space-y-2 text-left">
                        <div className="flex justify-between">
                          <span>Deposit Paid (20%)</span>
                          <span className="text-slate-900 dark:text-white">${(booking.total_price * 0.2).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining Balance (80%)</span>
                          <span className="text-slate-905 dark:text-white text-sm font-black">${(booking.total_price * 0.8).toFixed(2)}</span>
                        </div>

                        {/* Settle panel if not fully paid yet */}
                        {booking.payment_status === "paid" ? (
                          <div className="mt-4 p-4 rounded-2xl bg-sky-500/5 border border-sky-500/10 space-y-3">
                            <p className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest leading-none">
                              Process Remaining Payment
                            </p>
                            <p className="text-[10.5px] leading-normal text-slate-400">
                              Choose how guest is settling the remaining balance of ${(booking.total_price * 0.8).toFixed(2)}:
                            </p>
                            
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800 dark:text-white">
                                <input
                                  type="radio"
                                  name="settleMethod"
                                  checked={settleMethod === "arrival"}
                                  onChange={() => setSettleMethod("arrival")}
                                  className="text-sky-500 focus:ring-sky-500 h-4 w-4"
                                />
                                Cash / Arrival
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-800 dark:text-white">
                                <input
                                  type="radio"
                                  name="settleMethod"
                                  checked={settleMethod === "esewa_full"}
                                  onChange={() => setSettleMethod("esewa_full")}
                                  className="text-sky-500 focus:ring-sky-500 h-4 w-4"
                                />
                                eSewa Digital
                              </label>
                            </div>

                            <button
                              disabled={isUpdating}
                              onClick={() => {
                                editBooking({
                                  ...booking,
                                  payment_status: "fully_paid",
                                  payment_method: settleMethod
                                } as any, {
                                  onSuccess: () => {
                                    toast.success("Remaining balance settled successfully!");
                                    booking.payment_status = "fully_paid";
                                    booking.payment_method = settleMethod;
                                  }
                                });
                              }}
                              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold uppercase tracking-widest text-[10px] shadow transition disabled:opacity-50"
                            >
                              {isUpdating ? "Settling..." : "Confirm Settlement"}
                            </button>
                          </div>
                        ) : (
                          <div className="mt-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/10 text-emerald-600 text-[10.5px] leading-relaxed">
                            🟢 remaining balance settled via **{(booking.payment_method as any) === "esewa_full" ? "eSewa" : "Cash"}**! Stay is fully settled.
                          </div>
                        )}
                      </div>
                    )}
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
          <div className="flex gap-3">
            {(booking.payment_status === "paid" || booking.payment_status === "fully_paid") && (
              <button onClick={() => setIsInvoiceOpen(true)} className="btn btn-secondary px-6 font-extrabold uppercase text-xs tracking-wider rounded-2xl">
                View Invoice
              </button>
            )}
            <button onClick={onClose} className="btn btn-primary px-10">
              Close View
            </button>
          </div>
        </div>

        {isInvoiceOpen && (
          <InvoiceModal
            booking={booking}
            onClose={() => setIsInvoiceOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default BookingDetailModal;
