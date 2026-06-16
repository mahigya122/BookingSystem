import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Cabin } from "@shared/types";

interface BookingCardProps {
    cabin: Cabin;
    hasUserReservation: boolean;
    userBookingStatus?: string;
    isBookedByOthers: boolean;
    startDate: Date | null;
    endDate: Date | null;
    breakfast: boolean;
    totalNights: number;
    baseAccommodationPrice: number;
    breakfastTotal: number;
    activitiesTotal: number;
    discountFromOffers: number;
    selectedActivities: any[];
    selectedOffers: any[];
    cleaningFee: number;
    serviceTax: number;
    totalPrice: number;
    guestCount: number;
    onBreakfastChange: (checked: boolean) => void;
    onOpenBookingModal: () => void;
    onEnterUpdateMode: () => void;
    isUpdateMode?: boolean;
}

const BookingCard = ({
    cabin,
    hasUserReservation,
    userBookingStatus,
    isBookedByOthers,
    startDate,
    endDate,
    breakfast,
    totalNights,
    baseAccommodationPrice,
    breakfastTotal,
    activitiesTotal,
    discountFromOffers,
    selectedActivities,
    selectedOffers,
    cleaningFee,
    serviceTax,
    totalPrice,
    guestCount,
    onBreakfastChange,
    onOpenBookingModal,
    onEnterUpdateMode,
    isUpdateMode = false,
}: BookingCardProps) => {
    const navigate = useNavigate();

    const isCancelled = userBookingStatus === "cancelled";

    return (
        <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            {hasUserReservation && !isUpdateMode ? (
                <div className="rounded-[2.5rem] border border-sky-150 dark:border-sky-900/30 bg-sky-50/20 dark:bg-sky-950/10 p-8 shadow-xl text-center space-y-6 animate-fade-in ring-2 ring-sky-500/10 backdrop-blur-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                        <Check className="h-7 w-7 stroke-[3]" />
                    </div>
                    <div className="space-y-4">
                        <p className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                            You have an active reservation for this cabin.
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={onEnterUpdateMode}
                                className="w-full py-3 px-6 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-sm shadow-lg shadow-sky-200/50 dark:shadow-none transition cursor-pointer"
                            >
                                UPDATE BOOKING
                            </button>
                            
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                or manage it from{" "}
                                <button
                                    onClick={() => navigate("/bookings")}
                                    className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-extrabold underline transition cursor-pointer"
                                >
                                    My Bookings
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            ) : isBookedByOthers ? (
                <div className="rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30 bg-rose-50/20 dark:bg-rose-950/10 p-8 shadow-xl text-center space-y-6 animate-fade-in ring-2 ring-rose-500/10 backdrop-blur-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                        <svg className="h-7 w-7 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <div className="space-y-3">
                        <p className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                            Dates Unavailable
                        </p>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                            This cabin is already booked for the selected dates. Please try selecting different dates on the calendar.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Price header */}
                    <div className="flex items-baseline justify-between">
                        <div>
                            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                ${cabin.price_per_night}
                            </span>
                            <span className="text-slate-400 text-sm font-bold ml-1">/ night</span>
                        </div>
                        {cabin.discount > 0 && (
                            <span className="text-xs font-extrabold bg-rose-500 text-white px-3 py-1 rounded-full uppercase tracking-wider">
                                Save ${cabin.discount}
                            </span>
                        )}
                    </div>

                    {/* Check-in / Check-out summary */}
                    <div className="rounded-2xl border border-slate-150 dark:border-slate-800 overflow-hidden divide-y divide-slate-150 dark:divide-slate-800">
                        <div className="grid grid-cols-2 divide-x divide-slate-150 dark:divide-slate-800 text-xs font-black">
                            <div className="p-3.5 space-y-1">
                                <span className="text-slate-400 uppercase tracking-wider block">Check-in</span>
                                <span className="text-slate-900 dark:text-white text-sm">
                                    {startDate ? startDate.toLocaleDateString() : "Select Date"}
                                </span>
                            </div>
                            <div className="p-3.5 space-y-1">
                                <span className="text-slate-400 uppercase tracking-wider block">Check-out</span>
                                <span className="text-slate-900 dark:text-white text-sm">
                                    {endDate ? endDate.toLocaleDateString() : "Select Date"}
                                </span>
                            </div>
                        </div>
                        <div className="p-3.5 space-y-1">
                            <span className="text-slate-400 text-xs font-black uppercase tracking-wider block">Guests</span>
                            <span className="text-slate-900 dark:text-white text-sm font-extrabold">
                                {guestCount} guest{guestCount > 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>

                    {/* Breakfast toggle */}
                    <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 cursor-pointer group hover:bg-sky-500/10 transition">
                        <input
                            type="checkbox"
                            checked={breakfast}
                            onChange={(e) => onBreakfastChange(e.target.checked)}
                            className="h-5 w-5 rounded-md text-sky-600 border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-sky-500"
                        />
                        <div className="space-y-0.5">
                            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 block group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                                Premium Breakfast (+ $15/night)
                            </span>
                            <span className="text-xs font-bold text-slate-550">Fresh organic locally sourced ingredients</span>
                        </div>
                    </label>

                    {/* Price breakdown */}
                    {totalNights > 0 && (
                        <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-sm font-bold text-slate-600 dark:text-slate-400">
                            <div className="flex justify-between">
                                <span className="underline decoration-slate-300 dark:decoration-slate-700 cursor-pointer">
                                    ${cabin.price_per_night} x {totalNights} nights
                                </span>
                                <span className="text-slate-900 dark:text-white font-extrabold">${baseAccommodationPrice}</span>
                            </div>
                            {breakfast && (
                                <div className="flex justify-between">
                                    <span>Breakfast fee</span>
                                    <span className="text-slate-900 dark:text-white font-extrabold">${breakfastTotal}</span>
                                </div>
                            )}
                            {activitiesTotal > 0 && (
                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <span>Extra activities</span>
                                        <span className="text-slate-900 dark:text-white font-extrabold">${activitiesTotal}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 px-1">
                                        {selectedActivities.map((a: any) => (
                                            <span key={a.id} className="text-[10px] bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full border border-sky-100 dark:border-sky-900/30">
                                                {a.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {discountFromOffers > 0 && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                                        <span>Special offers discount</span>
                                        <span className="font-extrabold">-${discountFromOffers.toFixed(0)}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 px-1">
                                        {selectedOffers.map((o: any) => (
                                            <span key={o.id} className="text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                                                {o.name || o.title}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Cleaning fee</span>
                                <span className="text-slate-900 dark:text-white font-extrabold">${cleaningFee}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Local service tax</span>
                                <span className="text-slate-900 dark:text-white font-extrabold">${serviceTax}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 text-base font-black text-slate-900 dark:text-white">
                                <span>Total price</span>
                                <span>${totalPrice}</span>
                            </div>
                        </div>
                    )}

                    {/* Book button */}
                    <div className="sticky bottom-0 pt-4 bg-white dark:bg-slate-900">
                        <button
                            onClick={onOpenBookingModal}
                            className="w-full rounded-full bg-gradient-to-r from-sky-400 to-sky-500 hover:to-sky-600 text-white py-4 font-black shadow-xl shadow-sky-200/50 dark:shadow-none hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                        >
                            {isUpdateMode 
                                ? "UPDATE BOOKING" 
                                : isCancelled 
                                    ? "BOOK AGAIN" 
                                    : "BOOK NOW"}
                        </button>
                    </div>

                    <p className="text-center text-xs font-semibold text-slate-400">
                        {isCancelled 
                            ? "Relive the experience. Secure your new dates instantly."
                            : "You won't be charged yet. The double-booking algorithm secures your dates instantly."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BookingCard;