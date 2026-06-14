import { useMemo } from "react";
import { useActivities } from "@shared/hooks/useActivities";
import { useCabinFiltersContext } from "../../../contexts/CabinFiltersContext";
import { 
    Mountain, 
    Snowflake, 
    Fish, 
    Waves, 
    Bike, 
    Flame, 
    Sparkles, 
    Compass,
    Map,
    Tent,
    Trees
} from "lucide-react";

const iconMap: Record<string, any> = {
    mountain: Mountain,
    snowflake: Snowflake,
    fish: Fish,
    waves: Waves,
    bike: Bike,
    flame: Flame,
    sparkles: Sparkles,
    compass: Compass,
    map: Map,
    tent: Tent,
    trees: Trees,
};

const ActivitiesSection = () => {
    const { activities = [], isLoading } = useActivities();
    const { filters, setFilters, applyFilters } = useCabinFiltersContext();

    const uniqueActivities = useMemo(() => {
        const seen = new Set();
        return activities.filter(activity => {
            if (seen.has(activity.name)) return false;
            seen.add(activity.name);
            return true;
        });
    }, [activities]);

    if (isLoading || uniqueActivities.length === 0) return null;

    const colors = [
        { color: "text-emerald-500", bg: "bg-emerald-50" },
        { color: "text-sky-500", bg: "bg-sky-50" },
        { color: "text-blue-500", bg: "bg-blue-50" },
        { color: "text-teal-500", bg: "bg-teal-50" },
        { color: "text-orange-500", bg: "bg-orange-50" },
        { color: "text-rose-500", bg: "bg-rose-50" },
    ];

    const handleActivityClick = (actId: string) => {
        const newFilters = {
            ...filters,
            activity_id: filters.activity_id === actId ? null : actId
        };
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    return (
        <section className="space-y-10">
            <div className="text-center space-y-2">
                <p className="text-sky-400 text-xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    Things To Do
                </p>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white">Activities for Every Traveller</h2>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                    Filter cabins by the activities you love and make every moment an adventure.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {uniqueActivities.slice(0, 12).map((activity, index) => {
                    const Icon = (activity.icon ? iconMap[activity.icon.toLowerCase()] : null) || Sparkles;
                    const style = colors[index % colors.length];
                    const isSelected = filters.activity_id === activity.id;
                    
                    return (
                        <div
                            key={activity.id}
                            onClick={() => handleActivityClick(activity.id)}
                            className={`group flex flex-col items-center gap-3 rounded-3xl ${style.bg} p-5 text-center cursor-pointer hover:-translate-y-2 hover:shadow-lg transition-all duration-300 border-2 ${
                                isSelected ? "border-sky-500 ring-2 ring-sky-300 dark:ring-sky-900" : "border-transparent hover:border-sky-100"
                            }`}
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <Icon className={`h-7 w-7 ${style.color}`} strokeWidth={1.8} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">{activity.name}</p>
                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{activity.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default ActivitiesSection;