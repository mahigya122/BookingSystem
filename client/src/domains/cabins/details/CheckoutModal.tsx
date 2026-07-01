import {
  ArrowRight,
  Loader2,
  Shield,
  User,
  Mountain,
  Trees,
  Waves,
  Bike,
  Wind,
  Flame,
  Fish,
  Footprints,
  Sparkles,
} from "lucide-react";
import type { Cabin } from "@shared/types";
import { getOptimizedImageUrl } from "@shared/utils/imageUtils";
import type { PaymentMethod } from "../../payments/payment.types";

import type { Activity } from "@shared/types/activity";
import type { Offer } from "@shared/types/offer";

const iconMap: Record<string, any> = {
  mountain: Mountain,
  snowflake: Trees,
  fish: Fish,
  waves: Waves,
  bike: Bike,
  flame: Flame,
  sparkles: Sparkles,
  compass: Sparkles,
  map: Sparkles,
  tent: Trees,
  trees: Trees,
  anchor: Waves,
  eye: Sparkles,
  footprints: Footprints,
  heart: Sparkles,
  wind: Wind,
};

const getIconForActivity = (activity: Activity) => {
  if (activity.icon && iconMap[activity.icon.toLowerCase()]) {
    return iconMap[activity.icon.toLowerCase()];
  }
  const nameLower = activity.name.toLowerCase();

  if (
    nameLower.includes("hike") ||
    nameLower.includes("trek") ||
    nameLower.includes("climb")
  )
    return Mountain;
  if (
    nameLower.includes("safari") ||
    nameLower.includes("jungle") ||
    nameLower.includes("forest") ||
    nameLower.includes("wildlife")
  )
    return Trees;
  if (
    nameLower.includes("boat") ||
    nameLower.includes("water") ||
    nameLower.includes("raft") ||
    nameLower.includes("lake")
  )
    return Waves;
  if (nameLower.includes("cycle") || nameLower.includes("bike")) return Bike;
  if (
    nameLower.includes("fly") ||
    nameLower.includes("para") ||
    nameLower.includes("glide")
  )
    return Wind;
  if (
    nameLower.includes("jump") ||
    nameLower.includes("bungee") ||
    nameLower.includes("extreme") ||
    nameLower.includes("adrenaline")
  )
    return Flame;
  if (nameLower.includes("fish") || nameLower.includes("angling")) return Fish;
  if (nameLower.includes("walk") || nameLower.includes("nature"))
    return Footprints;

  return Sparkles;
};

