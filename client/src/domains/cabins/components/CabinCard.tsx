import { Link } from "react-router-dom";
import type { Cabin } from "@shared/types/cabin";

const CabinCard = ({ cabin }: { cabin: Cabin }) => {
  return (
    <Link
      to={`/user/cabin/${cabin.id}`}
      className="group block relative rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 ease-out"
    >
      {/* CARD IMAGE WRAPPER */}
      <div className="relative aspect-[16/12] overflow-hidden">
        <img
          src={cabin.image_url}
          alt={cabin.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Soft elegant image gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* CARD INFO (MINIMALIST & ULTRA-PREMIUM) */}
      <div className="p-5 flex items-center justify-between bg-white dark:bg-slate-900">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
            {cabin.name}
          </h3>
        </div>
        
        {/* Elegant Arrow Icon that appears on hover */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
          <svg
            className="h-4 w-4 stroke-[2.5]"
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