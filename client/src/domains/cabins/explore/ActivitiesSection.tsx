import React, { useMemo } from "react";
import { useActivities } from "@shared/hooks/useActivities";
import { useCabinFiltersContext } from "../contexts/CabinFiltersContext";
import { getOptimizedImageUrl } from "@shared/utils/imageUtils";
import { layoutConfig, pageSpacing } from "@shared/utils/spacing";
import SectionHeader from "@shared/components/ui/SectionHeader";
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
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

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

const activityImages: Record<string, string> = {
    paragliding: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&q=80",
    boating: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    "jungle safari": "https://images.unsplash.com/photo-1516422266228-215b17950c4f?w=800&q=80",
    trekking: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    "bungee jumping": "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=800&q=80",
    cycling: "https://images.unsplash.com/photo-1541625602330-2277a4c4b081?w=800&q=80",
};

const fallbackActivityImage =
    "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800&q=80";

const ActivitiesSection = () => {
    const { activities, isLoading } = useActivities();
    const safeActivities = Array.isArray(activities) ? activities : [];
    const { filters, setFilters, applyFilters } = useCabinFiltersContext();

    const uniqueActivities = useMemo(() => {
        const seen = new Set();
        return safeActivities.filter((a) => {
            if (seen.has(a.name)) return false;
            seen.add(a.name);
            return true;
        });
    }, [safeActivities]);

    if (isLoading) {
        return (
            <section id="activities-section" className={`${pageSpacing.section} relative w-full`}>
                <div className={layoutConfig.container}>
                    <SectionHeader
                        label="Things To Do"
                        title="Activities for Every Traveller"
                        subtitle="Filter cabins by the activities you love and make every moment an adventure."
                        highlightIndex={2}
                        className={layoutConfig.headerMargin}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:h-[400px]">
                        <div className="row-span-2 rounded-2xl md:rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse aspect-[4/5] md:aspect-auto" />
                        {[0, 1, 2, 3].map((_, idx) => (
                            <div
                                key={idx}
                                className={`rounded-2xl md:rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse ${idx >= 2 ? "hidden md:block" : ""}`}
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!isLoading && uniqueActivities.length === 0) return null;

    const getActivityImage = (activity: any) => {
        if (activity.image_url && !activity.image_url.includes("faker"))
            return getOptimizedImageUrl(activity.image_url, 'card');

        const name = activity.name.toLowerCase();
        return getOptimizedImageUrl(activityImages[name] || fallbackActivityImage, 'card');
    };

    const handleActivityClick = (actId: string) => {
        const newFilters = {
            ...filters,
            activity_id: filters.activity_id === actId ? null : actId
        };
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    return (
        <section id="activities-section" className={`${pageSpacing.section} relative w-full`}>
            <div className={layoutConfig.container}>
                <SectionHeader
                    label="Things To Do"
                    title="Activities for Every Traveller"
                    subtitle="Filter cabins by the activities you love and make every moment an adventure."
                    highlightIndex={2}
                    className={layoutConfig.headerMargin}
                />

            {/* GRID  */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:h-[400px]">

                {/* FEATURE CARD */}
                {uniqueActivities[0] && (() => {
                    const activity = uniqueActivities[0];
                    const Icon =
                        (activity.icon &&
                            iconMap[activity.icon.toLowerCase()]) ||
                        Sparkles;
                    const img = getActivityImage(activity);
                    const isSelected = filters.activity_id === activity.id;

                    return (
                        <motion.div
                            key={activity.id}
                            onClick={() => handleActivityClick(activity.id)}
                            className={`row-span-2 group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-400 aspect-[4/5] md:aspect-auto ${isSelected
                                ? "ring-4 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900"
                                : ""
                                }`}
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.7,
                                ease: EASE,
                            }}
                            viewport={{ once: true }}
                        >
                            <img
                                src={img}
                                alt={activity.name}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&q=80";
                                }}
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            <div className="absolute bottom-0 left-0 p-4 md:p-5 w-full">
                                <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 mb-3">
                                    <Icon className="h-5 w-5" />
                                </div>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <h3 className="text-white font-black text-xs md:text-sm leading-tight">
                                            {activity.name}
                                        </h3>
                                        <p className="text-white/60 text-[9px] md:text-[10px] line-clamp-1">
                                            {activity.description}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <span className="bg-sky-500 text-white font-black text-[8px] md:text-[9px] uppercase tracking-widest px-2 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-lg">Active</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })()}

                {/* OTHER CARDS */}
                {uniqueActivities.slice(1, 5).map((activity, idx) => {
                    const Icon =
                        (activity.icon &&
                            iconMap[activity.icon.toLowerCase()]) ||
                        Sparkles;
                    const img = getActivityImage(activity);
                    const isSelected = filters.activity_id === activity.id;

                    return (
                        <motion.div
                            key={activity.id}
                            onClick={() => handleActivityClick(activity.id)}
                            className={`group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-400 ${isSelected
                                ? "ring-4 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900"
                                : ""
                                } ${idx >= 2 ? "hidden md:block" : ""}`}
                            initial={{
                                opacity: 0,
                                y: 25,
                                scale: 0.98,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            transition={{
                                duration: 0.65,
                                delay: idx * 0.08,
                                ease: EASE,
                            }}
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <img
                                src={img}
                                alt={activity.name}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&q=80";
                                }}
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                            <div className="absolute bottom-0 left-0 p-3 md:p-4 w-full flex items-end justify-between">
                                <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-sky-400" />
                                    <p className="text-white font-black text-[10px] md:text-xs leading-tight">
                                        {activity.name}
                                    </p>
                                </div>
                                {isSelected && (
                                    <span className="bg-sky-500 text-white font-black text-[7px] md:text-[8px] uppercase tracking-widest px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full shadow-lg">Active</span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            </div>
        </section>
    );
};

export default React.memo(ActivitiesSection);
