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
    Sparkles 
} from "lucide-react";
import PaymentSelector from "../../payments/PaymentSelector";
import type { Cabin } from "@shared/types";
import { getOptimizedImageUrl } from "@shared/utils/imageUtils";

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
    
    if (nameLower.includes("hike") || nameLower.includes("trek") || nameLower.includes("climb")) return Mountain;
    if (nameLower.includes("safari") || nameLower.includes("jungle") || nameLower.includes("forest") || nameLower.includes("wildlife")) return Trees;
    if (nameLower.includes("boat") || nameLower.includes("water") || nameLower.includes("raft") || nameLower.includes("lake")) return Waves;
    if (nameLower.includes("cycle") || nameLower.includes("bike")) return Bike;
    if (nameLower.includes("fly") || nameLower.includes("para") || nameLower.includes("glide")) return Wind;
    if (nameLower.includes("jump") || nameLower.includes("bungee") || nameLower.includes("extreme") || nameLower.includes("adrenaline")) return Flame;
    if (nameLower.includes("fish") || nameLower.includes("angling")) return Fish;
    if (nameLower.includes("walk") || nameLower.includes("nature")) return Footprints;
    
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
    paymentMethod: string;
    isBookingPending: boolean;
    onClose: () => void;
    onStepChange: (step: "activities" | "summary" | "payment") => void;
    onPaymentMethodChange: (method: string) => void;
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
            <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-800/80 animate-zoom-in space-y-6 max-h-[90dvh] overflow-y-auto lg:max-h-none lg:overflow-visible">
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
                                Select any optional activities offered during your stay. The price will be updated automatically:
                            </p>
                        </div>

                        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                            {cabin.activities?.map((activity) => {
                                const isSelected = selectedActivities.some(act => act.id === activity.id);
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
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                                isSelected ? "bg-sky-500 text-white" : "bg-sky-100 dark:bg-sky-955 text-sky-600 dark:text-sky-400"
                                            }`}>
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
                            <span className="text-slate-900 dark:text-white font-black">+${activitiesTotal}</span>
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
                                    <img src={getOptimizedImageUrl(cabin.image_url, 'thumbnail')} alt="" className="h-full w-full object-cover" />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-slate-900 dark:text-white">{cabin.name}</p>
                                    <p className="text-xs font-bold text-slate-550">
                                        {totalNights} Nights • {guestCount} Guests
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                                <div className="space-y-1 text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Check-in</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                        {startDate?.toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="space-y-1 text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Check-out</p>
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
                                    <p className="font-bold text-slate-900 dark:text-white leading-tight">{fullName}</p>
                                    <p className="text-xs font-medium text-slate-500">{phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-2 px-2 text-left">
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
                                        {selectedActivities.map((a: Activity) => (
                                            <span key={a.id} className="text-[9px] bg-sky-50 dark:bg-sky-955/30 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full border border-sky-100 dark:border-sky-900/30 font-black uppercase">
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
                                        {selectedOffers.map((o: Offer) => (
                                            <span key={o.id} className="text-[9px] bg-emerald-50 dark:bg-emerald-955/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30 font-black uppercase">
                                                {o.name || o.title}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                <span>Total</span>
                                <span className="text-sky-600 dark:text-sky-455">${totalPrice}</span>
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
                        <PaymentSelector selectedMethod={paymentMethod} onSelect={onPaymentMethodChange} />

                        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 flex items-start gap-3">
                            <Shield className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 leading-relaxed text-left">
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
                                disabled={isBookingPending || !paymentMethod}
                                onClick={onConfirm}
                                className={`flex-[2] rounded-full py-3.5 font-black text-white shadow-lg transition flex justify-center items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
                                    (!paymentMethod || isBookingPending)
                                        ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none hover:translate-y-0 hover:opacity-100"
                                        : "bg-sky-500 hover:bg-sky-600 shadow-sky-200/50 dark:shadow-none"
                                }`}
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
