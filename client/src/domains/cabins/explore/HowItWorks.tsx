import React from "react";
import { Search, CalendarCheck, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import { layoutConfig, pageSpacing } from "@shared/utils/spacing";
import SectionHeader from "@shared/components/ui/SectionHeader";

const steps = [
    {
        icon: Search,
        step: "Step 01",
        title: "Browse Cabins",
        desc: "Choose your favourite cabin to start your perfect journey.",
    },
    {
        icon: CalendarCheck,
        step: "Step 02",
        title: "Reserve Your Stay",
        desc: "Book your dates and guests easily in just a few clicks.",
    },
    {
        icon: ThumbsUp,
        step: "Step 03",
        title: "Enjoy Your Trip",
        desc: "Relax, explore, and create unforgettable memories!",
    },
];

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const HowItWorks = () => (
    <section className={`relative bg-white dark:bg-slate-950 ${pageSpacing.section} overflow-hidden w-full`}>
        <svg
            className="absolute top-32 left-0 right-0 w-full h-16 pointer-events-none"
            viewBox="0 0 900 60"
            preserveAspectRatio="none"
            fill="none"
        >
            <path
                d="M60 30 Q200 5 300 30 Q400 55 500 30 Q600 5 700 30 Q800 55 840 30"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="8 6"
                opacity="0.2"
            />
        </svg>

        <div className={layoutConfig.container}>
            <SectionHeader
                label="How It Works"
                title="Hassle Free Booking"
                subtitle="A simple guide to your seamless stay."
                highlightIndex={2}
                className={`relative z-10 ${layoutConfig.headerMargin}`}
            />

            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-8 relative z-10">
                {steps.map(({ icon: Icon, step, title, desc }, idx) => (
                    <motion.div
                        key={step}
                        className="flex flex-col items-center text-center gap-2 md:gap-4 group"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 + idx * 0.1, ease: EASE }}
                        viewport={{ once: true }}
                    >
                        <div className="relative flex h-10 w-10 md:h-16 md:w-16 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-lg group-hover:scale-110 group-hover:border-sky-400 transition-all duration-500">
                            <Icon className="h-4 w-4 md:h-7 md:w-7 text-slate-800 dark:text-white group-hover:text-sky-500 transition-colors" strokeWidth={1.5} />
                            <div className="absolute -top-1 -right-1 h-4 w-4 md:h-6 md:w-6 rounded-full bg-sky-500 text-white flex items-center justify-center text-[6px] md:text-[8px] font-black border-2 border-white dark:border-slate-800 shadow-lg">
                                {step.split(" ")[1]}
                            </div>
                        </div>

                        <div className="space-y-0.5 md:space-y-1">
                            <h3 className="text-[11px] md:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight">{title}</h3>
                            <p className="text-[9px] md:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default React.memo(HowItWorks);