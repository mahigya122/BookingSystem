import { motion } from "framer-motion";

interface SectionHeaderProps {
    label: string;
    title: string;
    subtitle: string;
    center?: boolean;
    highlightIndex?: number;
    className?: string;
}

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.04,
        },
    },
};

const letter = (wi: number, highlightIndex: number) => ({
    hidden: {
        opacity: 0,
        y: 16,
        filter: "blur(6px)",
    },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.5,
            ease: EASE,
        },
    },
});

const SectionHeader = ({ 
    label, 
    title, 
    subtitle, 
    center = true, 
    highlightIndex = 999,
    className = ""
}: SectionHeaderProps) => {
    return (
        <div className={`space-y-4 ${center ? "text-center" : "text-left"} ${className}`}>
            {/* Sub heading (Label) */}
            <motion.p
                className="text-sky-500 text-xl font-bold"
                style={{ fontFamily: "'Dancing Script', cursive" }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                viewport={{ once: true }}
            >
                {label}
            </motion.p>

            {/* Main Title */}
            <div className={`space-y-3 ${center ? "flex flex-col items-center" : ""}`}>
                <motion.h2
                    className={`text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight flex flex-wrap ${center ? "justify-center" : "justify-start"}`}
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {title.split(" ").map((word, wi) => (
                        <span key={wi} className="flex mr-2 last:mr-0">
                            {word.split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    className={`inline-block ${wi >= highlightIndex ? "text-sky-500" : ""}`}
                                    variants={letter(wi, highlightIndex)}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span>
                    ))}
                </motion.h2>

                {/* Decorative underline */}
                <motion.div
                    className="h-1 bg-sky-500 rounded-full"
                    initial={{ width: 0, opacity: 0 }}
                    whileInView={{ width: 64, opacity: 1 }}
                    transition={{
                        duration: 0.8,
                        ease: EASE,
                        delay: 0.2,
                    }}
                    viewport={{ once: true }}
                />
            </div>

            {/* Subtitle */}
            <motion.p
                className={`text-slate-500 dark:text-slate-400 text-base font-medium leading-relaxed max-w-md ${center ? "mx-auto" : ""}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.6,
                    ease: EASE,
                    delay: 0.25,
                }}
                viewport={{ once: true }}
            >
                {subtitle}
            </motion.p>
        </div>
    );
};

export default SectionHeader;
