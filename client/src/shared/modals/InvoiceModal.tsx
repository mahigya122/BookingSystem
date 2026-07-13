import type { FC } from "react";
import { 
  X, 
  Printer, 
  Share2, 
  Check, 
  User, 
  Calendar, 
  Receipt, 
  Building, 
  Sparkles, 
  Info,
  Tag
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

interface Props {
  booking: any;
  onClose: () => void;
}

const InvoiceModal: FC<Props> = ({ booking, onClose }) => {
  const [copied, setCopied] = useState(false);

  const checkInDate = new Date(booking.start_date);
  const checkOutDate = new Date(booking.end_date);
  const nights = Math.max(
    1,
    Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  const cabins = (booking.cabins && Object.keys(booking.cabins).length > 0) ? booking.cabins : null;
  const guests = (booking.guests && Object.keys(booking.guests).length > 0) ? booking.guests : null;

  const pricePerNight = cabins?.price_per_night || booking.price_per_night || 0;
  const accommodationTotal = pricePerNight * nights;

  // Parse activities
  const extraActivities = Array.isArray(booking.extra_activities)
    ? booking.extra_activities
    : typeof booking.extra_activities === "string"
      ? JSON.parse(booking.extra_activities)
      : [];
  const activitiesTotal = extraActivities.reduce((sum: number, act: any) => sum + (act.price || 0), 0);

  // Parse offers
  const extraOffers = Array.isArray(booking.extra_offers)
    ? booking.extra_offers
    : typeof booking.extra_offers === "string"
      ? JSON.parse(booking.extra_offers)
      : [];
  const discountPercent = extraOffers.reduce((sum: number, offer: any) => sum + (offer.discount_percent || 0), 0);
  const accommodationDiscount = accommodationTotal * (discountPercent / 100);
  const discountedAccommodationSubtotal = accommodationTotal - accommodationDiscount;

  const breakfastTotal = booking.has_breakfast ? nights * 15 : 0;
  const cleaningFee = 0;
  const serviceTax = 0;

  // Re-calculate the net total price
  const finalPrice = booking.total_price;

  // Calculate pricing based on payment method
  const isDeposit = booking.payment_method === "esewa_deposit";
  const isFull = booking.payment_method === "esewa_full";

  const originalTotalPrice = isFull ? finalPrice / 0.95 : finalPrice;
  const discountAmount = isFull ? originalTotalPrice * 0.05 : 0;

  const paidAmount = isDeposit
    ? finalPrice * 0.2
    : finalPrice;

  const remainingBalance = isDeposit ? finalPrice * 0.8 : 0;
  const remainingStatus = (booking.payment_status === "paid" || booking.payment_status === "fully_paid") ? "Paid" : "Due at Arrival";

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const summaryText = `🏨 CabinHub Booking Invoice\nInvoice ID: ${booking.id.slice(0, 8).toUpperCase()}\nCabin: ${cabins?.name || "Premium Cabin"}\nGuest: ${guests?.full_name || booking.guest_full_name || "Guest"}\nDates: ${checkInDate.toLocaleDateString()} - ${checkOutDate.toLocaleDateString()} (${nights} Nights)\nPayment Status: ${(booking.payment_status === "paid" || booking.payment_status === "fully_paid") ? "Fully Paid" : (booking.payment_status === "down-paid" || isDeposit) ? "Deposit Paid (Balance Due)" : "Paid"}\nPaid Amount: Rs. ${paidAmount.toLocaleString()}\nRemaining Balance: Rs. ${remainingBalance.toLocaleString()}\nThank you for choosing CabinHub!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice #${booking.id.slice(0, 8).toUpperCase()}`,
          text: summaryText,
        });
        toast.success("Invoice shared!");
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(summaryText);
        setCopied(true);
        toast.success("Invoice summary copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error("Failed to copy share link");
      }
    }
  };

  return createPortal(
    <div className="modal-overlay select-none">
      {/* CSS style block for printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        id="print-area"
        className="modal-content w-full max-w-2xl flex flex-col overflow-hidden max-h-[92vh] animate-in zoom-in-95 duration-200 relative z-0 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
      >
        {/* Top Premium Color Gradient Banner (Hidden on Print) */}
        <div className="h-2 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 w-full no-print" />

        {booking.payment_status === "refunded" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
            <span className="text-red-500/10 dark:text-red-500/15 text-7xl md:text-8xl font-black uppercase tracking-widest border-[12px] border-red-500/10 dark:border-red-500/15 px-14 py-7 rounded-[2rem] transform -rotate-12">
              Refunded
            </span>
          </div>
        )}

        {/* HEADER CONTROLS */}
        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between bg-slate-50/30 dark:bg-slate-950/20 flex-shrink-0 relative z-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center text-sky-500">
              <Receipt size={16} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Receipt Overview
            </span>
          </div>
          <div className="flex items-center gap-1.5 no-print">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 hover:border-sky-200 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Print Invoice"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 hover:border-sky-200 transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1"
              title="Share"
            >
              {copied ? <Check size={16} className="text-emerald-500" /> : <Share2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-400 dark:text-slate-300 transition-all cursor-pointer active:scale-95"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* INVOICE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-transparent dark:bg-transparent text-left relative z-10">
          {/* Brand/Invoice Header */}
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6 pb-6 border-b border-dashed border-slate-200 dark:border-slate-800">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  RECEIPT
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                  booking.payment_status === "refunded"
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    : booking.payment_status === "paid" || booking.payment_status === "fully_paid"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : booking.payment_status === "down-paid" || isDeposit
                        ? "bg-sky-500/10 text-sky-500 border-sky-500/20"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                }`}>
                  {booking.payment_status === "refunded"
                    ? "Refunded"
                    : booking.payment_status === "paid" || booking.payment_status === "fully_paid"
                      ? "Paid in Full"
                      : booking.payment_status === "down-paid" || isDeposit
                        ? "Deposit Paid"
                        : "Pending"}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono font-bold">
                Invoice ID: <span className="text-slate-800 dark:text-slate-300">#{booking.id.toUpperCase()}</span>
              </p>
              <p className="text-xs text-slate-400 font-semibold">
                Date Issued: <span className="text-slate-650 dark:text-slate-300 font-extrabold">{new Date(booking.created_at || Date.now()).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              </p>
            </div>
            <div className="text-left md:text-right text-xs font-semibold text-slate-500 dark:text-slate-400 space-y-0.5">
              <div className="flex items-center gap-1.5 md:justify-end text-slate-900 dark:text-white font-black text-sm">
                <Building size={14} className="text-indigo-500" />
                <span>CabinHub Retreats</span>
              </div>
              <p>Alpine Meadows Road, Ward 5</p>
              <p>Pokhara, Nepal</p>
              <p className="text-sky-500 font-bold">contact@cabinhub.com</p>
            </div>
          </div>

          {/* Guest and Stay Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Guest details card */}
            <div className="p-5 rounded-[1.5rem] bg-gradient-to-br from-sky-500/[0.02] to-sky-500/[0.04] dark:from-sky-500/[0.01] dark:to-sky-500/[0.02] border border-sky-500/10 dark:border-sky-500/5 space-y-3">
              <div className="flex items-center gap-1.5 text-sky-500">
                <User size={14} strokeWidth={2.5} />
                <span className="text-[9px] font-black uppercase tracking-wider">Billed To</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {guests?.full_name || booking.guest_full_name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{guests?.email || booking.guest_email}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-mono font-bold">{guests?.phone || booking.guest_phone}</p>
              </div>
            </div>

            {/* Stay details card */}
            <div className="p-5 rounded-[1.5rem] bg-gradient-to-br from-indigo-500/[0.02] to-indigo-500/[0.04] dark:from-indigo-500/[0.01] dark:to-indigo-500/[0.02] border border-indigo-500/10 dark:border-indigo-500/5 space-y-3">
              <div className="flex items-center gap-1.5 text-indigo-500">
                <Calendar size={14} strokeWidth={2.5} />
                <span className="text-[9px] font-black uppercase tracking-wider">Stay Details</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {cabins?.name || "Premium Cabin"}
                </h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 font-medium">
                  Check In: <span className="font-extrabold text-slate-700 dark:text-slate-350">{checkInDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </p>
                <p className="text-xs text-slate-550 dark:text-slate-400 font-medium">
                  Check Out: <span className="font-extrabold text-slate-700 dark:text-slate-350">{checkOutDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </p>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black">
                  <span>{nights} {nights === 1 ? "Night" : "Nights"} Stay</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
              Itemized Charges
            </span>
            <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 text-slate-400 dark:text-slate-500 font-black uppercase text-[9px] tracking-wider">
                    <th className="py-3 px-4 font-black">Description</th>
                    <th className="py-3 px-4 text-right font-black">Qty / Rate</th>
                    <th className="py-3 px-4 text-right font-black">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300 font-bold">
                  {/* Accommodation base rate */}
                  <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="py-3.5 px-4 font-black text-slate-800 dark:text-slate-200">
                      Cabin Accommodation Stay ({cabins?.name || "Standard Room"})
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                      {nights} Nights @ Rs. {pricePerNight.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-white font-mono">
                      Rs. {accommodationTotal.toLocaleString()}
                    </td>
                  </tr>

                  {/* Coupon / Promotion */}
                  {accommodationDiscount > 0 && (
                    <tr className="bg-emerald-500/[0.03] dark:bg-emerald-500/[0.01] text-emerald-600 dark:text-emerald-400">
                      <td className="py-3.5 px-4 font-extrabold flex items-center gap-1.5">
                        <Tag size={12} className="text-emerald-500" />
                        <span>Promo Code Discount (Accommodation)</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        -{discountPercent}% Promo
                      </td>
                      <td className="py-3.5 px-4 text-right font-black font-mono">
                        -Rs. {accommodationDiscount.toLocaleString()}
                      </td>
                    </tr>
                  )}

                  {/* Breakfast Add-on */}
                  {booking.has_breakfast && (
                    <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200 pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                        🍳 Breakfast Buffet Add-on
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                        {nights} Nights @ Rs. 15.00
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-white font-mono">
                        Rs. {breakfastTotal.toLocaleString()}
                      </td>
                    </tr>
                  )}

                  {/* Extra activities / custom adjustments */}
                  {extraActivities.map((a: any) => {
                    const priceVal = a.price || 0;
                    const isNegative = priceVal < 0;
                    return (
                      <tr key={a.id || a.name} className={isNegative ? "bg-rose-500/[0.02] dark:bg-rose-500/[0.01]" : "hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors"}>
                        <td className="py-3.5 px-4 font-bold text-slate-850 dark:text-slate-200 pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                          {isNegative ? "⚡" : "✨"} {isNegative ? "" : "Extra Activity: "}{a.name}
                        </td>
                        <td className={`py-3.5 px-4 text-right font-bold ${isNegative ? "text-rose-500" : "text-slate-400 dark:text-slate-500"}`}>
                          {isNegative ? "Refund Adjustment" : "Regular Price"}
                        </td>
                        <td className={`py-3.5 px-4 text-right font-black font-mono ${isNegative ? "text-rose-500" : "text-slate-900 dark:text-white"}`}>
                          {isNegative ? `-Rs. ${Math.abs(priceVal).toLocaleString()}` : `+Rs. ${priceVal.toLocaleString()}`}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Online payment discount */}
                  {isFull && (
                    <tr className="bg-emerald-500/[0.03] dark:bg-emerald-500/[0.01] text-emerald-600 dark:text-emerald-400">
                      <td className="py-3.5 px-4 font-extrabold flex items-center gap-1.5">
                        <Sparkles size={12} className="text-emerald-500" />
                        <span>Early Payment discount (5%)</span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-500">
                        100% Online Settle
                      </td>
                      <td className="py-3.5 px-4 text-right font-black font-mono">
                        -Rs. {discountAmount.toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pricing Totals Box */}
            <div className="pt-4 flex justify-end">
              <div className="w-full md:w-80 p-5 rounded-[1.5rem] bg-slate-50/60 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-2.5 font-bold text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Accommodation Subtotal</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono">Rs. {discountedAccommodationSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 pb-2.5 border-b border-dashed border-slate-200 dark:border-slate-750">
                  <span>Additional Services</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono">Rs. {(breakfastTotal + activitiesTotal + cleaningFee + serviceTax).toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-slate-900 dark:text-white font-black text-sm pt-1">
                  <span>Net Total Price</span>
                  <span className="text-lg font-black bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent font-mono">
                    Rs. {finalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Deposit Details Breakdown */}
                {isDeposit && (
                  <div className="space-y-2.5 border-t border-dashed border-slate-200 dark:border-slate-700 pt-3 mt-2">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                      <span>Deposit Paid (20%)</span>
                      <span className="text-slate-900 dark:text-white font-black font-mono">
                        Rs. {(finalPrice * 0.2).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-900 dark:text-white font-black text-sm pt-0.5">
                      <span>Remaining Balance</span>
                      <span className={`font-mono ${remainingStatus === "Paid" ? "text-emerald-500" : "text-sky-500"}`}>
                        Rs. {(finalPrice * 0.8).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-slate-400 pt-1">
                      <span>Remaining Status</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-black text-[9px] border ${
                        remainingStatus === "Paid"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-sky-500/10 text-sky-500 border-sky-500/20"
                      }`}>
                        {remainingStatus}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Secure Footer Notice */}
          <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-400 dark:text-slate-500 font-bold leading-relaxed flex items-center justify-center gap-2">
            <Info size={14} className="text-sky-500 flex-shrink-0" />
            <span>Thank you for choosing CabinHub. If you have questions about this statement, contact us at contact@cabinhub.com.</span>
          </div>
        </div>

        {/* PRINT WINDOW FOOTER (NO-PRINT) */}
        <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20 flex justify-end no-print relative z-10">
          <button
            onClick={onClose}
            className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition cursor-pointer shadow-lg active:scale-98"
          >
            Close Invoice
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default InvoiceModal;