import { useUser } from "@shared/auth_hooks";

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

    const scrollToPopular = () => {
        document.getElementById("popular-cabins")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="relative min-h-[88vh] overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex items-center">
            {/* Decorative dashed circle BG */}
            <DashedCircle className="absolute -top-16 -right-16 w-96 h-96 pointer-events-none" />
            <DashedCircle className="absolute bottom-0 -left-20 w-72 h-72 pointer-events-none" />

            {/* Airplane decorations */}
            <Airplane className="absolute top-12 left-10 w-16 h-16 text-sky-400 -rotate-12 pointer-events-none" />
            <Airplane className="absolute bottom-20 right-24 w-10 h-10 text-sky-300 rotate-45 pointer-events-none" />

            {/* Palm tree */}
            <Palm className="absolute bottom-0 left-16 w-24 h-32 pointer-events-none" />
            <Palm className="absolute bottom-0 right-10 w-16 h-24 pointer-events-none opacity-60" />

            {/* Floating polaroid photo snippets */}
            <div className="absolute top-16 right-[38%] w-16 h-20 rounded-lg bg-white shadow-lg rotate-6 overflow-hidden border-2 border-white pointer-events-none">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&q=70" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-32 right-[30%] w-14 h-18 rounded-lg bg-white shadow-md -rotate-8 overflow-hidden border-2 border-white pointer-events-none">
                <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=100&q=70" alt="" className="w-full h-full object-cover" />
            </div>

            <div className="relative z-10 w-full px-8 md:px-16 py-16 grid md:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
                {/* Left — text */}
                <div className="space-y-6">
                    {/* Cursive sub-label like the reference */}
                    <p
                        className="text-sky-400 text-xl font-bold"
                        style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                        {user ? `Welcome back, ${user.email?.split("@")[0]}! ✨` : "Your Next Escape Awaits ✈️"}
                    </p>

                    <h1 className="text-5xl md:text-6xl font-black leading-tight text-slate-900">
                        Discover Your
                        <span className="block text-sky-400">Perfect Stay</span>
                    </h1>

                    <p className="text-slate-500 text-lg max-w-md leading-relaxed">
                        Unique cabins, unforgettable experiences, and nature escapes — handpicked just for you.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <button
                            onClick={scrollToPopular}
                            className="rounded-full bg-sky-400 hover:bg-sky-500 text-white font-bold px-8 py-4 text-sm shadow-lg shadow-sky-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-sky-300"
                        >
                            Explore Cabins ✈️
                        </button>
                    </div>

                    {/* Mini trust badges */}
                    <div className="flex items-center gap-6 pt-4">
                        {[["500+", "Cabins"], ["4.9★", "Rating"], ["98%", "Happy Guests"]].map(([val, lbl]) => (
                            <div key={lbl} className="text-center">
                                <p className="text-xl font-black text-slate-900">{val}</p>
                                <p className="text-xs text-slate-400 font-medium">{lbl}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — photo collage (like image 1 reference) */}
                <div className="relative h-[420px] hidden md:block">
                    {/* Main large image */}
                    <div className="absolute right-0 top-4 w-56 h-72 rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-2">
                        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" alt="Mountain cabin" className="w-full h-full object-cover" />
                    </div>
                    {/* Second image overlapping */}
                    <div className="absolute left-4 top-0 w-48 h-60 rounded-3xl overflow-hidden shadow-xl border-4 border-white -rotate-3">
                        <img src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&q=80" alt="Cosy cabin" className="w-full h-full object-cover" />
                    </div>
                    {/* Third small image bottom */}
                    <div className="absolute left-20 bottom-0 w-40 h-44 rounded-3xl overflow-hidden shadow-lg border-4 border-white rotate-1">
                        <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&q=80" alt="Lake cabin" className="w-full h-full object-cover" />
                    </div>
                    {/* Floating badge */}
                    <div className="absolute bottom-16 right-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2 border border-sky-100">
                        <span className="text-2xl">🏡</span>
                        <div>
                            <p className="text-xs font-black text-slate-800">Top Rated</p>
                            <p className="text-xs text-slate-400">This week</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;