import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import type { Cabin } from "@shared/types/cabin";

interface CabinCardProps {
  cabin: Cabin & {
    isBookedByUser?: boolean;
    isBookedByOthers?: boolean;
    isBooked?: boolean;
  };
}

const CabinCard = ({ cabin }: CabinCardProps) => {
  const { isBookedByUser, isBookedByOthers } = cabin;

  let glowClass = "";
  let badge = null;

  if (isBookedByUser) {
    glowClass = "ring-4 ring-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.5)]";
    badge = (
      <div className="absolute top-4 left-4 z-10 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
        Your Booking
      </div>
    );
  } else if (isBookedByOthers) {
    glowClass = "ring-4 ring-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.5)]";
    badge = (
      <div className="absolute top-4 left-4 z-10 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
        Unavailable
      </div>
    );
  }

  return (
    <Link
      to={`/cabin/${cabin.id}`}
      className={`group block relative rounded-[1.5rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-500 ease-out ${glowClass}`}
    >
      {badge}
      {/* CARD IMAGE WRAPPER */}
      <div className="relative aspect-[16/11] overflow-hidden">
        <img
          src={cabin.image_url}
          alt={cabin.name}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Soft elegant image gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Price tag on image */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
           <span className="text-slate-900 font-black text-xs">${cabin.price_per_night}</span>
           <span className="text-slate-500 text-[9px] ml-0.5">/ night</span>
        </div>
      </div>

      {/* CARD INFO (MINIMALIST & ULTRA-PREMIUM) */}
      <div className="p-4 flex items-center justify-between bg-white dark:bg-slate-900">
        <div className="space-y-0.5">
          <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300">
            {cabin.name}
          </h3>
          <p className="text-[10px] text-slate-500 flex items-center gap-1">
             <MapPin size={10} className="text-sky-500" /> 
             {cabin.location?.name || "Private Location"}
          </p>
        </div>
        
        {/* Elegant Arrow Icon that appears on hover */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
          <svg
            className="h-3.5 w-3.5 stroke-[2.5]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default CabinCard;
