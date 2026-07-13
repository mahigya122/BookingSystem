import { useState } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "./paymentService";
import { X, Calendar, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  booking: any;
  onClose: () => void;
}

const ModifyStayModal = ({ booking, onClose }: Props) => {
  const queryClient = useQueryClient();

  const initialTotal = booking.total_price || 0;
  const amountPaid = booking.payment_amount || initialTotal;
  const bookingStatus = booking.status; // "booked", "checked-in", "checked-out"

  // Calculate original nights
  const checkInDate = booking.start_date ? new Date(booking.start_date) : null;
  const checkOutDate = booking.end_date ? new Date(booking.end_date) : null;
  const originalNights =
    checkInDate && checkOutDate
      ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

  // Selected new nights
  const [newNights, setNewNights] = useState<number>(originalNights > 1 ? originalNights - 1 : 1);

  const nightlyRate = originalNights > 0 ? Math.round(initialTotal / originalNights) : 0;
  const refundAmount = originalNights > 0 ? Math.max(0, nightlyRate * (originalNights - newNights)) : 0;
  const finalNewTotal = Math.max(0, initialTotal - refundAmount);

  const paidViaEsewa = (booking.payment_method || "").includes("esewa");

  // Mutation to shorten stay and refund
  const { mutate: confirmShorten, isPending: isShortening } = useMutation({
    mutationFn: () => {
      const start = new Date(booking.start_date);
      // Add newNights days to start date
      const newEnd = new Date(start.getTime() + newNights * 24 * 60 * 60 * 1000);
      const newEndDateString = newEnd.toISOString().split("T")[0];

      // Add a refund line item to extra_activities
      const refundActivity = {
        name: `Refund: Stay Shortened (${originalNights} to ${newNights} Nights)`,
        price: -refundAmount,
      };
      const updatedActivities = [...(booking.extra_activities || []), refundActivity];

      return paymentService.editPaymentDetails({
        bookingId: booking.id,
        paymentStatus: "paid",
        paymentAmount: finalNewTotal,
        totalPrice: finalNewTotal,
        end_date: newEndDateString,
        extra_activities: updatedActivities,
      });
    },
    onSuccess: () => {
      toast.success(
        `Stay adjusted successfully. Rs. ${refundAmount.toLocaleString()} refunded ${
          paidViaEsewa ? "to eSewa account" : "in cash"
        }!`
      );
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to adjust stay");
    },
  });

  // Mutation to cancel and refund (before arrival)
  const { mutate: confirmCancel, isPending: isCancelling } = useMutation({
    mutationFn: () =>
      paymentService.editPaymentDetails({
        bookingId: booking.id,
        paymentStatus: "refunded",
        paymentAmount: amountPaid,
        totalPrice: initialTotal,
        status: "cancelled",
      }),
    onSuccess: () => {
      toast.success(
        `Reservation cancelled. Full payment of Rs. ${amountPaid.toLocaleString()} refunded ${
          paidViaEsewa ? "to the eSewa account" : "in cash"
        }!`
      );
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to cancel booking");
    },
  });

  const isLoading = isShortening || isCancelling;

  return createPortal(
    <div className="modal-overlay select-none">
      <div className="modal-content w-full max-w-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* HEADER */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Modify Stay & Refund
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Booking ID:
              </p>
              <span className="text-xs font-mono font-black text-sky-500">
                #{booking.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white dark:bg-slate-900 text-left">
          {/* Reservation Summary */}
          <div className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50 space-y-3.5 text-xs font-bold text-slate-500">
            <div className="flex justify-between">
              <span>Guest Name</span>
              <span className="text-slate-900 dark:text-white">{booking.guests?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span>Cabin</span>
              <span className="text-slate-900 dark:text-white">{booking.cabins?.name || "Premium Cabin"}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Stay</span>
              <span className="text-slate-900 dark:text-white">
                {originalNights} Nights ({booking.start_date} to {booking.end_date})
              </span>
            </div>
            <div className="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-700/50 pt-3 mt-1">
              <span>Amount Paid</span>
              <span className="text-emerald-500 font-extrabold">Rs. {amountPaid.toLocaleString()}</span>
            </div>
          </div>

          {/* Option A: Shorten stay (only relevant during check-in / stay in progress) */}
          {bookingStatus === "checked-in" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-450 flex items-center gap-1.5 mb-2">
                  <Calendar size={14} className="text-sky-500" />
                  Shorten Stay Duration
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Guest has checked in. If they decide to depart early, you can select the new total
                  number of nights they stayed. We will recalculate the invoice and refund the
                  difference.
                </p>
              </div>

              {originalNights > 1 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      New Stay Nights
                    </label>
                    <select
                      value={newNights}
                      onChange={(e) => setNewNights(Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-850 rounded-2xl px-5 py-3 text-sm font-bold focus:border-sky-500 outline-none transition-all dark:text-white"
                    >
                      {Array.from({ length: originalNights - 1 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Night" : "Nights"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Calculations */}
                  <div className="text-xs font-bold divide-y divide-dashed divide-slate-200 dark:divide-slate-700 border-t border-b border-dashed border-slate-200 dark:border-slate-700 py-1">
                    <div className="flex justify-between py-2">
                      <span className="text-slate-550">Nights Adjustment</span>
                      <span className="text-slate-900 dark:text-white flex items-center gap-1">
                        {originalNights} <ArrowRight size={12} /> {newNights} Nights
                      </span>
                    </div>
                    <div className="flex justify-between py-2 text-rose-500">
                      <span>Refund Amount Due</span>
                      <span>Rs. {refundAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 text-slate-900 dark:text-white font-black text-sm">
                      <span>New Stay Price</span>
                      <span className="text-sky-500">Rs. {finalNewTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => confirmShorten()}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isShortening ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "Apply Refund & Update Stay"
                    )}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-rose-500 font-bold bg-rose-50 dark:bg-rose-955/20 p-3 rounded-xl">
                  ⚠️ This booking is only for 1 Night and cannot be shortened further.
                </p>
              )}
            </div>
          )}

          {/* Option B: Cancel booking before arrival (status === "booked") */}
          {bookingStatus === "booked" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Cancel Reservation & Refund
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Guest has not checked in yet. You can cancel this reservation and return their full
                  payment of <strong>Rs. {amountPaid.toLocaleString()}</strong>.
                </p>
              </div>

              <div className="bg-rose-500/5 border border-rose-500/10 p-5 rounded-2xl text-xs font-bold text-slate-500 space-y-2 text-left">
                <div className="flex justify-between">
                  <span>Full Amount Paid</span>
                  <span className="text-slate-900 dark:text-white">Rs. {amountPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-500 font-black">
                  <span>Total Refund Amount</span>
                  <span>Rs. {amountPaid.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => confirmCancel()}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Cancel Booking & Refund Full Payment"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModifyStayModal;
