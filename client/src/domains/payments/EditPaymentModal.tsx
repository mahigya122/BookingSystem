import { useState } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "./paymentService";
import { X, CreditCard, Plus, Minus, Loader2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface LineItem {
  id: string;
  label: string;
  amount: number;
}

interface Props {
  booking: any;
  onClose: () => void;
  onEsewaRedirect?: (amount: number) => void;
}

const EditPaymentModal = ({ booking, onClose, onEsewaRedirect }: Props) => {
  const queryClient = useQueryClient();

  const [extraCharges, setExtraCharges] = useState<LineItem[]>([]);
  const [discounts, setDiscounts] = useState<LineItem[]>([]);
  const [paymentOption, setPaymentOption] = useState<"esewa" | "cash">("cash");

  const isDownPaid =
    booking.payment_status === "down-paid" ||
    (booking.payment_status === "paid" && booking.payment_method === "esewa_deposit");

  const initialTotal = booking.total_price || 0;
  const amountPaid = isDownPaid
    ? booking.payment_amount || Math.round(initialTotal * 0.2)
    : initialTotal;
  const initialRemaining = isDownPaid ? Math.max(0, initialTotal - amountPaid) : 0;

  const totalExtraCharges = extraCharges.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const totalDiscount = discounts.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

  const finalRemaining = Math.max(0, initialRemaining + totalExtraCharges - totalDiscount);
  const finalNewTotal = initialTotal + totalExtraCharges - totalDiscount;

  const paidViaEsewa = (booking.payment_method || "").includes("esewa");

  // Reservation details extraction
  const checkInDate = booking.start_date ? new Date(booking.start_date) : null;
  const checkOutDate = booking.end_date ? new Date(booking.end_date) : null;
  const nights =
    checkInDate && checkOutDate
      ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

  const formattedArrivalDate = checkInDate
    ? checkInDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "N/A";

  const cabinName = booking.cabins?.name || "Premium Cabin";
  const activities = booking.extra_activities || [];

  // --- Line item helpers ---
  const addLineItem = (setter: React.Dispatch<React.SetStateAction<LineItem[]>>) => {
    setter((prev) => [...prev, { id: crypto.randomUUID(), label: "", amount: 0 }]);
  };
  const updateLineItem = (
    setter: React.Dispatch<React.SetStateAction<LineItem[]>>,
    id: string,
    field: "label" | "amount",
    value: string | number
  ) => {
    setter((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };
  const removeLineItem = (setter: React.Dispatch<React.SetStateAction<LineItem[]>>, id: string) => {
    setter((prev) => prev.filter((item) => item.id !== id));
  };

  // Mutation to settle remaining balance
  const { mutate: confirmSettle, isPending: isSettling } = useMutation({
    mutationFn: () => {
      const mappedCharges = extraCharges.map((c) => ({
        name: c.label || "Extra Charge",
        price: Number(c.amount) || 0,
      }));
      const mappedDiscounts = discounts.map((d) => ({
        name: d.label || "Discount Adjustment",
        price: -(Number(d.amount) || 0),
      }));
      const updatedActivities = [
        ...(booking.extra_activities || []),
        ...mappedCharges,
        ...mappedDiscounts,
      ];

      return paymentService.editPaymentDetails({
        bookingId: booking.id,
        paymentStatus: "paid",
        paymentMethod: paymentOption === "esewa" ? "esewa_full" : "arrival",
        paymentAmount: finalRemaining, // amount actually being collected in this settlement
        totalPrice: finalNewTotal, // full booking price after charges/discounts, for record-keeping
        extra_activities: updatedActivities,
      });
    },
    onSuccess: () => {
      toast.success("Payment settled successfully!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to settle payment");
    },
  });

  // Mutation to cancel and refund
  const { mutate: cancelAndRefund, isPending: isCancelling } = useMutation({
    mutationFn: () =>
      paymentService.editPaymentDetails({
        bookingId: booking.id,
        paymentStatus: "refunded",
        paymentMethod: booking.payment_method || "arrival",
        paymentAmount: amountPaid,
        totalPrice: initialTotal,
        status: "cancelled",
      }),
    onSuccess: () => {
      toast.success(
        `Booking cancelled. Payment of Rs. ${amountPaid.toLocaleString()} refunded ${
          paidViaEsewa ? "to the original eSewa account" : "in cash"
        }!`
      );
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to cancel booking");
    },
  });

  const isLoading = isSettling || isCancelling;

  const handleConfirm = () => {
    if (paymentOption === "cash") {
      confirmSettle();
    } else {
      if (onEsewaRedirect) {
        onEsewaRedirect(finalRemaining);
      } else {
        toast("Hook up onEsewaRedirect to your eSewa initiation flow.", { icon: "⚠️" });
      }
    }
  };

  return createPortal(
    <div className="modal-overlay select-none">
      <div className="modal-content w-full max-w-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
        {/* HEADER */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Edit Payment Details
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
          {/* Reservation Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Reservation Details
            </h3>
            <div className="grid grid-cols-2 gap-5 text-xs font-bold bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              <div className="flex flex-col gap-1 text-slate-500 dark:text-slate-400">
                <span>Cabin Booked</span>
                <span className="text-slate-900 dark:text-white text-sm font-black">
                  {cabinName}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-slate-500 dark:text-slate-400">
                <span>Stay Duration</span>
                <span className="text-slate-900 dark:text-white text-sm font-black">
                  {nights} {nights === 1 ? "Day" : "Days"} ({nights} {nights === 1 ? "Night" : "Nights"})
                </span>
              </div>
              <div className="flex flex-col gap-1 text-slate-500 dark:text-slate-400">
                <span>Arrival Date</span>
                <span className="text-slate-900 dark:text-white text-sm font-black">
                  {formattedArrivalDate}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-slate-500 dark:text-slate-400">
                <span>Selected Activities</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {activities.length > 0 ? (
                    activities.map((act: any, idx: number) => {
                      const name = typeof act === "string" ? act : act.name || "Activity";
                      return (
                        <span
                          key={idx}
                          className="bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 px-2.5 py-0.5 rounded-full border border-sky-100 dark:border-sky-900/30 font-black uppercase tracking-wider text-[9px]"
                        >
                          {name}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 italic font-medium">None selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Overview */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Payment Overview
            </h3>
            <div className="text-xs font-bold divide-y divide-slate-100 dark:divide-slate-800 border-t border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between py-3">
                <span className="text-slate-500 dark:text-slate-400">Total Booking Price</span>
                <span className="text-slate-900 dark:text-white text-sm font-black">
                  Rs. {initialTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-slate-500 dark:text-slate-400">
                  {isDownPaid ? "Downpayment Paid (20%)" : "Amount Paid (Fully Settle)"}
                </span>
                <span className="text-emerald-500 text-sm font-black">
                  Rs. {amountPaid.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-slate-900 dark:text-white font-black">Remaining Balance Due</span>
                <span className="text-sky-500 text-base font-black">
                  Rs. {initialRemaining.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Cancellation Request Section (shown prominently if guest requests cancellation) */}
          {booking.status === "cancelling" && (
            <div className="p-6 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 dark:bg-rose-955/20 dark:border-rose-900/50 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-start gap-2.5">
                <span className="text-xl">⚠️</span>
                <div>
                  <h4 className="text-sm font-black text-rose-700 dark:text-rose-455 uppercase tracking-wide">
                    Guest Cancellation Request
                  </h4>
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-bold mt-1 leading-relaxed">
                    The guest has requested to cancel this booking. Please process the refund of{" "}
                    <strong>Rs. {amountPaid.toLocaleString()}</strong> to resolve this request.
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => cancelAndRefund()}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-rose-500/20 active:scale-98 cursor-pointer disabled:opacity-50 animate-bounce"
                style={{ animationDuration: "2s" }}
              >
                {isCancelling ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  `Cancel Booking & Refund ${isDownPaid ? "Downpayment" : "Full Payment"}`
                )}
              </button>
            </div>
          )}

          {/* Settle Section (only shown if downpayment is paid, balance remains, and not cancelling) */}
          {booking.status !== "cancelling" && (
            isDownPaid ? (
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Settle Remaining Balance
                </h3>

                {/* Extra Charges */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                    <Plus size={12} className="text-emerald-500" />
                    Extra Charges
                  </label>
                  <div className="space-y-2">
                    {extraCharges.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => updateLineItem(setExtraCharges, item.id, "label", e.target.value)}
                          placeholder="e.g. Room service"
                          className="flex-1 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold focus:border-sky-500 outline-none transition-all dark:text-white"
                        />
                        <input
                          type="number"
                          min="0"
                          value={item.amount || ""}
                          onChange={(e) =>
                            updateLineItem(setExtraCharges, item.id, "amount", Math.max(0, Number(e.target.value)))
                          }
                          placeholder="0"
                          className="w-28 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-right focus:border-sky-500 outline-none transition-all dark:text-white"
                        />
                        <button
                          onClick={() => removeLineItem(setExtraCharges, item.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addLineItem(setExtraCharges)}
                      className="flex items-center gap-1.5 text-xs font-black text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                    >
                      <Plus size={14} /> Add Charge
                    </button>
                  </div>
                </div>

                {/* Discounts */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                    <Minus size={12} className="text-rose-500" />
                    Additional Discounts
                  </label>
                  <div className="space-y-2">
                    {discounts.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => updateLineItem(setDiscounts, item.id, "label", e.target.value)}
                          placeholder="e.g. Loyalty discount"
                          className="flex-1 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold focus:border-sky-500 outline-none transition-all dark:text-white"
                        />
                        <input
                          type="number"
                          min="0"
                          value={item.amount || ""}
                          onChange={(e) =>
                            updateLineItem(setDiscounts, item.id, "amount", Math.max(0, Number(e.target.value)))
                          }
                          placeholder="0"
                          className="w-28 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-right focus:border-sky-500 outline-none transition-all dark:text-white"
                        />
                        <button
                          onClick={() => removeLineItem(setDiscounts, item.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addLineItem(setDiscounts)}
                      className="flex items-center gap-1.5 text-xs font-black text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Plus size={14} /> Add Discount
                    </button>
                  </div>
                </div>

                {/* Payment Option */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Remaining Payment Option
                  </label>
                  <div className="flex gap-6 pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer font-bold text-xs text-slate-800 dark:text-white">
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentOption === "cash"}
                        onChange={() => setPaymentOption("cash")}
                        className="text-sky-500 focus:ring-sky-500 h-4 w-4"
                      />
                      Cash Paid (Arrival)
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer font-bold text-xs text-slate-800 dark:text-white">
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={paymentOption === "esewa"}
                        onChange={() => setPaymentOption("esewa")}
                        className="text-sky-500 focus:ring-sky-500 h-4 w-4"
                      />
                      eSewa Digital
                    </label>
                  </div>
                </div>

                {/* Recalculated Summary — live itemized breakdown off the remaining balance */}
                <div className="text-xs font-bold divide-y divide-dashed divide-slate-200 dark:divide-slate-700 border-t border-dashed border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between py-2.5 text-slate-500 dark:text-slate-400">
                    <span>Remaining Settle Amount</span>
                    <span className="text-slate-900 dark:text-white">
                      Rs. {initialRemaining.toLocaleString()}
                    </span>
                  </div>
                  {extraCharges
                    .filter((c) => (Number(c.amount) || 0) > 0)
                    .map((c) => (
                      <div key={c.id} className="flex justify-between py-2.5 text-emerald-600 dark:text-emerald-400">
                        <span>{c.label || "Extra Charge"}</span>
                        <span>+Rs. {(Number(c.amount) || 0).toLocaleString()}</span>
                      </div>
                    ))}
                  {discounts
                    .filter((d) => (Number(d.amount) || 0) > 0)
                    .map((d) => (
                      <div key={d.id} className="flex justify-between py-2.5 text-rose-500">
                        <span>{d.label || "Discount"}</span>
                        <span>-Rs. {(Number(d.amount) || 0).toLocaleString()}</span>
                      </div>
                    ))}
                  <div className="flex justify-between py-2.5 text-slate-900 dark:text-white font-black text-sm">
                    <span>New Net Total Price</span>
                    <span className="text-sky-500">
                      Rs. {finalRemaining.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSettling ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : paymentOption === "cash" ? (
                    <CreditCard size={16} />
                  ) : (
                    <ExternalLink size={16} />
                  )}
                  {paymentOption === "cash" ? "Mark as Paid (Cash)" : "Proceed to eSewa Payment"}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center">
                🟢 Stay is fully paid. No remaining balance due.
              </div>
            )
          )}

          {/* Refund Section (only shown if not cancelling request) */}
          {booking.status !== "cancelling" && (
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Cancellation & Refund
              </h3>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                If the guest requests a cancellation, you can refund their payment of{" "}
                <strong className="text-slate-700 dark:text-slate-200">
                  Rs. {amountPaid.toLocaleString()}
                </strong>{" "}
                back to {paidViaEsewa ? "the eSewa account" : "cash"} used for their booking. This will
                also update the booking status to Cancelled.
              </p>
              <button
                onClick={() => cancelAndRefund()}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  `Cancel Booking & Refund ${isDownPaid ? "Downpayment" : "Full Payment"}`
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

export default EditPaymentModal;
