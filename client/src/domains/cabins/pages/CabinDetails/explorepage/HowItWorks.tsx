import { Search, CalendarCheck, ThumbsUp } from "lucide-react";

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

const HowItWorks = () => (
    <section className="relative bg-slate-50 dark:bg-slate-900/40 pt-2 pb-6 md:pt-8 md:pb-12 lg:pt-12 lg:pb-16 overflow-hidden w-full h-full flex flex-col justify-center">
        {/* Airplane + dashed path (reference image 5 layout) */}
        <svg
            className="absolute top-32 left-0 right-0 w-full h-16 pointer-events-none"
            viewBox="0 0 900 60"
            preserveAspectRatio="none"
            fill="none"
        >
            {/* Dashed wavy path */}
            <path
                d="M60 30 Q200 5 300 30 Q400 55 500 30 Q600 5 700 30 Q800 55 840 30"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="8 6"
                opacity="0.2"
            />
        </svg>

        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 relative z-10">
            <div className="text-center space-y-2 mb-6 md:mb-8 lg:mb-10">
                <p className="text-sky-500 text-xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    How It Works
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                    Hassle Free Booking,<br />Plan in <span className="text-sky-500">Minutes</span>
                </h2>
                <div className="h-1 w-16 bg-sky-500 mx-auto rounded-full mt-1" />
                <p className="text-slate-500 dark:text-slate-400 text-base max-w-md mx-auto font-medium leading-relaxed">
                    A simple guide to your seamless stay.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
                {steps.map(({ icon: Icon, step, title, desc }) => (
                    <div key={step} className="flex flex-col items-center text-center gap-4 group">
                        {/* Circle icon (like reference image 5) */}
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-lg group-hover:scale-110 group-hover:border-sky-400 transition-all duration-500">
                            <Icon className="h-7 w-7 text-slate-800 dark:text-white group-hover:text-sky-500 transition-colors" strokeWidth={1.5} />
                            
                            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-sky-500 text-white flex items-center justify-center text-[8px] font-black border-2 border-white dark:border-slate-800 shadow-lg">
                                {step.split(" ")[1]}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[220px]">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default HowItWorks;