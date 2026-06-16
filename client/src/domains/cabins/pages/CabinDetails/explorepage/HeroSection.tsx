import { useUser } from "@shared/hooks";
import { useCabinFiltersContext } from "../../../contexts/CabinFiltersContext";

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

const HeroSection = () => {
    const { user } = useUser();
    const { setIsSearching, setSidebarOpen } = useCabinFiltersContext();

    const handleExplore = () => {
        setIsSearching(true);
        setSidebarOpen(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <section className="relative min-h-[80vh] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950/20 flex items-center">
            {/* Decorative dashed circle BG */}
            <DashedCircle className="absolute -top-16 -right-16 w-96 h-96 pointer-events-none opacity-40" />
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

            <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 pt-10 pb-6 md:pt-16 md:pb-12 lg:pt-20 lg:pb-16 grid md:grid-cols-2 gap-16 items-center max-w-[1400px] mx-auto">
                {/* Left — text */}
                <div className="space-y-8">
                    {/* Cursive sub-label like the reference */}
                    <p
                        className="text-sky-500 dark:text-sky-400 text-2xl font-bold"
                        style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                        {user ? `Welcome back, ${user.email?.split("@")[0]}! ✨` : "Your Next Escape Awaits ✈️"}
                    </p>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] text-slate-900 dark:text-white tracking-tight">
                        Discover Your
                        <span className="block text-sky-500 drop-shadow-sm">Perfect Stay</span>
                    </h1>

                    <p className="text-slate-500 dark:text-slate-400 text-xl max-w-lg leading-relaxed font-medium">
                        Unique cabins, unforgettable experiences, and nature escapes — handpicked just for you.
                    </p>

                    <div className="flex flex-wrap gap-6 pt-4">
                        <button
                            onClick={handleExplore}
                            className="rounded-full bg-sky-500 hover:bg-sky-600 text-white font-black px-10 py-5 text-base shadow-2xl shadow-sky-200 dark:shadow-none transition-all duration-300 hover:-translate-y-1.5 hover:shadow-sky-300 active:scale-95"
                        >
                            Explore Cabins ✈️
                        </button>
                    </div>
                </div>

                {/* Right — photo collage (like image 1 reference) */}
                <div className="relative h-[550px] hidden md:block">
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
                    
                    {/* Floating badge */}
                    <div className="absolute bottom-20 right-10 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl px-6 py-4 flex items-center gap-3 border border-sky-100 dark:border-sky-900/30 z-30 animate-bounce-slow">
                        <span className="text-3xl">🏡</span>
                        <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white">Top Rated</p>
                            <p className="text-xs text-slate-400 font-bold">This week</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;