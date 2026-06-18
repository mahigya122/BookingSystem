import { Link } from "react-router-dom";
import { MapPin, Calendar, CheckCircle2, Clock, ShieldCheck, Compass, XCircle, ArrowRight } from "lucide-react";
import type { Cabin } from "@shared/types/cabin";
import { useCancelBooking } from "@shared/hooks";

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
  const { cancel, isCancelling } = useCancelBooking();

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

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (booking) cancel(booking.id);
  };

  return (
    <div className={`group relative flex flex-col ${isTall ? "row-span-2" : ""} ${className}`}>
      <Link
        to={`/cabin/${cabin.id}${booking ? `?bookingId=${booking.id}` : ""}`}
        className={`relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 ease-out flex-1 ${
          isTall ? "aspect-[4/5] md:aspect-auto" : "aspect-[4/3]"
        } ${glowClass}`}
      >
        <img
          src={cabin.image_url}
          alt={cabin.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
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
            <h3 className={`text-white font-black leading-tight group-hover:text-sky-400 transition-colors ${
              isSmall ? "text-xs" : "text-sm md:text-xl"
            }`}>
              {cabin.name}
            </h3>
            <div className={`flex items-center gap-1.5 ${isSmall ? "mt-0.5" : "mt-1"}`}>
              <MapPin size={isSmall ? 10 : 12} className="text-sky-400 shrink-0" />
              <p className={`text-white/70 font-medium truncate ${
                isSmall ? "text-[9px]" : "text-[10px] md:text-sm"
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

      {/* Booking Actions */}
      {booking && booking.realStatus === "booked" && (
        <div className="flex gap-2 mt-3 animate-in slide-in-from-top-2 duration-500">
           <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white dark:bg-rose-950/30 dark:hover:bg-rose-600 dark:text-rose-400 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 border border-rose-100 dark:border-rose-900/50 hover:border-rose-600 disabled:opacity-50 cursor-pointer"
          >
            <XCircle size={14} />
            Cancel
          </button>
          <Link
            to={`/cabin/${cabin.id}?bookingId=${booking.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-sky-600 text-white py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 transition-all duration-300 shadow-lg shadow-sky-500/10 cursor-pointer"
          >
            Details
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default CabinCard;



