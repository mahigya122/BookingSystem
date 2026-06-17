import { Wifi, Coffee, Wind, Utensils, Star, Tag, CheckCircle2 } from "lucide-react";
import type { Activity, Offer } from "@shared/types";

interface CabinAmenitiesProps {
    activities?: Activity[];
    offers?: Offer[];
    selectedActivities: string[];
    selectedOffers: string[];
    onToggleActivity: (id: string) => void;
    onToggleOffer: (id: string) => void;
}

const CabinAmenities = ({ 
    activities = [], 
    offers = [], 
    selectedActivities, 
    selectedOffers, 
    onToggleActivity, 
    onToggleOffer 
}: CabinAmenitiesProps) => {
    // Default amenities if none are specifically linked
    const defaultAmenities = [
        { icon: Wifi, label: "High-speed WiFi" },
        { icon: Utensils, label: "Fully Loaded Kitchen" },
        { icon: Wind, label: "Climate Control" },
        { icon: Coffee, label: "Espresso Maker" },
    ];

    return (
        <div className="space-y-12 border-t border-slate-100 dark:border-slate-800/80 pt-8">
            <div className="space-y-6">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Amenities & features
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {defaultAmenities.map(({ icon: Icon, label }) => (
                        <div
                            key={label}
                            className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/30"
                        >
                            <Icon className="h-5 w-5 text-sky-500 shrink-0" />
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {activities.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                            Available Activities
                        </h2>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tap to add to booking</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activities.map((activity) => {
                            const isSelected = selectedActivities.includes(activity.id);
                            return (
                                <button
                                    key={activity.id}
                                    onClick={() => onToggleActivity(activity.id)}
                                    className={`flex items-center justify-between p-5 rounded-[2rem] border transition-all duration-300 text-left ${
                                        isSelected 
                                            ? "bg-sky-500 border-sky-400 shadow-lg shadow-sky-200 dark:shadow-none translate-y-[-2px]" 
                                            : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-sky-300"
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? "bg-white/20" : "bg-sky-50 dark:bg-sky-950/30"}`}>
                                            <Star className={`h-6 w-6 ${isSelected ? "text-white" : "text-sky-500"}`} />
                                        </div>
                                        <div>
                                            <span className={`font-black block ${isSelected ? "text-white" : "text-slate-900 dark:text-white"}`}>{activity.name}</span>
                                            <span className={`text-xs font-bold ${isSelected ? "text-white/80" : "text-sky-600 dark:text-sky-400"}`}>
                                                {activity.price && activity.price > 0 ? `+$${activity.price} per stay` : "FREE Experience"}
                                            </span>
                                        </div>
                                    </div>
                                    {isSelected && <CheckCircle2 className="h-6 w-6 text-white" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {offers.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                            Special Perks
                        </h2>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Applicable to stay</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {offers.map((offer) => {
                            const isSelected = selectedOffers.includes(offer.id);
                            return (
                                <button
                                    key={offer.id}
                                    onClick={() => onToggleOffer(offer.id)}
                                    className={`flex flex-col gap-2 p-6 rounded-[2rem] border transition-all duration-300 text-left relative overflow-hidden group ${
                                        isSelected 
                                            ? "bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-200 dark:shadow-none translate-y-[-2px]" 
                                            : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-300"
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <Tag className={`h-4 w-4 ${isSelected ? "text-white" : "text-emerald-500"}`} />
                                        <span className={`font-black uppercase tracking-widest text-[10px] ${isSelected ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`}>
                                            {offer.name || (offer as any).title}
                                        </span>
                                    </div>
                                    <p className={`text-sm font-extrabold leading-snug ${isSelected ? "text-white" : "text-slate-900 dark:text-white"}`}>
                                        {offer.description || "Special offer available for this cabin."}
                                    </p>
                                    {offer.discount_percent > 0 && (
                                        <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${isSelected ? "bg-white text-emerald-600" : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600"}`}>
                                            Save {offer.discount_percent}% off stay
                                        </div>
                                    )}
                                    {isSelected && (
                                        <div className="absolute top-4 right-4 animate-scale-in">
                                            <CheckCircle2 className="h-6 w-6 text-white" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CabinAmenities;
