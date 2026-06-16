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
import { motion } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1];

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

const TITLE = "Activities for Every Traveller";

const ActivitiesSection = () => {
    const { activities = [], isLoading } = useActivities();
    const { filters, setFilters, applyFilters } = useCabinFiltersContext();

    const uniqueActivities = useMemo(() => {
        const seen = new Set();
        return activities.filter((a) => {
            if (seen.has(a.name)) return false;
            seen.add(a.name);
            return true;
        });
    }, [activities]);

    if (isLoading || uniqueActivities.length === 0) return null;

    const getActivityImage = (activity: any) => {
        if (activity.image_url && !activity.image_url.includes("faker"))
            return activity.image_url;

        const name = activity.name.toLowerCase();
        return activityImages[name] || fallbackActivityImage;
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
        <section id="activities-section" className="pt-12 pb-16 relative w-full">

            {/* PREMIUM HEADER  */}
            <motion.div className="text-center space-y-3 mb-10">

                {/* Sub heading */}
                <motion.p
                    className="text-sky-500 text-xl font-bold"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    viewport={{ once: true }}
                >
                    Things To Do
                </motion.p>

                {/* MAGIC LETTER */}
                <motion.h2
                    className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight flex flex-wrap justify-center"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {TITLE.split(" ").map((word, wi) => (
                        <span key={wi} className="flex mr-2">
                            {word.split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    className="inline-block"
                                    initial={{
                                        opacity: 0,
                                        y: 18,
                                        filter: "blur(6px)",
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                        filter: "blur(0px)",
                                    }}
                                    transition={{
                                        duration: 0.45,
                                        delay: wi * 0.12 + i * 0.03,
                                        ease: EASE,
                                    }}
                                    viewport={{ once: true }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span>
                    ))}
                </motion.h2>

                {/* growing line */}
                <motion.div
                    className="h-1 w-16 bg-sky-500 mx-auto rounded-full"
                    initial={{ width: 0, opacity: 0 }}
                    whileInView={{ width: 64, opacity: 1 }}
                    transition={{
                        duration: 0.8,
                        ease: EASE,
                        delay: 0.2,
                    }}
                    viewport={{ once: true }}
                />

                {/* subtitle */}
                <motion.p
                    className="text-slate-500 dark:text-slate-400 text-base max-w-md mx-auto font-medium leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        ease: EASE,
                        delay: 0.25,
                    }}
                    viewport={{ once: true }}
                >
                    Filter cabins by the activities you love and make every moment an adventure.
                </motion.p>
            </motion.div>

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
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            <div className="absolute bottom-0 left-0 p-4 md:p-5 w-full">
                                <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 mb-3">
                                    <Icon className="h-5 w-5" />
                                </div>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <h3 className="text-white font-black text-sm md:text-base leading-tight">
                                            {activity.name}
                                        </h3>
                                        <p className="text-white/60 text-[10px] md:text-xs line-clamp-1">
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
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                            <div className="absolute bottom-0 left-0 p-3 md:p-4 w-full flex items-end justify-between">
                                <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-sky-400" />
                                    <p className="text-white font-black text-xs md:text-sm leading-tight">
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
        </section>
    );
};

export default ActivitiesSection;