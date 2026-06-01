import type { Cabin } from "@shared/types/cabin";

interface CabinCardProps {
  cabin: Cabin;
  onBook?: (cabinId: string) => void;
}

const CabinCard = ({ cabin, onBook }: CabinCardProps) => {
  return (
    <article className="group overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={cabin.image_url || "https://images.unsplash.com/photo-1449156001437-3a1661acda71?auto=format&fit=crop&q=80&w=800"} 
          alt={cabin.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 rounded-full bg-white/90 dark:bg-slate-900/90 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 backdrop-blur-sm">
          ${cabin.price_per_night}/night
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
            {cabin.name}
          </h3>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
            <span>👥 Up to {cabin.capacity}</span>
          </div>
        </div>
        
        <p className="mb-6 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
          {cabin.description}
        </p>
        
        <button 
          onClick={() => onBook?.(cabin.id)}
          className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition-all hover:bg-emerald-700 hover:shadow-emerald-900/20 active:scale-95"
        >
          Book Now
        </button>
      </div>
    </article>
  );
};

export default CabinCard;
