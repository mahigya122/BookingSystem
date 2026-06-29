import { 
    Wifi, 
    Coffee, 
    Wind, 
    Utensils, 
    Tag, 
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
    Trees,
    Anchor,
    Eye,
    Footprints,
    Heart
} from "lucide-react";
import type { Activity, Offer } from "@shared/types";

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
    anchor: Anchor,
    eye: Eye,
    footprints: Footprints,
    heart: Heart,
    wind: Wind,
};

const getIconForActivity = (activity: Activity) => {
    if (activity.icon && iconMap[activity.icon.toLowerCase()]) {
        return iconMap[activity.icon.toLowerCase()];
    }
    const nameLower = activity.name.toLowerCase();
    
    // Smart keyword matching for seeded database activities
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

interface CabinAmenitiesProps {
    activities?: Activity[];
    offers?: Offer[];
}

const CabinAmenities = ({ 
    activities = [], 
    offers = []
}: CabinAmenitiesProps) => {
    // Default amenities if none are specifically linked
    const defaultAmenities = [
        { icon: Wifi, label: "High-speed WiFi" },
        { icon: Utensils, label: "Fully Loaded Kitchen" },
        { icon: Wind, label: "Climate Control" },
        { icon: Coffee, label: "Espresso Maker" },
    ];

    return (
        <div className="space-y-6 border-t border-slate-100 dark:border-slate-800/80 pt-6">
            <div className="space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-450 dark:text-slate-500">
                    Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {defaultAmenities.map(({ icon: Icon, label }) => (
                        <div
                            key={label}
                            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/30"
                        >
                            <Icon className="h-4 w-4 text-sky-500 shrink-0" />
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {activities.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-450 dark:text-slate-500">
                            Activities
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {activities.map((activity) => {
                            const Icon = getIconForActivity(activity);
                            return (
                                <div
                                    key={activity.id}
                                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                                >
                                    <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 bg-sky-50 dark:bg-sky-950/30 text-sky-500">
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0 pr-1">
                                        <span className="text-xs font-semibold block truncate text-slate-800 dark:text-slate-200 leading-tight">
                                            {activity.name}
                                        </span>
                                        {activity.price && activity.price > 0 && (
                                            <span className="text-[9px] font-bold block leading-none mt-0.5 text-sky-600 dark:text-sky-400">
                                                ${activity.price}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {offers.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-450 dark:text-slate-500">
                            Perks
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {offers.map((offer) => {
                            return (
                                <div
                                    key={offer.id}
                                    className="flex flex-col gap-1.5 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                                >
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <Tag className="h-3.5 w-3.5 text-emerald-500" />
                                        <span className="font-black uppercase tracking-widest text-[9px] text-emerald-655 dark:text-emerald-455">
                                            {offer.name || (offer as any).title}
                                        </span>
                                    </div>
                                    <p className="text-xs font-extrabold leading-snug text-slate-800 dark:text-slate-200">
                                        {offer.description || "Special offer available for this cabin."}
                                    </p>
                                    {offer.discount_percent > 0 && (
                                        <div className="mt-1.5 inline-flex items-center self-start px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600">
                                            Save {offer.discount_percent}% off stay
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CabinAmenities;
