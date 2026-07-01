import type { FC } from "react";
import { X, Printer, Share2, Check } from "lucide-react";
import { useState } from "react";
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

  const pricePerNight = booking.cabins?.price_per_night || 0;
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
  const cleaningFee = nights > 0 ? 50 : 0;
  const serviceTax = nights > 0 ? 20 : 0;

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
  const remainingStatus = booking.payment_status === "fully_paid" ? "Paid" : "Due at Arrival";

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const summaryText = `🏨 CabinHub Booking Invoice\nInvoice ID: ${booking.id.slice(0, 8).toUpperCase()}\nCabin: ${booking.cabins?.name || "Premium Cabin"}\nGuest: ${booking.guests?.full_name}\nDates: ${checkInDate.toLocaleDateString()} - ${checkOutDate.toLocaleDateString()} (${nights} Nights)\nPayment Status: ${booking.payment_status === "fully_paid" ? "Fully Paid" : isDeposit ? "Deposit Paid (Balance Due)" : "Paid"}\nPaid Amount: Rs. ${paidAmount.toLocaleString()}\nRemaining Balance: Rs. ${remainingBalance.toLocaleString()}\nThank you for choosing CabinHub!`;

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

  return (
    <div className="modal-overlay select-none z-[999999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm fixed inset-0">
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
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* HEADER (NO-PRINT CONTROLS INCLUDED) */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="text-sky-500">🏨</span> CabinHub
            </span>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2 border-l border-slate-200 dark:border-slate-700 pl-3">
              Official Invoice
            </span>
          </div>
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
              title="Print Invoice"
            >
              <Printer size={18} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition flex items-center gap-1"
              title="Share"
            >
              {copied ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* INVOICE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white dark:bg-slate-900 text-left">
          {/* Brand/Invoice Header */}
          <div className="flex flex-col md:flex-row md:justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">INVOICE</h1>
              <p className="text-xs text-slate-400 font-mono mt-1 font-semibold">
                ID: #{booking.id.toUpperCase()}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-bold">
                Date: {new Date(booking.created_at || Date.now()).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-left md:text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
              <p className="text-slate-905 dark:text-white font-extrabold">CabinHub Retreats Pvt. Ltd.</p>
              <p>Alpine Meadows Road, Ward 5</p>
              <p>Pokhara, Nepal</p>
              <p>contact@cabinhub.com</p>
            </div>
          </div>

          {/* Guest and Stay Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Billed To</p>
              <div className="space-y-1 text-slate-700 dark:text-slate-300 font-bold">
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {booking.guests?.full_name || booking.guest_full_name}
                </p>
                <p>{booking.guests?.email || booking.guest_email}</p>
                <p>{booking.guests?.phone || booking.guest_phone}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Stay Details</p>
              <div className="space-y-1 text-slate-700 dark:text-slate-300 font-bold">
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {booking.cabins?.name || "Premium Cabin"}
                </p>
                <p>
                  Check In:{" "}
                  {checkInDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p>
                  Check Out:{" "}
                  {checkOutDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p>Duration: {nights} Nights</p>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Line Items</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-bold">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-left">
                    <th className="py-2.5 font-black uppercase">Description</th>
                    <th className="py-2.5 font-black uppercase text-right">Qty/Rate</th>
                    <th className="py-2.5 font-black uppercase text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50 dark:divide-slate-850/50 text-slate-700 dark:text-slate-300 font-semibold">
                  <tr>
                    <td className="py-3 text-slate-900 dark:text-white">
                      Cabin Accommodation Stay ({booking.cabins?.name || "Standard Room"})
                    </td>
                    <td className="py-3 text-right">
                      {nights} Nights @ ${pricePerNight.toFixed(2)}
                    </td>
                    <td className="py-3 text-right font-black text-slate-900 dark:text-white">
                      ${accommodationTotal.toFixed(2)}
                    </td>
                  </tr>
                  {accommodationDiscount > 0 && (
                    <tr className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                      <td className="py-3">
                        Offer/Promotion Discount (Accommodation Only)
                      </td>
                      <td className="py-3 text-right">
                        -{discountPercent}% Promo
                      </td>
                      <td className="py-3 text-right font-black">
                        -${accommodationDiscount.toFixed(2)}
                      </td>
                    </tr>
                  )}
                  {booking.has_breakfast && (
                    <tr>
                      <td className="py-3 text-slate-900 dark:text-white">
                        Breakfast Buffet Add-on
                      </td>
                      <td className="py-3 text-right">
                        {nights} Nights @ $15.00
                      </td>
                      <td className="py-3 text-right font-black text-slate-900 dark:text-white">
                        ${breakfastTotal.toFixed(2)}
                      </td>
                    </tr>
                  )}
                  {extraActivities.map((a: any) => (
                    <tr key={a.id}>
                      <td className="py-3 text-slate-900 dark:text-white pl-4">
                        • Extra Activity: {a.name}
                      </td>
                      <td className="py-3 text-right">
                        Regular Price
                      </td>
                      <td className="py-3 text-right font-black text-slate-900 dark:text-white">
                        +${(a.price || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {cleaningFee > 0 && (
                    <tr className="text-slate-500">
                      <td className="py-3">
                        Cleaning Fee
                      </td>
                      <td className="py-3 text-right">
                        Fixed Charge
                      </td>
                      <td className="py-3 text-right font-black">
                        +${cleaningFee.toFixed(2)}
                      </td>
                    </tr>
                  )}
                  {serviceTax > 0 && (
                    <tr className="text-slate-500">
                      <td className="py-3">
                        Service Tax & Fees
                      </td>
                      <td className="py-3 text-right">
                        Fixed Charge
                      </td>
                      <td className="py-3 text-right font-black">
                        +${serviceTax.toFixed(2)}
                      </td>
                    </tr>
                  )}
                  {isFull && (
                    <tr className="text-emerald-600 dark:text-emerald-450 border-t border-slate-200 dark:border-slate-800 bg-emerald-500/5">
                      <td className="py-3 font-extrabold">
                        ⭐ Early Payment Discount (5%)
                      </td>
                      <td className="py-3 text-right">
                        100% Online Settle
                      </td>
                      <td className="py-3 text-right font-black">
                        -${discountAmount.toFixed(2)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
                  {/* Pricing Totals Box */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <div className="w-full md:w-64 space-y-3 font-bold text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Accommodation Subtotal</span>
                <span className="text-slate-900 dark:text-white">${discountedAccommodationSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Additional Services</span>
                <span className="text-slate-900 dark:text-white">${(breakfastTotal + activitiesTotal + cleaningFee + serviceTax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-905 dark:text-white text-sm font-black border-t border-slate-150 dark:border-slate-800 pt-2.5">
                <span>Net Total Payable</span>
                <span className="text-sky-600 dark:text-sky-400">${finalPrice.toFixed(2)}</span>
              </div>

              {/* Deposit Info */}
              {isDeposit && (
                <div className="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-700 pt-2.5">
                  <div className="flex justify-between text-slate-500">
                    <span>20% Downpayment Paid</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">
                      ${(finalPrice * 0.2).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-900 dark:text-white font-black text-sm">
                    <span>Remaining Balance</span>
                    <span className={remainingStatus === "Paid" ? "text-emerald-600 dark:text-emerald-450" : "text-sky-600 dark:text-sky-400"}>
                      ${(finalPrice * 0.8).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-slate-400">
                    <span>Remaining Status</span>
                    <span className={`px-2 py-0.5 rounded-full font-black text-[9px] ${
                      remainingStatus === "Paid"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-sky-500/10 text-sky-500"
                    }`}>
                      {remainingStatus}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>    </div>

          {/* Secure Footer Notice */}
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-150/50 dark:border-slate-800 text-center text-[10px] text-slate-400 font-bold leading-normal">
            Thank you for choosing CabinHub. This invoice details your stay rates, taxes, and payment confirmation. If you have questions, please reach out directly at contact@cabinhub.com.
          </div>
        </div>

        {/* PRINT WINDOW FOOTER (NO-PRINT) */}
        <div className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end no-print">
          <button onClick={onClose} className="btn btn-secondary px-8 font-black uppercase tracking-widest text-xs rounded-2xl">
            Close Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
