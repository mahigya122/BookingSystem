import type { Cabin } from "@shared/types";
import CabinCard from "../components/CabinCard";

interface RecentlyViewedProps {
    cabins: Cabin[];
}

const RecentlyViewed = ({ cabins }: RecentlyViewedProps) => {
    const safeCabins = Array.isArray(cabins) ? cabins : [];
    if (safeCabins.length === 0) return null;

    return (
        <div className="space-y-6 border-t border-slate-150 dark:border-slate-800/80 pt-8 md:pt-12">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Recently Viewed Stays
            </h2>

            <div className="grid grid-cols-2 gap-4">
                {safeCabins.map((recentCabin) => (
                    <CabinCard 
                        key={recentCabin.id} 
                        cabin={recentCabin} 
                        variant="small" 
                    />
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;
