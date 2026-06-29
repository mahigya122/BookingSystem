import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, CheckCircle2, Clock, ShieldCheck, Compass } from "lucide-react";
import type { Cabin } from "@shared/types/cabin";
import { getOptimizedImageUrl } from "@shared/utils/imageUtils";
import { useCancelBooking, useUser } from "@shared/hooks";
import ReviewForm from "../details/ReviewForm";

interface CabinCardProps {
  cabin: Cabin & {
    isBookedByUser?: boolean;
    isBookedByOthers?: boolean;
    isBooked?: boolean;
  };
  variant?: "tall" | "small" | "default";
  className?: string;
  booking?: {
    id: string;
    start_date: string;
    end_date: string;
    status?: string;
    total_price?: number;
    realStatus?: string;
  };
}

const CabinCard = ({ cabin, variant = "default", className = "", booking }: CabinCardProps) => {
  const { isBookedByUser, isBookedByOthers } = cabin;

  const { user } = useUser();
  const { cancel, isCancelling } = useCancelBooking();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleCancelBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (booking && window.confirm("Are you sure you want to cancel this reservation?")) {
      cancel(booking.id);
    }
  };

  let glowClass = "";
  let badge = null;

  if (isBookedByUser || (booking && booking.realStatus !== "cancelled")) {
    glowClass = "ring-4 ring-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)]";
    if (!booking) {
      badge = (
        <div className="absolute top-4 left-4 z-10 bg-emerald-600 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
          Your Booking
        </div>
      );
    }
  } else if (isBookedByOthers) {
    glowClass = "ring-4 ring-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.3)]";
    badge = (
      <div className="absolute top-4 left-4 z-10 bg-rose-600 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
        Unavailable
      </div>
    );
  }

  // Handle booking status badges
  if (booking) {
    const { realStatus } = booking;
    let statusLabel = "Reserved";
    let statusBg = "bg-blue-600";
    let StatusIcon = Clock;

    if (realStatus === "checked-in") {
      statusLabel = "Checked In";
      statusBg = "bg-amber-600";
      StatusIcon = ShieldCheck;
    } else if (realStatus === "checked-out") {
      statusLabel = "Completed";
      statusBg = "bg-emerald-600";
      StatusIcon = CheckCircle2;
    } else if (realStatus === "cancelled") {
      statusLabel = "Cancelled";
      statusBg = "bg-rose-600";
      StatusIcon = Compass;
      glowClass = "opacity-75 grayscale-[0.5]";
    }

    badge = (
      <div className={`absolute top-4 left-4 z-10 ${statusBg} text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5`}>
        <StatusIcon size={12} strokeWidth={3} />
        {statusLabel}
      </div>
    );
  }

  const isTall = variant === "tall";
  const isSmall = variant === "small";

  const displayPrice = booking ? booking.total_price : cabin.price_per_night;

  return (
    <div className={`group relative flex flex-col ${isTall ? "row-span-2" : ""} ${className}`}>
      <Link
        to={`/cabin/${cabin.id}${booking ? `?bookingId=${booking.id}` : ""}`}
        className={`relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 ease-out flex-1 ${isTall ? "aspect-[4/5] md:aspect-auto" : "aspect-[4/3]"
          } ${glowClass}`}
      >
        <img
          src={getOptimizedImageUrl(cabin.image_url, isSmall ? 'preview' : isTall ? 'medium' : 'featured')}
          alt={cabin.name}
          loading="lazy"
          width={isSmall ? 300 : isTall ? 500 : 600}
          height={isSmall ? 225 : isTall ? 625 : 450}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=600&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

        {badge}

        {/* Price tag */}
        <div className={`absolute ${isSmall ? "top-2 right-2 px-2 py-0.5" : "top-3 right-3 md:top-4 md:right-4 px-2.5 py-1 md:px-3 md:py-1.5"} bg-white/90 backdrop-blur-md rounded-xl shadow-lg z-10`}>
          <span className={`text-slate-900 font-black ${isSmall ? "text-[10px]" : "text-xs md:text-sm"}`}>${displayPrice}</span>
          {!isSmall && !booking && <span className="text-slate-500 text-[9px] md:text-[10px] ml-0.5">/nt</span>}
          {booking && <span className="text-slate-500 text-[9px] md:text-[10px] ml-0.5">Total</span>}
        </div>

        <div className={`absolute bottom-0 left-0 ${isSmall ? "p-3" : "p-4 md:p-6"} w-full space-y-2`}>
          <div>
            <h3 className={`text-white font-black leading-tight group-hover:text-sky-400 transition-colors ${isSmall ? "text-xs" : "text-sm md:text-xl"
              }`}>
              {cabin.name}
            </h3>
            <div className={`flex items-center gap-1.5 ${isSmall ? "mt-0.5" : "mt-1"}`}>
              <MapPin size={isSmall ? 10 : 12} className="text-sky-400 shrink-0" />
              <p className={`text-white/70 font-medium truncate ${isSmall ? "text-[9px]" : "text-[10px] md:text-sm"
                }`}>
                {cabin.location?.name || "Private Location"}
              </p>
            </div>
          </div>

          {booking && (
            <div className="flex items-center gap-2 pt-1 border-t border-white/10">
              <Calendar size={12} className="text-sky-400" />
              <p className="text-white font-bold text-[10px] md:text-xs">
                {new Date(booking.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(booking.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          )}
        </div>
      </Link>

      {/* Action Buttons for Booking (My Trip Section) */}
      {booking && (
        <div className="flex gap-2.5 mt-3 w-full shrink-0">
          {booking.realStatus === "booked" && (
            <button
              onClick={handleCancelBooking}
              disabled={isCancelling}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white dark:bg-rose-950/30 dark:hover:bg-rose-600 dark:text-rose-400 font-extrabold text-[11px] uppercase tracking-wider transition-all border border-rose-100 dark:border-rose-900/50 hover:border-rose-600 disabled:opacity-50 cursor-pointer"
            >
              {isCancelling ? "Cancelling..." : "Cancel Stay"}
            </button>
          )}
          {(booking.realStatus === "checked-in" || booking.realStatus === "checked-out") && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsReviewModalOpen(true);
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-sky-50/50 hover:bg-sky-600 border border-sky-100 dark:border-sky-900/30 text-sky-700 hover:text-white dark:bg-sky-950/30 dark:hover:bg-sky-600 dark:text-sky-400 font-extrabold text-[11px] uppercase tracking-wider transition-all cursor-pointer"
            >
              Share Experience
            </button>
          )}
        </div>
      )}

      {/* Review Dialog Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-955/70 backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
          <div className="relative rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 w-full max-w-md">
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-5 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 text-2xl font-black cursor-pointer leading-none"
            >
              &times;
            </button>
            <div className="mb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Share Your Stay</h3>
              <p className="text-xs text-slate-500 mt-0.5">Let others know how your stay at {cabin.name} was!</p>
            </div>
            <ReviewForm
              cabinId={cabin.id}
              guestId={user?.id || ""}
              onSuccess={() => {
                setIsReviewModalOpen(false);
              }}
              isEmbedded={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CabinCard;