interface CheckoutModalProps {
  cabin: Cabin;
  checkoutStep: "activities" | "summary" | "payment";
  startDate: Date | null;
  endDate: Date | null;
  totalNights: number;
  guestCount: number;
  fullName: string;
  phone: string;
  breakfast: boolean;
  baseAccommodationPrice: number;
  breakfastTotal: number;
  activitiesTotal: number;
  discountFromOffers: number;
  selectedActivities: Activity[];
  selectedOffers: Offer[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  isBookingPending: boolean;
  onClose: () => void;
  onStepChange: (step: "activities" | "summary" | "payment") => void;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onConfirm: () => void;
  onToggleActivity: (activity: Activity) => void;
}

const CheckoutModal = ({
  cabin,
  checkoutStep,
  startDate,
  endDate,
  totalNights,
  guestCount,
  fullName,
  phone,
  breakfast,
  baseAccommodationPrice,
  breakfastTotal,
  activitiesTotal,
  discountFromOffers,
  selectedActivities,
  selectedOffers,
  totalPrice,
  paymentMethod,
  isBookingPending,
  onClose,
  onStepChange,
  onPaymentMethodChange,
  onConfirm,
  onToggleActivity,
}: CheckoutModalProps) => {
  const hasActivities = cabin.activities && cabin.activities.length > 0;
  const totalSteps = hasActivities ? 3 : 2;
  let stepNumber = 1;
  let stepTitle = "";

  if (checkoutStep === "activities") {
    stepNumber = 1;
    stepTitle = "Select Activities";
  } else if (checkoutStep === "summary") {
    stepNumber = hasActivities ? 2 : 1;
    stepTitle = "Checkout Summary";
  } else if (checkoutStep === "payment") {
    stepNumber = hasActivities ? 3 : 2;
    stepTitle = "Payment Method";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-800/80 animate-zoom-in space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {stepTitle}
            </h3>
            <p className="text-xs font-bold text-slate-550 uppercase tracking-widest mt-1">
              Step {stepNumber} of {totalSteps}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-xl cursor-pointer"
          >
            ×
          </button>
        </div>

        {checkoutStep === "activities" ? (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2 text-left">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                Enhance Your Stay
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select any optional activities offered during your stay. The
                price will be updated automatically:
              </p>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {cabin.activities?.map((activity) => {
                const isSelected = selectedActivities.some(
                  (act) => act.id === activity.id,
                );
                const Icon = getIconForActivity(activity);
                return (
                  <div
                    key={activity.id}
                    onClick={() => onToggleActivity(activity)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-sky-500 bg-sky-500/5 dark:bg-sky-500/10"
                        : "border-slate-100 dark:border-slate-850 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-950/20"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-sky-500 text-white"
                            : "bg-sky-100 dark:bg-sky-955 text-sky-600 dark:text-sky-400"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 text-left">
                        <span className="text-sm font-extrabold block text-slate-800 dark:text-slate-200 leading-snug">
                          {activity.name}
                        </span>
                        {activity.description && (
                          <span className="text-[11px] text-slate-400 dark:text-slate-550 block truncate max-w-[220px]">
                            {activity.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {activity.price && activity.price > 0 && (
                        <span className="text-sm font-black text-sky-600 dark:text-sky-455">
                          +${activity.price}
                        </span>
                      )}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by div onClick
                        className="h-5 w-5 rounded-md text-sky-600 border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-sky-500 pointer-events-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Activities price footer details */}
            <div className="flex justify-between items-center p-4 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/10 text-sm font-bold text-slate-655 dark:text-slate-400">
              <span>Selected Activities ({selectedActivities.length})</span>
              <span className="text-slate-900 dark:text-white font-black">
                +${activitiesTotal}
              </span>
            </div>

            <button
              onClick={() => onStepChange("summary")}
              className="w-full rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 font-black hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue to Summary <ArrowRight size={18} />
            </button>
          </div>
        ) : checkoutStep === "summary" ? (
          <div className="space-y-6">
            {/* Stay Info */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 space-y-4">
              <div className="flex gap-4">
                <div className="h-16 w-16 rounded-2xl overflow-hidden shrink-0">
                  <img
                    src={getOptimizedImageUrl(cabin.image_url, "thumbnail")}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="font-black text-slate-900 dark:text-white">
                    {cabin.name}
                  </p>
                  <p className="text-xs font-bold text-slate-550">
                    {totalNights} Nights • {guestCount} Guests
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                <div className="space-y-1 text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Check-in
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {startDate?.toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1 text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Check-out
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {endDate?.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Guest Info */}
            <div className="p-5 rounded-3xl border border-sky-100 dark:border-sky-900/30 bg-sky-50/30 dark:bg-sky-900/10 space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 text-left">
                Guest Information
              </h4>
              <div className="flex items-center gap-4 text-left">
                <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <User size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white leading-tight">
                    {fullName}
                  </p>
                  <p className="text-xs font-medium text-slate-500">{phone}</p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4 px-2 text-left">
              {/* SECTION 1: ACCOMMODATION */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Accommodation
                </p>
                <div className="flex justify-between text-sm font-bold text-slate-655 dark:text-slate-400">
                  <span>Accommodation Price</span>
                  <span>${baseAccommodationPrice.toFixed(2)}</span>
                </div>

                {discountFromOffers > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      <span>Offer/Promotion Discount</span>
                      <span>-${discountFromOffers.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedOffers.map((o: Offer) => (
                        <span
                          key={o.id}
                          className="text-[9px] bg-emerald-50 dark:bg-emerald-955/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30 font-black uppercase"
                        >
                          {o.name || o.title}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] leading-relaxed text-slate-400 italic">
                      "Discounts apply to accommodation charges only. Optional
                      activities and additional services are charged at their
                      regular price."
                    </p>
                  </div>
                )}

                <div className="flex justify-between text-sm font-black text-slate-800 dark:text-white pt-1 border-t border-slate-100 dark:border-slate-850">
                  <span>Accommodation Subtotal</span>
                  <span>
                    ${(baseAccommodationPrice - discountFromOffers).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* SECTION 2: ADDITIONAL SERVICES */}
              {(breakfast || activitiesTotal > 0) && (
                <div className="space-y-2.5 pt-2 border-t border-slate-150/80 dark:border-slate-800/80">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Additional Services
                  </p>

                  {breakfast && (
                    <div className="flex justify-between text-sm font-bold text-slate-655 dark:text-slate-400">
                      <span>Breakfast Fee</span>
                      <span>+${breakfastTotal.toFixed(2)}</span>
                    </div>
                  )}

                  {activitiesTotal > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm font-bold text-slate-655 dark:text-slate-400">
                        <span>Extra Activities</span>
                        <span>+${activitiesTotal.toFixed(2)}</span>
                      </div>
                      <div className="space-y-1 pl-4 border-l-2 border-sky-100 dark:border-sky-950/40">
                        {selectedActivities.map((a: Activity) => (
                          <div
                            key={a.id}
                            className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400"
                          >
                            <span>• {a.name}</span>
                            <span>${(a.price || 0).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 3: ORDER TOTAL */}
              <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between text-lg font-black text-slate-900 dark:text-white">
                  <span>Final Total</span>
                  <span className="text-sky-650 dark:text-sky-400">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Back / Next buttons */}
            <div className="flex gap-4 pt-2">
              {hasActivities && (
                <button
                  onClick={() => onStepChange("activities")}
                  className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 py-3.5 font-bold hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-655 dark:text-slate-400"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => onStepChange("payment")}
                className={`rounded-full py-3.5 font-black text-white shadow-lg transition flex justify-center items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 bg-slate-900 dark:bg-white dark:text-slate-900 hover:opacity-90 ${
                  hasActivities ? "flex-[2]" : "w-full"
                }`}
              >
                Continue to Payment <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
            {/* Selector title */}
            <div className="text-left">
              <h4 className="text-sm font-extrabold text-slate-850 dark:text-slate-200 uppercase tracking-wider">
                Select Payment Option
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Choose how you would like to settle the reservation:
              </p>
            </div>

            {/* Option cards */}
            <div className="space-y-4">
              {/* Option 1: 20% Deposit */}
              <div
                onClick={() => onPaymentMethodChange("esewa_deposit")}
                className={`p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer relative text-left ${
                  paymentMethod === "esewa_deposit"
                    ? "border-sky-500 bg-sky-500/5 shadow-md shadow-sky-500/5"
                    : "border-slate-150 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/20 dark:bg-slate-950/10"
                }`}
              >
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-sky-100 dark:bg-sky-950 text-sky-655 dark:text-sky-400 border border-sky-200/30 dark:border-sky-900/30">
                  Recommended
                </span>

                <div className="flex items-center gap-3">
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "esewa_deposit"
                        ? "border-sky-500 bg-sky-500"
                        : "border-slate-350"
                    }`}
                  >
                    {paymentMethod === "esewa_deposit" && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Option 1: 20% Down Payment
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Pay deposit online, balance upon arrival
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-150/70 dark:border-slate-800/80 grid grid-cols-2 gap-4 text-xs font-bold text-slate-550 dark:text-slate-400">
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
                      Due Now
                    </p>
                    <p className="text-sm font-black text-sky-600 dark:text-sky-455">
                      ${(totalPrice * 0.2).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
                      Due At Arrival
                    </p>
                    <p className="text-sm font-black text-slate-700 dark:text-slate-300">
                      ${(totalPrice * 0.8).toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2.5 leading-snug">
                  * Settle the 80% remaining balance at check-in via Cash or
                  eSewa.
                </p>
              </div>

              {/* Option 2: Pay in Full */}
              <div
                onClick={() => onPaymentMethodChange("esewa_full")}
                className={`p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer relative text-left ${
                  paymentMethod === "esewa_full"
                    ? "border-sky-500 bg-sky-500/5 shadow-md shadow-sky-500/5"
                    : "border-slate-150 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/20 dark:bg-slate-950/10"
                }`}
              >
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-655 dark:text-emerald-400 border border-emerald-200/30 dark:border-emerald-900/30">
                  Save 5%
                </span>

                <div className="flex items-center gap-3">
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "esewa_full"
                        ? "border-sky-500 bg-sky-500"
                        : "border-slate-350"
                    }`}
                  >
                    {paymentMethod === "esewa_full" && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Option 2: Pay in Full
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Settle entire booking now with instant discount
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-150/70 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-xs font-bold text-slate-550 dark:text-slate-400">
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
                      Subtotal
                    </p>
                    <p className="text-slate-500 line-through">
                      ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
                      Discount
                    </p>
                    <p className="text-emerald-600 dark:text-emerald-400">
                      -${(totalPrice * 0.05).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
                      Payable Now
                    </p>
                    <p className="text-sm font-black text-sky-600 dark:text-sky-455">
                      ${(totalPrice * 0.95).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Policy Box */}
            <div className="p-4 rounded-3xl border border-sky-100 dark:border-sky-900/30 bg-sky-50/10 dark:bg-sky-950/10 space-y-2 text-left">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    Cancellation & Refund Policy
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    If the booking is cancelled according to the property's
                    cancellation policy, any payment made (deposit or full
                    payment) will be fully refunded.
                  </p>
                </div>
              </div>

              {/* Expandable policy details */}
              <details className="group px-8">
                <summary className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-wider cursor-pointer list-none flex items-center gap-1 select-none hover:opacity-85">
                  <span>View Complete Cancellation Policy</span>
                  <span className="transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-2 space-y-1.5 list-disc list-inside">
                  <p>
                    • Cancel up to 24 hours before check-in time to receive a
                    100% full refund.
                  </p>
                  <p>
                    • Cancellations requested within 24 hours of check-in are
                    subject to a one-night fee.
                  </p>
                  <p>
                    • Refund processing takes between 3 to 5 business days back
                    to your eSewa account.
                  </p>
                </div>
              </details>
            </div>

            {/* eSewa secure payment badge */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 text-xs text-slate-655 dark:text-slate-400 font-bold">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-black tracking-widest text-sm">
                  🟢 eSewa
                </span>
                <span>Secure Gateway</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Shield size={12} className="text-emerald-500" /> Secured
                Transaction
              </span>
            </div>

            {/* Back / Pay buttons */}
            <div className="flex gap-4 pt-2">
              <button
                onClick={() => onStepChange("summary")}
                className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 py-3.5 font-bold hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400"
              >
                Back
              </button>
              <button
                disabled={isBookingPending || !paymentMethod}
                onClick={onConfirm}
                className={`flex-[2] rounded-full py-3.5 font-black text-white shadow-lg transition flex justify-center items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
                  !paymentMethod || isBookingPending
                    ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none hover:translate-y-0 hover:opacity-100"
                    : "bg-sky-500 hover:bg-sky-600 shadow-sky-200/50 dark:shadow-none"
                }`}
              >
                {isBookingPending ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />{" "}
                    Confirming...
                  </>
                ) : (
                  <>Proceed to Pay</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
