import { ArrowRight, Loader2, Shield, User } from "lucide-react";
import PaymentSelector from "../../../payments/components/PaymentSelector";
import type { Cabin } from "@shared/types";

interface CheckoutModalProps {
    cabin: Cabin;
    checkoutStep: "summary" | "payment";
    startDate: Date | null;
    endDate: Date | null;
    totalNights: number;
    guestCount: number;
    fullName: string | null;
    phone: string | null;
    breakfast: boolean;
    baseAccommodationPrice: number;
    breakfastTotal: number;
    activitiesTotal: number;
    discountFromOffers: number;
    selectedActivities: any[];
    selectedOffers: any[];
    totalPrice: number;
    paymentMethod: string;
    isBookingPending: boolean;
    onClose: () => void;
    onStepChange: (step: "summary" | "payment") => void;
    onPaymentMethodChange: (method: string) => void;
    onConfirm: () => void;
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
    isBookingPending,
    onClose,
    onStepChange,
    onPaymentMethodChange,
    onConfirm,
}: CheckoutModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-800/80 animate-zoom-in space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                            {checkoutStep === "summary" ? "Checkout Summary" : "Payment Method"}
                        </h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                            Step {checkoutStep === "summary" ? "1" : "2"} of 2
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-xl cursor-pointer"
                    >
                        ×
                    </button>
                </div>

                {checkoutStep === "summary" ? (
                    <div className="space-y-6">
                        {/* Stay Info */}
                        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 space-y-4">
                            <div className="flex gap-4">
                                <div className="h-16 w-16 rounded-2xl overflow-hidden shrink-0">
                                    <img src={cabin.image_url} alt="" className="h-full w-full object-cover" />
                                </div>
                                <div>
                                    <p className="font-black text-slate-900 dark:text-white">{cabin.name}</p>
                                    <p className="text-xs font-bold text-slate-500">
                                        {totalNights} Nights • {guestCount} Guests
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Check-in</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                        {startDate?.toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Check-out</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                        {endDate?.toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Guest Info */}
                        <div className="p-5 rounded-3xl border border-sky-100 dark:border-sky-900/30 bg-sky-50/30 dark:bg-sky-900/10 space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">
                                Guest Information
                            </h4>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400">
                                    <User size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white leading-tight">{fullName}</p>
                                    <p className="text-xs font-medium text-slate-500">{phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-2 px-2">
                            <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-400">
                                <span>Accommodation</span>
                                <span>${baseAccommodationPrice}</span>
                            </div>
                            {breakfast && (
                                <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-400">
                                    <span>Breakfast Fee</span>
                                    <span>${breakfastTotal}</span>
                                </div>
                            )}
                            {activitiesTotal > 0 && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-400">
                                        <span>Extra Activities</span>
                                        <span>${activitiesTotal}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedActivities.map((a: any) => (
                                            <span key={a.id} className="text-[9px] bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full border border-sky-100 dark:border-sky-900/30 font-black uppercase">
                                                {a.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {discountFromOffers > 0 && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                        <span>Offers Discount</span>
                                        <span>-${discountFromOffers.toFixed(0)}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedOffers.map((o: any) => (
                                            <span key={o.id} className="text-[9px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30 font-black uppercase">
                                                {o.name || o.title}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                <span>Total</span>
                                <span className="text-sky-600 dark:text-sky-450">${totalPrice}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => onStepChange("payment")}
                            className="w-full rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 font-black hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                            Continue to Payment <ArrowRight size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6 animate-slide-up">
                        <PaymentSelector onSelect={onPaymentMethodChange} />

                        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 flex items-start gap-3">
                            <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 leading-relaxed">
                                All transactions are secured and encrypted. Payment info is never stored on our servers.
                            </p>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button
                                onClick={() => onStepChange("summary")}
                                className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 py-3.5 font-bold hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400"
                            >
                                Back
                            </button>
                            <button
                                disabled={isBookingPending}
                                onClick={onConfirm}
                                className="flex-[2] rounded-full bg-sky-500 py-3.5 font-black text-white hover:bg-sky-600 shadow-lg shadow-sky-200/50 dark:shadow-none flex justify-center items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {isBookingPending ? (
                                    <>
                                        <Loader2 className="h-4.5 w-4.5 animate-spin" /> Confirming...
                                    </>
                                ) : (
                                    <>Confirm & Reserve Stay</>
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
