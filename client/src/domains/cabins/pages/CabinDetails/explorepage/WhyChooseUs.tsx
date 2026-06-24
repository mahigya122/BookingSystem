import React from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { layoutConfig, pageSpacing } from "@shared/utils/spacing";
import SectionHeader from "@shared/components/ui/SectionHeader";

const advantages = [
    {
        title: "Expert Guidance",
        desc: "Our local hosts share culture, history, and hidden cabin secrets often missed by visitors.",
    },
    {
        title: "Best Price Guarantee",
        desc: "Find a lower price anywhere? We match it — every time, no questions asked.",
    },
    {
        title: "Safety and Security",
        desc: "Every cabin is verified. Your booking, payment, and stay are fully protected.",
    },
];

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const WhyChooseUs = () => (
    <section className={`relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/30 ${pageSpacing.section} w-full`}>
        {/* Dashed circle decoration top-right */}
        <svg className="absolute -top-12 -right-12 w-64 h-64 pointer-events-none" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="90" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 6" opacity="0.1" />
        </svg>

        {/* Decorative elements */}
        <div className="absolute top-32 right-[40%] w-48 h-48 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-16 left-[10%] w-72 h-72 bg-emerald-200/10 rounded-full blur-3xl pointer-events-none" />

        <div className={`${layoutConfig.container} grid md:grid-cols-2 gap-16 items-center relative z-10`}>
            {/* Left — text */}
            <div className="space-y-6">
                <SectionHeader
                    label="Why Choose Us"
                    title="What Are Our Advantages"
                    subtitle="We've obsessed over every detail so your cabin stay is seamless from first click to final morning coffee."
                    center={false}
                    highlightIndex={3}
                />

                <div className="grid sm:grid-cols-1 gap-4 pt-2">
                    {advantages.map(({ title, desc }, idx) => (
                        <motion.div
                            key={title}
                            className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-900/50 transition-colors duration-300"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 + idx * 0.1, ease: EASE }}
                            viewport={{ once: true }}
                        >
                            <div className="h-6 w-6 rounded-full bg-sky-500 flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/20">
                                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{title}</p>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5 leading-relaxed font-medium">{desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Right — overlapping photos */}
            <motion.div
                className="relative h-[500px] hidden md:block"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: EASE }}
                viewport={{ once: true }}
            >
                {/* Passport emoji floating */}
                <div className="absolute top-0 left-16 text-5xl z-30 drop-shadow-2xl animate-bounce-slow select-none pointer-events-none"></div>

                {/* Main background image */}
                <div className="absolute right-0 top-8 w-64 h-[350px] lg:w-80 lg:h-[450px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 rotate-2 z-10 group">
                    <img
                        src="https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&q=80"
                        alt="Snowy cabin"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </div>
                {/* Middle connector image */}
                <div className="absolute left-20 top-28 w-55 h-56 lg:w-48 lg:h-64 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 rotate-12 z-15 group">
                    <img
                        src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=500&q=80"
                        alt="Cozy cabin atmosphere"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </div>
                {/* Overlapping front image */}
                <div className="absolute left-10 bottom-16 w-52 h-64 lg:w-60 lg:h-72 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 -rotate-6 z-20 group">
                    <img
                        src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80"
                        alt="Guests enjoying cabin"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                </div>

                {/* Experience Badge */}
                <div className="absolute bottom-8 right-8 bg-sky-500 text-white p-6 rounded-[2rem] shadow-2xl z-30 rotate-3">
                    <p className="text-2xl font-black">10+</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Years Experience</p>
                </div>
            </motion.div>
        </div>
    </section>
);

export default React.memo(WhyChooseUs);
