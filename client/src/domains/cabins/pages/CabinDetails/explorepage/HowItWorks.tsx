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
    <section className="relative rounded-3xl bg-slate-50 px-8 py-14 space-y-10 overflow-hidden">
        {/* Airplane + dashed path (reference image 5 layout) */}
        <svg
            className="absolute top-28 left-0 right-0 w-full h-16 pointer-events-none"
            viewBox="0 0 900 60"
            preserveAspectRatio="none"
            fill="none"
        >
            {/* Dashed wavy path */}
            <path
                d="M60 30 Q200 5 300 30 Q400 55 500 30 Q600 5 700 30 Q800 55 840 30"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="8 6"
                opacity="0.5"
            />
            {/* Plane at start */}
            <text x="18" y="38" fontSize="20" opacity="0.4">📍</text>
            {/* Plane at end */}
            <text x="855" y="22" fontSize="20" opacity="0.4">✈️</text>
        </svg>

        <div className="text-center space-y-2">
            <p className="text-sky-400 text-xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
                How It Works
            </p>
            <h2 className="text-4xl font-black text-slate-900">Hassle Free Booking,<br />Plan in Minutes</h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
                A simple guide to your seamless stay — follow these easy steps to book your next adventure!
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative z-10 pt-6">
            {steps.map(({ icon: Icon, step, title, desc }) => (
                <div key={step} className="flex flex-col items-center text-center gap-4">
                    {/* Circle icon (like reference image 5) */}
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white border-2 border-slate-200 shadow-md">
                        <Icon className="h-8 w-8 text-slate-700" strokeWidth={1.6} />
                    </div>
                    {/* Sky-blue step pill */}
                    <span className="rounded-full bg-sky-400 text-white text-xs font-bold px-5 py-1.5 shadow-sm shadow-sky-200">
                        {step}
                    </span>
                    <div>
                        <h3 className="text-lg font-black text-slate-900">{title}</h3>
                        <p className="text-slate-400 text-sm mt-1 max-w-xs">{desc}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export default HowItWorks;