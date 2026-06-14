import { useNavigate } from "react-router-dom";
import type { Cabin } from "@shared/types";

interface RecentlyViewedProps {
    cabins: Cabin[];
}

const RecentlyViewed = ({ cabins }: RecentlyViewedProps) => {
    const navigate = useNavigate();

    if (cabins.length === 0) return null;

    return (
        <div className="space-y-6 border-t border-slate-150 dark:border-slate-800/80 pt-12">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Recently Viewed Stays
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {cabins.map((recentCabin) => (
                    <div
                        key={recentCabin.id}
                        onClick={() => navigate(`/cabin/${recentCabin.id}`)}
                        className="group cursor-pointer space-y-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-3.5 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img
                                src={recentCabin.image_url}
                                alt={recentCabin.name}
                                className="h-full w-full object-cover group-hover:scale-103 transition duration-500"
                            />
                        </div>
                        <div className="px-1.5 flex items-center justify-between">
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-sky-600 dark:group-hover:text-sky-450 transition truncate pr-2">
                                {recentCabin.name}
                            </h4>
                            <span className="font-black text-slate-950 dark:text-sky-400 shrink-0 text-sm">
                                ${recentCabin.price_per_night}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;