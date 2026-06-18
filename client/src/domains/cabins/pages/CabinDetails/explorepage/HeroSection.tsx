import { useUser } from "@shared/hooks";
import { useCabinFiltersContext } from "../../../contexts/CabinFiltersContext";
import { motion } from "framer-motion";
import { pageSpacing, layoutConfig } from "@shared/utils/spacing";
import { Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Airplane = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 80 80" fill="none">
        <path d="M10 40 L70 15 L60 40 L70 65 Z" fill="currentColor" opacity="0.18" />
        <path d="M60 40 L30 50 L35 40 L30 30 Z" fill="currentColor" opacity="0.25" />
    </svg>
);

const Palm = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 140" fill="none">
        <rect x="46" y="60" width="8" height="80" rx="4" fill="#4ade80" opacity="0.5" />
        <ellipse cx="50" cy="55" rx="30" ry="18" fill="#22c55e" opacity="0.4" transform="rotate(-20 50 55)" />
        <ellipse cx="50" cy="50" rx="26" ry="14" fill="#16a34a" opacity="0.45" transform="rotate(15 50 50)" />
        <ellipse cx="50" cy="45" rx="22" ry="12" fill="#4ade80" opacity="0.5" transform="rotate(-35 50 45)" />
    </svg>
);

const DashedCircle = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="90" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 6" opacity="0.25" />
    </svg>
);

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const HeroSection = () => {
    const { user } = useUser();
    const { setIsSearching, setSidebarOpen } = useCabinFiltersContext();
    const navigate = useNavigate();

    const handleExplore = () => {
        setIsSearching(true);
        setSidebarOpen(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const welcomeTitle = user ? `Welcome back, ${user.email?.split("@")[0]}!` : "Your Next Escape Awaits";

    return (
        <section className={`relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950/20 pt-16 pb-16`}>

            {/* Decorative dashed circle BG */}
            <DashedCircle className="absolute top-0 -right-16 w-96 h-96 pointer-events-none opacity-40" />
            <DashedCircle className="absolute bottom-0 -left-20 w-72 h-72 pointer-events-none opacity-40" />

            {/* Airplane decorations */}
            <Airplane className="absolute top-24 left-10 w-16 h-16 text-sky-400 -rotate-12 pointer-events-none" />
            <Airplane className="absolute bottom-32 right-24 w-10 h-10 text-sky-300 rotate-45 pointer-events-none" />

            {/* Palm tree */}

            <Palm className="absolute bottom-0 left-[10%] w-24 h-32 pointer-events-none" />
            <Palm className="absolute bottom-0 right-[5%] w-16 h-24 pointer-events-none opacity-60" />

            {/* Floating polaroid photo snippets */}
            <div className="absolute top-24 right-[42%] w-16 h-20 rounded-lg bg-white shadow-lg rotate-6 overflow-hidden border-2 border-white pointer-events-none hidden lg:block">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&q=70" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-40 right-[35%] w-14 h-18 rounded-lg bg-white shadow-md -rotate-8 overflow-hidden border-2 border-white pointer-events-none hidden lg:block">
                <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=100&q=70" alt="" className="w-full h-full object-cover" />
            </div>

            <div className={`relative z-10 ${layoutConfig.container} grid md:grid-cols-2 gap-16 items-center`}>
                {/* Left — text */}
                <div className="space-y-8">
                    {/* Cursive sub-label with Magic Letter animation */}
                    <motion.h2
                        className="text-sky-500 dark:text-sky-400 text-2xl font-bold flex flex-wrap"
                        style={{ fontFamily: "'Dancing Script', cursive" }}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {welcomeTitle.split(" ").map((word, wi) => (
                            <span key={wi} className="flex mr-3 last:mr-0">
                                {word.split("").map((char, i) => (
                                    <motion.span
                                        key={i}
                                        className="inline-block"
                                        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        transition={{
                                            duration: 0.4,
                                            delay: wi * 0.1 + i * 0.03,
                                            ease: EASE
                                        }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                        <motion.span
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, type: "spring" }}
                        >
                            {user ? " 🎊" : " ✈️"}
                        </motion.span>
                    </motion.h2>

                    <motion.h1
                        className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] text-slate-900 dark:text-white tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                    >
                        Discover Your
                        <span className="block text-sky-500 drop-shadow-sm">Perfect Stay</span>
                    </motion.h1>

                    <motion.p
                        className="text-slate-500 dark:text-slate-400 text-xl max-w-lg leading-relaxed font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
                    >
                        Unique cabins, unforgettable experiences, and nature escapes. handpicked just for you.
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap gap-6 pt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
                    >
                        <button
                            onClick={handleExplore}
                            className="rounded-full bg-sky-500 hover:bg-sky-600 text-white font-black px-10 py-5 text-base shadow-2xl shadow-sky-200 dark:shadow-none transition-all duration-300 hover:-translate-y-1.5 hover:shadow-sky-300 active:scale-95"
                        >
                            Explore Cabins
                        </button>
                        
                        {user && (
                            <button
                                onClick={() => {
                                    setIsSearching(false);
                                    navigate('/bookings');
                                }}
                                className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-black px-10 py-5 text-base hover:border-sky-200 dark:hover:border-sky-800 hover:text-sky-600 transition-all duration-300 hover:-translate-y-1.5 active:scale-95"
                            >
                                <Compass size={20} />
                                View My Trips
                            </button>
                        )}
                    </motion.div>
                </div>

                {/* Right — photo collage */}
                <motion.div
                    className="relative h-[550px] hidden md:block"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: EASE, delay: 0.5 }}
                >
                    {/* Main large image */}
                    <div className="absolute right-0 top-10 w-64 h-80 lg:w-72 lg:h-96 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 rotate-3 z-20">
                        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" alt="Mountain cabin" className="w-full h-full object-cover" />
                    </div>
                    {/* Second image overlapping */}
                    <div className="absolute left-10 top-0 w-56 h-72 lg:w-64 lg:h-80 rounded-[3rem] overflow-hidden shadow-xl border-8 border-white dark:border-slate-800 -rotate-6 z-10">
                        <img src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&q=80" alt="Cosy cabin" className="w-full h-full object-cover" />
                    </div>
                    {/* Third small image bottom */}
                    <div className="absolute left-32 bottom-4 w-48 h-56 lg:w-56 lg:h-64 rounded-[3rem] overflow-hidden shadow-lg border-8 border-white dark:border-slate-800 rotate-2 z-10">
                        <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&q=80" alt="Lake cabin" className="w-full h-full object-cover" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
