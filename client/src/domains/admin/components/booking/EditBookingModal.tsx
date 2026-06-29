import { useMemo, useState } from "react";
import type { Booking } from "@shared/types/booking";
import { useUpdateBooking } from "@shared/hooks";
import type { PaymentStatus, PaymentMethod } from "../../../payments/payment.types";
import { 
  Save, 
  Calendar, 
  Coffee, 
  CreditCard, 
  Clock, 
  User, 
  Loader2, 
  ArrowLeft,
  TrendingUp,
  Briefcase,
  Info
} from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  booking: Booking;
  onClose: () => void;
}

const EditBookingModal = ({ booking, onClose} : Props) => {
  const { editBooking, isPending } = useUpdateBooking();

  const [startDate, setStartDate] = useState(booking.start_date);
  const [endDate, setEndDate] = useState(booking.end_date);
  const [status, setStatus] = useState<Booking["status"]>(booking.status);
  const [hasBreakfast, setHasBreakfast] = useState(booking.has_breakfast);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(booking.payment_status || "pending");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(booking.payment_method || "arrival");

// PRICE CALCULATION
const Pricing = useMemo(() => {
    if ( !startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const nights = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) return null;

    const cabinPrice = booking.cabins?.price_per_night || 0;
    const breakfastPrice = hasBreakfast ? nights * 12 : 0;
    const total = Math.round(cabinPrice * nights + breakfastPrice);

     return{
        nights,
        total,
        breakfastPrice,
     };
    }, [startDate, endDate, booking, hasBreakfast]
);

  // SAVE
  const handleSave = () => {
    if (!Pricing) {
        toast.error("Invalid dates selected");
        return;
    }

    editBooking(
      {
        id: booking.id,
        start_date: startDate,
        end_date: endDate,
        total_price: Pricing.total,
        has_breakfast: hasBreakfast,
        status,
        payment_status: paymentStatus,
        payment_method: paymentMethod,
      },
      {
        onSuccess: () => {
          toast.success("Booking updated successfully");
          onClose();
        },
      }
    );
  };

  const inputLabelClass = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block";
  const inputBaseClass = "w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-sky-500 focus:ring-8 focus:ring-sky-500/5 outline-none transition-all dark:text-white";

  return (
     <div className="modal-overlay">
      <div className="modal-content w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">

        {/* HEADER */}
        <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 flex-shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={onClose} className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-500 transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Modify Reservation</h2>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Configuring: <span className="text-sky-500">{booking.guests?.full_name}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="btn btn-secondary px-6">Discard</button>
            <button
                disabled={isPending}
                onClick={handleSave}
                className="btn btn-primary px-10 shadow-xl shadow-sky-500/20"
            >
                {isPending ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 bg-slate-50/30 dark:bg-slate-950/30">
          
          <div className="lg:col-span-2 p-10 space-y-12 border-r border-slate-100 dark:border-slate-800">
            
            {/* TIMELINE SECTION */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                  <Calendar size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Stay Timeline</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={inputLabelClass}>Arrival Date</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={`${inputBaseClass} pl-12`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={inputLabelClass}>Departure Date</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={`${inputBaseClass} pl-12`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* STATUS & SERVICES */}
            <section className="space-y-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Status & Services</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={inputLabelClass}>Booking Status</label>
                  <div className="relative">
                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Booking["status"])}
                      className={`${inputBaseClass} pl-12 appearance-none`}
                    >
                      <option value="booked">Booked</option>
                      <option value="checked-in">Checked In</option>
                      <option value="checked-out">Checked Out</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                   <button 
                      type="button"
                      onClick={() => setHasBreakfast(!hasBreakfast)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        hasBreakfast 
                          ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800" 
                          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                      }`}
                   >
                     <div className="flex items-center gap-3">
                       <Coffee size={20} className={hasBreakfast ? "text-emerald-500" : "text-slate-300"} />
                       <span className={`text-sm font-black ${hasBreakfast ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500"}`}>Include Breakfast</span>
                     </div>
                     <div className={`h-6 w-10 rounded-full relative transition-colors ${hasBreakfast ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`}>
                        <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${hasBreakfast ? "right-1" : "left-1"}`} />
                     </div>
                   </button>
                </div>
              </div>
            </section>

            {/* PAYMENT CONFIG */}
            <section className="space-y-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <CreditCard size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Payment Configuration</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={inputLabelClass}>Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className={inputBaseClass}
                  >
                    <option value="arrival">On Arrival</option>
                    <option value="esewa">eSewa Digital</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={inputLabelClass}>Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                    className={inputBaseClass}
                  >
                    <option value="pending">Pending Verification</option>
                    <option value="paid">Confirmed Paid</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          {/* SIDEBAR: PRICING SUMMARY */}
          <div className="p-10 space-y-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Summary</h3>
              
              <div className="surface-panel p-6 rounded-3xl space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{booking.guests?.full_name}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{booking.guests?.email}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-widest">Selected Unit</span>
                    <span className="font-black text-slate-900 dark:text-white">{booking.cabins?.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-widest">Base Rate</span>
                    <span className="font-black text-slate-900 dark:text-white">${booking.cabins?.price_per_night}</span>
                  </div>
                </div>
              </div>

              {Pricing ? (
                <div className="surface-panel-strong p-8 rounded-[2rem] border-sky-100/50 dark:border-sky-900/20 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      <span>Stay Duration</span>
                      <span className="text-sky-500">{Pricing.nights} Nights</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      <span>Service Fee</span>
                      <span className="text-slate-900 dark:text-white">${Pricing.breakfastPrice}</span>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-sky-100 dark:border-sky-900/40">
                    <p className="text-[10px] font-black uppercase tracking-widest text-sky-500 mb-1">Estimated Total</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">${Pricing.total}</p>
                  </div>
                </div>
              ) : (
                <div className="surface-panel p-10 rounded-[2rem] border-dashed border-2 flex flex-col items-center justify-center text-center space-y-3">
                   <TrendingUp size={32} className="text-slate-200" />
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Calculated on Valid Dates</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/20">
              <div className="flex items-start gap-3">
                <Info size={18} className="text-amber-500 mt-0.5" />
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400 leading-relaxed">
                  Modifying stay dates will automatically recalculate the total price based on unit rates and active services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
